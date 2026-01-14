import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Interactive3DCard from './Interactive3DCard';
import { Video, getVideoThumbnail } from '@/data/videos';

interface Video3DCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

const Video3DCard: React.FC<Video3DCardProps> = ({ video, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const thumbnail = getVideoThumbnail(video.googleDriveLink);

  return (
    <Interactive3DCard
      className="w-full cursor-pointer"
      glowColor="rgba(66, 164, 245, 0.5)"
      onClick={() => onPlay(video)}
    >
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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

          {/* Play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.8 
            }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(66, 164, 245, 0.9), rgba(66, 164, 245, 0.7))',
                boxShadow: '0 0 30px rgba(66, 164, 245, 0.5), inset 0 0 20px rgba(255,255,255,0.1)',
              }}
            >
              <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
            </div>
          </motion.div>

          {/* Category badge */}
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

          {/* Latest badge */}
          {video.isLatest && (
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

        {/* Content */}
        <div className="p-5 bg-gradient-to-b from-neutral-900/50 to-neutral-950/80">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-sm text-neutral-400 line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </Interactive3DCard>
  );
};

export default Video3DCard;
