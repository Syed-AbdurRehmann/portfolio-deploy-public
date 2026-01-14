import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video } from "@/data/videos";

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ video, isOpen, onClose }: VideoPlayerProps) => {
  const [embedUrl, setEmbedUrl] = useState<string>("");

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