import { useState } from "react";
import VideoCard from "@/components/VideoCard";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { categories, getVideosByCategory, Video } from "@/data/videos";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  const filteredVideos = getVideosByCategory(selectedCategory);

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Video Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my portfolio of creative video projects across different categories and styles
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`transition-all duration-300 ${
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "hover:border-primary/50 hover:text-primary"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <div key={video.id} className="animate-fade-in">
              <VideoCard
                video={video}
                onPlay={handlePlayVideo}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No videos found in this category. Try selecting a different category.
            </p>
          </div>
        )}

        {/* Video Player Modal */}
        <VideoPlayer
          video={selectedVideo}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
        />
      </div>
    </div>
  );
};

export default Gallery;