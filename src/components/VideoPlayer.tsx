import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video } from "@/data/videos";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ video, isOpen, onClose }: VideoPlayerProps) => {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const isMobile = useIsMobile();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (video?.googleDriveLink) {
      // Convert Google Drive link to embed format
      const fileId = video.googleDriveLink.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        setEmbedUrl(`https://drive.google.com/file/d/${fileId}/preview`);
      }
    }
  }, [video]);

  const handleOpenInDrive = () => {
    if (video?.googleDriveLink) {
      window.open(video.googleDriveLink, '_blank');
    }
  };

  if (!video) return null;

  // Mobile optimized layout
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[100vw] max-w-[100vw] h-[100vh] max-h-[100vh] p-0 bg-black border-0 rounded-none [&>button]:hidden">
          <div className="relative flex flex-col h-full w-full">
            {/* Close button - top left */}
            <motion.button
              className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center border border-white/20"
              onClick={onClose}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            {/* Video Player - Full screen for mobile */}
            <div className={`flex-1 flex items-center justify-center bg-black ${video.isVertical ? '' : 'px-0'}`}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className={`${video.isVertical ? 'w-full h-full' : 'w-full aspect-video'}`}
                  allowFullScreen
                  allow="autoplay"
                  title={video.title}
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="text-neutral-400 mb-4">Unable to load video</p>
                    <Button onClick={handleOpenInDrive} variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View in Drive
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Minimal info bar at top right - positioned to not block video controls */}
            <div className="absolute top-4 right-4 p-3 bg-black/70 backdrop-blur-sm rounded-lg max-w-[60%]">
              <h3 className="text-white font-semibold text-sm truncate">{video.title}</h3>
              <p className="text-neutral-400 text-xs">{video.category}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop layout
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 bg-black border-primary/20">
        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-card/95 backdrop-blur-sm border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{video.title}</h2>
              <p className="text-sm text-muted-foreground">{video.category}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInDrive}
              className="text-xs"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open in Drive
            </Button>
          </div>

          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center bg-black min-h-0">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Unable to load video preview</p>
                  <Button onClick={handleOpenInDrive} variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Google Drive
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          {video.description && (
            <div className="p-4 bg-card/95 backdrop-blur-sm border-t border-border">
              <h3 className="font-medium text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{video.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
