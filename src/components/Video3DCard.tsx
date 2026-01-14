import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';
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
      className="w-full"
      glowColor="rgba(66, 164, 245, 0.4)"
      onClick={() => onPlay(video)}
    >
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className={`relative ${video.isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-muted`}>
          {thumbnail && !thumbnailError ? (
            <img
              src={thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={() => setThumbnailError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
              <Play className="w-12 h-12 text-primary/50" />
            </div>
          )}

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: isHovered ? 0.8 : 0.5 }}
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
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-primary/30">
              <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </motion.div>

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full backdrop-blur-sm border border-primary/30">
              {video.category}
            </span>
          </div>

          {/* Latest badge */}
          {video.isLatest && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-medium bg-glow-red/20 text-red-400 rounded-full backdrop-blur-sm border border-red-500/30 animate-pulse">
                NEW
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-display font-bold text-foreground mb-2 line-clamp-1">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </Interactive3DCard>
  );
};

export default Video3DCard;
