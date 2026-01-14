import { useState } from "react";
import { Play } from "lucide-react";
import { Video, getVideoThumbnail } from "@/data/videos";

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

const VideoCard = ({ video, onPlay }: VideoCardProps) => {
  const [imageError, setImageError] = useState(false);
  const thumbnailUrl = getVideoThumbnail(video.googleDriveLink);

  return (
    <div className="video-card group cursor-pointer" onClick={() => onPlay(video)}>
      <div className={`relative overflow-hidden rounded-lg ${video.isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {thumbnailUrl && !imageError ? (
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center">
            <div className="text-center">
              <Play className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Video Thumbnail</p>
            </div>
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Category badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white">
          {video.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoCard;