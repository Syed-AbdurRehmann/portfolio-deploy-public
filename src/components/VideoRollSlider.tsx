import { type TouchEvent as ReactTouchEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";
import { type Video } from "@/data/videos";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import VideoThumbnailImage from "@/components/VideoThumbnailImage";

interface VideoRollSliderProps {
  videos: Video[];
  onPlay: (video: Video) => void;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const VideoRollSlider = ({ videos, onPlay }: VideoRollSliderProps) => {
  const { shouldReduceEffects, isMobile } = usePerformanceMode();
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const isMobileSlider = isMobile || isCoarsePointer;
  const shouldLoop = videos.length > 1;
  const loopedVideos = useMemo(() => {
    if (!shouldLoop) {
      return videos;
    }

    return [...videos, ...videos, ...videos];
  }, [shouldLoop, videos]);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const wheelLockedUntilRef = useRef(0);
  const settleTimerRef = useRef<number | null>(null);
  const scrollUnlockTimerRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(() => (videos.length > 1 ? videos.length : 0));
  const [mobileSlideIndex, setMobileSlideIndex] = useState(() => (videos.length > 1 ? 1 : 0));
  const [mobileTransitionEnabled, setMobileTransitionEnabled] = useState(true);

  const mobileLoopedVideos = useMemo(() => {
    if (videos.length <= 1) {
      return videos;
    }

    return [videos[videos.length - 1], ...videos, videos[0]];
  }, [videos]);

  const mobileActiveLogicalIndex = useMemo(() => {
    if (!videos.length) {
      return 0;
    }

    const raw = mobileSlideIndex - 1;
    return ((raw % videos.length) + videos.length) % videos.length;
  }, [mobileSlideIndex, videos.length]);

  const moveMobile = useCallback(
    (direction: 1 | -1) => {
      if (videos.length <= 1) {
        return;
      }

      setMobileTransitionEnabled(true);
      setMobileSlideIndex((prev) => prev + direction);
    },
    [videos.length],
  );

  const onMobileTransitionEnd = useCallback(() => {
    if (videos.length <= 1) {
      return;
    }

    if (mobileSlideIndex === 0) {
      setMobileTransitionEnabled(false);
      setMobileSlideIndex(videos.length);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setMobileTransitionEnabled(true));
      });
      return;
    }

    if (mobileSlideIndex === videos.length + 1) {
      setMobileTransitionEnabled(false);
      setMobileSlideIndex(1);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setMobileTransitionEnabled(true));
      });
    }
  }, [mobileSlideIndex, videos.length]);

  const onMobileTouchStart = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }

    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  }, []);

  const onMobileTouchEnd = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      const touch = event.changedTouches[0];
      if (!touch || touchStartXRef.current === null) {
        return;
      }

      const deltaX = touch.clientX - touchStartXRef.current;
      const deltaY = (touchStartYRef.current ?? touch.clientY) - touch.clientY;

      touchStartXRef.current = null;
      touchStartYRef.current = null;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      if (Math.abs(deltaX) < 24) {
        return;
      }

      moveMobile(deltaX < 0 ? 1 : -1);
    },
    [moveMobile],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const query = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setIsCoarsePointer(query.matches || "ontouchstart" in window);
    };

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!isMobileSlider) {
      return;
    }

    setMobileTransitionEnabled(false);
    setMobileSlideIndex(videos.length > 1 ? 1 : 0);
    const timer = window.setTimeout(() => {
      setMobileTransitionEnabled(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isMobileSlider, videos.length]);

  const getCards = useCallback(
    () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>("[data-slider-card='true']") || []),
    [],
  );

  const getNearestIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return 0;
    }

    const cards = getCards();
    if (!cards.length) {
      return 0;
    }

    const trackCenterX = track.scrollLeft + track.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - trackCenterX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }, [getCards]);

  const centerOnIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    const cards = getCards();
    const card = cards[index];

    if (!track || !card) {
      return;
    }

    const targetLeft = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left: Math.max(0, targetLeft), behavior });
  }, [getCards]);

  const normalizeToMiddleBand = useCallback(
    (index: number) => {
      if (!shouldLoop || videos.length === 0) {
        return index;
      }

      const logicalIndex = ((index % videos.length) + videos.length) % videos.length;
      return videos.length + logicalIndex;
    },
    [shouldLoop, videos.length],
  );

  const snapToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth", normalizeAfter = true) => {
      const boundedIndex = clamp(index, 0, Math.max(loopedVideos.length - 1, 0));
      activeIndexRef.current = boundedIndex;
      setActiveIndex(boundedIndex);

      isProgrammaticScrollRef.current = true;
      centerOnIndex(boundedIndex, behavior);

      if (scrollUnlockTimerRef.current) {
        window.clearTimeout(scrollUnlockTimerRef.current);
      }

      scrollUnlockTimerRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;

        if (!normalizeAfter || !shouldLoop) {
          return;
        }

        const normalized = normalizeToMiddleBand(boundedIndex);
        if (normalized === boundedIndex) {
          return;
        }

        isProgrammaticScrollRef.current = true;
        activeIndexRef.current = normalized;
        setActiveIndex(normalized);
        centerOnIndex(normalized, "auto");

        window.requestAnimationFrame(() => {
          isProgrammaticScrollRef.current = false;
        });
      }, behavior === "auto" ? 0 : 420);
    },
    [centerOnIndex, loopedVideos.length, normalizeToMiddleBand, shouldLoop],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (isMobileSlider || !track || !loopedVideos.length) {
      return;
    }

    const onScroll = () => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }

      settleTimerRef.current = window.setTimeout(() => {
        const nearestIndex = getNearestIndex();
        const currentIndex = activeIndexRef.current;

        if (nearestIndex === currentIndex) {
          snapToIndex(currentIndex, "smooth");
          return;
        }

        const direction = nearestIndex > currentIndex ? 1 : -1;
        snapToIndex(currentIndex + direction, "smooth");
      }, 130);
    };

    const onWheel = (event: WheelEvent) => {
      if (!track) {
        return;
      }

      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();

      const now = Date.now();
      if (now < wheelLockedUntilRef.current) {
        return;
      }

      wheelLockedUntilRef.current = now + 380;

      const direction = event.deltaY > 0 ? 1 : -1;
      snapToIndex(activeIndexRef.current + direction, "smooth");
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        return;
      }

      pointerStartXRef.current = event.clientX;
      pointerStartYRef.current = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        return;
      }

      if (pointerStartXRef.current === null) {
        return;
      }

      const deltaX = event.clientX - pointerStartXRef.current;
      const deltaY = (pointerStartYRef.current ?? event.clientY) - event.clientY;
      pointerStartXRef.current = null;
      pointerStartYRef.current = null;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      if (Math.abs(deltaX) < 24) {
        snapToIndex(activeIndexRef.current, "smooth");
        return;
      }

      const direction = deltaX < 0 ? 1 : -1;
      snapToIndex(activeIndexRef.current + direction, "smooth");
    };

    const onPointerCancel = () => {
      pointerStartXRef.current = null;
      pointerStartYRef.current = null;
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!touch) {
        return;
      }

      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!touch || touchStartXRef.current === null) {
        return;
      }

      const deltaX = touch.clientX - touchStartXRef.current;
      const deltaY = (touchStartYRef.current ?? touch.clientY) - touch.clientY;

      touchStartXRef.current = null;
      touchStartYRef.current = null;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      if (Math.abs(deltaX) < 24) {
        snapToIndex(activeIndexRef.current, "smooth");
        return;
      }

      const direction = deltaX < 0 ? 1 : -1;
      snapToIndex(activeIndexRef.current + direction, "smooth");
    };

    const onResize = () => {
      centerOnIndex(activeIndexRef.current, "auto");
    };

    const initial = shouldLoop ? videos.length : 0;
    snapToIndex(initial, "auto", false);

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("pointerdown", onPointerDown, { passive: true });
    track.addEventListener("pointerup", onPointerUp, { passive: true });
    track.addEventListener("pointercancel", onPointerCancel, { passive: true });
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerCancel);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);

      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }

      if (scrollUnlockTimerRef.current) {
        window.clearTimeout(scrollUnlockTimerRef.current);
      }
    };
  }, [centerOnIndex, getNearestIndex, isMobileSlider, loopedVideos.length, shouldLoop, snapToIndex, videos.length]);

  if (!loopedVideos.length) {
    return null;
  }

  if (isMobileSlider) {
    return (
      <div className="relative">
        <div className="px-[4vw] py-8" onTouchStart={onMobileTouchStart} onTouchEnd={onMobileTouchEnd}>
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${mobileSlideIndex * 100}%)`,
                transition: mobileTransitionEnabled ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
              }}
              onTransitionEnd={onMobileTransitionEnd}
            >
              {mobileLoopedVideos.map((video, index) => {
                const isClone = videos.length > 1 && (index === 0 || index === mobileLoopedVideos.length - 1);
                const isCurrent = videos.length <= 1 ? index === 0 : index === mobileSlideIndex;
                return (
                  <div
                    key={`${video.id}-mobile-${index}`}
                    className="w-full shrink-0 flex justify-center px-2"
                    aria-hidden={isClone}
                  >
                    <button
                      type="button"
                      className="group relative w-[88vw] max-w-[24rem] aspect-[9/16] rounded-[1.5rem] border border-white/15 bg-neutral-950/50 text-left overflow-hidden"
                      tabIndex={isClone ? -1 : 0}
                      aria-hidden={isClone}
                      style={{
                        transform: isCurrent ? "scale(1)" : "scale(0.96)",
                        opacity: isCurrent ? 1 : 0.7,
                        transition: "transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms cubic-bezier(0.22, 1, 0.36, 1)",
                        boxShadow: isCurrent
                          ? "0 20px 60px rgba(66, 164, 245, 0.24)"
                          : "0 8px 24px rgba(0, 0, 0, 0.35)",
                      }}
                      onClick={() => onPlay(video)}
                      aria-label={`Play ${video.title}`}
                    >
                      <VideoThumbnailImage
                        googleDriveLink={video.googleDriveLink}
                        width={1080}
                        alt={video.title}
                        className="h-full w-full object-cover"
                        loading={isCurrent ? "eager" : "lazy"}
                        fallback={<div className="h-full w-full bg-gradient-to-br from-neutral-900 to-neutral-800" />}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/36 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-primary/85 mb-2">{video.category}</p>
                        <h3 className="text-white text-4xl font-display font-black leading-tight line-clamp-2 mb-4">{video.title}</h3>

                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                          <Play className="w-4 h-4" fill="currentColor" />
                          Play Preview
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {videos.map((video, index) => (
              <button
                key={`mobile-dot-${video.id}`}
                type="button"
                onClick={() => {
                  if (videos.length <= 1) {
                    return;
                  }

                  setMobileTransitionEnabled(true);
                  setMobileSlideIndex(index + 1);
                }}
                aria-label={`Show featured video ${index + 1}`}
                className="w-8 h-8 inline-flex items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all ${
                    index === mobileActiveLogicalIndex ? "w-5 bg-primary" : "w-1.5 bg-white/35"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-1">
          Swipe left or right to browse featured videos.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-visible">
      <div
        ref={trackRef}
        className="hide-scrollbar relative z-10 flex items-stretch gap-4 md:gap-6 overflow-x-hidden overflow-y-visible px-[8vw] md:px-[14vw] py-12 md:py-14 touch-pan-y"
        style={{ perspective: shouldReduceEffects ? "900px" : "1700px" }}
        aria-label="Featured videos carousel"
      >
        {loopedVideos.map((video, index) => {
          const isClone = shouldLoop && (index < videos.length || index >= videos.length * 2);
          const rawDistance = index - activeIndex;
          const distance = clamp(rawDistance, -2, 2);
          const abs = Math.abs(distance);
          const isActive = index === activeIndex;

          const rotateY = shouldReduceEffects ? distance * -8 : distance * -18;
          const translateZ = shouldReduceEffects ? (isActive ? 28 : -22) : isActive ? 120 : abs === 1 ? -10 : -90;
          const scale = shouldReduceEffects ? (isActive ? 1 : 0.94) : isActive ? 1 : abs === 1 ? 0.92 : 0.82;
          const opacity = shouldReduceEffects ? (isActive ? 1 : 0.9) : isActive ? 1 : abs === 1 ? 0.78 : 0.45;
          const cornerStretch = shouldReduceEffects || isActive ? 0 : abs === 1 ? (isMobileSlider ? 2 : 4) : isMobileSlider ? 4 : 7;
          const mediaScaleX = shouldReduceEffects || isActive ? 1 : abs === 1 ? (isMobileSlider ? 1.015 : 1.03) : isMobileSlider ? 1.025 : 1.06;
          const mediaShiftX = shouldReduceEffects || isActive ? 0 : distance < 0 ? (isMobileSlider ? -1 : -2.2) : isMobileSlider ? 1 : 2.2;
          const mediaClipPath =
            shouldReduceEffects || isActive
              ? undefined
              : distance < 0
                ? `polygon(${cornerStretch}% 0, 100% 0, ${100 - cornerStretch * 0.35}% 100%, 0 100%)`
                : `polygon(0 0, ${100 - cornerStretch}% 0, 100% 100%, ${cornerStretch * 0.35}% 100%)`;
          const lensShade =
            shouldReduceEffects || isActive
              ? "none"
              : distance < 0
                ? "linear-gradient(90deg, rgba(0, 0, 0, 0.2), transparent 42%)"
                : "linear-gradient(270deg, rgba(0, 0, 0, 0.2), transparent 42%)";

          return (
            <button
              key={`${video.id}-${index}`}
              type="button"
              data-slider-card="true"
              className="group relative shrink-0 w-[86vw] sm:w-[64vw] md:w-[50vw] lg:w-[40vw] xl:w-[34vw] max-w-[31rem] min-w-[15rem] aspect-[9/16] rounded-[1.6rem] border border-white/15 bg-neutral-950/50 text-left overflow-visible"
              tabIndex={isClone ? -1 : 0}
              aria-hidden={isClone}
              style={{
                zIndex: 40 - abs,
                opacity,
                transform: `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                transition: "transform 1120ms cubic-bezier(0.16, 1, 0.3, 1), opacity 980ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1120ms cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isActive
                  ? "0 28px 120px rgba(66, 164, 245, 0.36)"
                  : "0 10px 34px rgba(0, 0, 0, 0.35)",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              onClick={() => {
                if (!isActive) {
                  snapToIndex(index, "smooth");
                  return;
                }

                onPlay(video);
              }}
              aria-label={isClone ? undefined : isActive ? `Play ${video.title}` : `Focus ${video.title}`}
            >
              <div
                className="relative h-full w-full rounded-[1.6rem] overflow-hidden"
                style={{
                  transform: `scaleX(${mediaScaleX}) translateX(${mediaShiftX}px)`,
                  clipPath: mediaClipPath,
                  transition: "transform 920ms cubic-bezier(0.16, 1, 0.3, 1), clip-path 920ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <VideoThumbnailImage
                  googleDriveLink={video.googleDriveLink}
                  width={isActive ? 1080 : shouldReduceEffects ? 720 : 1080}
                  alt={video.title}
                  className="h-full w-full object-cover"
                  loading={isActive ? "eager" : "lazy"}
                  fallback={<div className="h-full w-full bg-gradient-to-br from-neutral-900 to-neutral-800" />}
                />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: lensShade,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary/85 mb-2">{video.category}</p>
                  <h3 className="text-white text-2xl md:text-4xl font-display font-black leading-tight line-clamp-2 mb-4">{video.title}</h3>

                  {isActive && (
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm md:text-base font-semibold">
                      <Play className="w-4 h-4" fill="currentColor" />
                      Play Preview
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!isMobileSlider && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[16vw] min-w-[72px] bg-gradient-to-r from-black via-black/88 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[16vw] min-w-[72px] bg-gradient-to-l from-black via-black/88 to-transparent" />
        </>
      )}

      <p className="text-center text-xs md:text-sm text-muted-foreground mt-3">
        Scroll on desktop or swipe on mobile to browse featured videos.
      </p>
    </div>
  );
};

export default VideoRollSlider;
