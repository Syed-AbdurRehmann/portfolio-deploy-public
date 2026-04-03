import { useState } from "react";
import { motion } from "framer-motion";
import Video3DCard from "@/components/Video3DCard";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideosByCategory, Video } from "@/data/videos";
import { useVideos } from "@/hooks/useVideos";

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { videos, categories, isLoading, error } = useVideos();

  const filteredVideos = getVideosByCategory(selectedCategory, videos);

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const scrollToSection = (category: string) => {
    setSelectedCategory(category);
    const element = document.getElementById('video-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-3 md:px-4 relative z-10 overflow-x-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-display font-black text-foreground mb-4">
            Video <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-main">
            Explore my complete collection of creative video projects across different categories and styles
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(category)}
              className={`px-5 py-2.5 rounded-full font-main font-medium text-sm transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card/50 border border-border/50 text-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Video Grid */}
        <div id="video-grid" className="scroll-mt-32">
          {isLoading && (
            <div className="text-center py-16 text-muted-foreground font-main">Loading videos...</div>
          )}

          {error && (
            <div className="text-center py-6 text-destructive font-main">
              {error instanceof Error ? error.message : "Unable to load videos right now."}
            </div>
          )}

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Video3DCard video={video} onPlay={handlePlayVideo} />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg font-main">
                No videos found in this category. Try selecting a different category.
              </p>
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground font-main">
            Showing {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </motion.div>

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

export default Portfolio;
