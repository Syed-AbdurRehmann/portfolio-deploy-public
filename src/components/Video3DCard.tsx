import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import Interactive3DCard from './Interactive3DCard';
import { Video, getVideoThumbnail } from '@/data/videos';
import { useIsMobile } from '@/hooks/use-mobile';

interface Video3DCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

const Video3DCard: React.FC<Video3DCardProps> = ({ video, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const thumbnail = getVideoThumbnail(video.googleDriveLink);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (video?.googleDriveLink) {
      const fileId = video.googleDriveLink.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        setEmbedUrl(`https://drive.google.com/file/d/${fileId}/preview`);
      }
    }
  }, [video]);

  const handleClick = () => {
    if (isMobile) {
      // Toggle video playback on mobile
      setIsPlaying(!isPlaying);
    } else {
      // Open modal on desktop
      onPlay(video);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
  };

  return (
    <Interactive3DCard
      className="w-full cursor-pointer"
      glowColor="rgba(66, 164, 245, 0.5)"
      onClick={handleClick}
      isActive={isPlaying}
    >
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Thumbnail / Video */}
        <div className={`relative ${video.isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-neutral-900`}>
          <AnimatePresence mode="wait">
            {isPlaying && isMobile ? (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20"
              >
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={video.title}
                  allow="autoplay"
                />
                {/* Close button for mobile */}
                <motion.button
                  className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/80 flex items-center justify-center"
                  onClick={handleClose}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="thumbnail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                {thumbnail && !thumbnailError ? (
                  <img
                    src={thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={() => setThumbnailError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <Play className="w-12 h-12 text-primary/50" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay gradient - hide when playing */}
          {!isPlaying && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: isHovered ? 0.4 : 0.6 }}
            />
          )}

          {/* Play button - only show on desktop hover or mobile when not playing */}
          {!isPlaying && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: isMobile ? 0.7 : 0, scale: isMobile ? 1 : 0.8 }}
              animate={{ 
                opacity: isMobile ? 0.9 : (isHovered ? 1 : 0), 
                scale: isMobile ? 1 : (isHovered ? 1 : 0.8) 
              }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full flex items-center justify-center backdrop-blur-sm`}
                style={{
                  background: 'linear-gradient(135deg, rgba(66, 164, 245, 0.9), rgba(66, 164, 245, 0.7))',
                  boxShadow: '0 0 30px rgba(66, 164, 245, 0.5), inset 0 0 20px rgba(255,255,255,0.1)',
                }}
              >
                <Play className={`${isMobile ? 'w-5 h-5' : 'w-7 h-7'} text-white ml-1`} fill="currentColor" />
              </div>
            </motion.div>
          )}

          {/* Category badge */}
          {!isPlaying && (
            <div className="absolute top-4 left-4 z-10">
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm"
                style={{
                  background: 'rgba(66, 164, 245, 0.2)',
                  border: '1px solid rgba(66, 164, 245, 0.4)',
                  color: 'rgb(66, 164, 245)',
                }}
              >
                {video.category}
              </span>
            </div>
          )}

          {/* Latest badge */}
          {video.isLatest && !isPlaying && (
            <div className="absolute top-4 right-4 z-10">
              <motion.span 
                className="px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm"
                style={{
                  background: 'rgba(220, 60, 60, 0.2)',
                  border: '1px solid rgba(220, 60, 60, 0.5)',
                  color: 'rgb(220, 60, 60)',
                }}
                animate={{ 
                  boxShadow: ['0 0 10px rgba(220, 60, 60, 0.3)', '0 0 20px rgba(220, 60, 60, 0.5)', '0 0 10px rgba(220, 60, 60, 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NEW
              </motion.span>
            </div>
          )}
        </div>

        {/* Content - hide when playing on mobile */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              className="p-5 bg-gradient-to-b from-neutral-900/50 to-neutral-950/80"
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm text-neutral-400 line-clamp-2">
                  {video.description}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Interactive3DCard>
  );
};

export default Video3DCard;
