import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
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
  const thumbnail = getVideoThumbnail(video.googleDriveLink);
  const isMobile = useIsMobile();

  const handleClick = () => {
    // Always use the modal player - works for both mobile and desktop
    onPlay(video);
  };

  return (
    <Interactive3DCard
      className="w-full cursor-pointer"
      glowColor="rgba(66, 164, 245, 0.5)"
      onClick={handleClick}
    >
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className={`relative ${video.isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-neutral-900`}>
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

          {/* Overlay gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 0.4 : 0.6 }}
          />

          {/* Play button - always visible on mobile, hover on desktop */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: isMobile ? 0.9 : 0, scale: isMobile ? 1 : 0.8 }}
            animate={{ 
              opacity: isMobile ? 0.9 : (isHovered ? 1 : 0), 
              scale: isMobile ? 1 : (isHovered ? 1 : 0.8) 
            }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} rounded-full flex items-center justify-center backdrop-blur-sm`}
              style={{
                background: 'linear-gradient(135deg, rgba(66, 164, 245, 0.9), rgba(66, 164, 245, 0.7))',
                boxShadow: '0 0 30px rgba(66, 164, 245, 0.5), inset 0 0 20px rgba(255,255,255,0.1)',
              }}
            >
              <Play className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-white ml-0.5`} fill="currentColor" />
            </div>
          </motion.div>

          {/* Category badge */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
            <span 
              className="px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-medium rounded-full backdrop-blur-sm"
              style={{
                background: 'rgba(66, 164, 245, 0.2)',
                border: '1px solid rgba(66, 164, 245, 0.4)',
                color: 'rgb(66, 164, 245)',
              }}
            >
              {video.category}
            </span>
          </div>

          {/* Latest badge */}
          {video.isLatest && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
              <motion.span 
                className="px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-medium rounded-full backdrop-blur-sm"
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

        {/* Content */}
        <div className="p-3 md:p-4 bg-gradient-to-b from-neutral-900/50 to-neutral-950/80">
          <h3 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-1">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-xs text-neutral-400 line-clamp-1 hidden md:block">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </Interactive3DCard>
  );
};

export default Video3DCard;
