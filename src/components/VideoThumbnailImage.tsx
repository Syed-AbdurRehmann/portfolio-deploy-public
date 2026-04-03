import { type ReactNode, useEffect, useMemo, useState } from "react";
import { getVideoThumbnailCandidates } from "@/data/videos";

interface VideoThumbnailImageProps {
  googleDriveLink: string;
  width?: number;
  alt: string;
  className: string;
  loading?: "eager" | "lazy";
  fallback: ReactNode;
}

const VideoThumbnailImage = ({
  googleDriveLink,
  width = 900,
  alt,
  className,
  loading = "lazy",
  fallback,
}: VideoThumbnailImageProps) => {
  const candidates = useMemo(() => getVideoThumbnailCandidates(googleDriveLink, width), [googleDriveLink, width]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setFailed(false);
  }, [googleDriveLink, width]);

  if (!candidates.length || failed) {
    return <>{fallback}</>;
  }

  const src = candidates[candidateIndex];

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (candidateIndex < candidates.length - 1) {
          setCandidateIndex((prev) => prev + 1);
          return;
        }

        setFailed(true);
      }}
    />
  );
};

export default VideoThumbnailImage;
