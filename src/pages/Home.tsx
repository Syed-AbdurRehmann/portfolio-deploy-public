import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, ChevronDown, Phone } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import VideoPlayer from "@/components/VideoPlayer";
import Marquee from "@/components/Marquee";
import StatsSection from "@/components/StatsSection";
import { getLatestVideos, Video } from "@/data/videos";

const Home = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const latestVideos = getLatestVideos();

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const skills = [
    "Advanced Video Editing", "Motion Graphics", "VFX & Compositing", "Color Grading",
    "Rotoscoping", "3D Camera Tracking", "Speed Ramping", "Animation"
  ];

  const tools = [
    "Adobe After Effects", "Premiere Pro", "DaVinci Resolve", "CapCut", 
    "Photoshop", "Illustrator", "Notion", "OBS Studio", "Descript", 
    "Midjourney", "Eleven Labs", "Veo2 & Kling AI", "RunwayML", "Topaz Video AI"
  ];

  const creativeProcess = [
    {
      step: "01",
      title: "Discovery & Strategy",
      description: "Understanding your vision, target audience, and project goals to craft the perfect video strategy."
    },
    {
      step: "02", 
      title: "Creation & Editing",
      description: "Bringing your content to life with advanced editing techniques, motion graphics, and visual effects."
    },
    {
      step: "03",
      title: "Revisions & Feedback", 
      description: "Collaborative refinement process ensuring every detail aligns with your expectations."
    },
    {
      step: "04",
      title: "Delivery & Launch",
      description: "Final optimization and delivery in formats perfect for your platform and audience."
    }
  ];

  const faqs = [
    {
      question: "What types of videos do you specialize in?",
      answer: "I specialize in short-form content (reels, TikToks, YouTube Shorts), long-form videos (corporate, personal branding), ads, and social media content. I've worked across multiple niches with both local and international clients."
    },
    {
      question: "How long does a typical video edit take?",
      answer: "Timeline varies based on complexity. Simple edits can be completed in 24-48 hours, while complex projects with motion graphics and VFX may take 3-7 days. I always provide clear timelines upfront."
    },
    {
      question: "Do you provide revisions?",
      answer: "Yes! I include up to 3 rounds of revisions with every project to ensure your complete satisfaction. Additional revisions can be accommodated if needed."
    },
    {
      question: "What formats do you deliver videos in?",
      answer: "I deliver videos optimized for your specific platform - whether it's Instagram, TikTok, YouTube, or corporate presentations. All files are provided in high quality formats suitable for your needs."
    },
    {
      question: "Can you work with AI-generated content?",
      answer: "Absolutely! I'm experienced with AI tools like RunwayML, Kling AI, MidJourney, and others. I can enhance AI-generated content or integrate it seamlessly into traditional video workflows."
    }
  ];

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 relative">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Syed Abdurrehman
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent blur-sm opacity-50 -z-10">
                Syed Abdurrehman
              </div>
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary/90 mb-6">
              Professional Video Editor
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Transforming your vision into stunning visual stories with cutting-edge editing techniques and creative excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/gallery">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    View My Work
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <a href="https://wa.me/923324112404" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-3 text-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Free Consultation
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-primary/60" />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Marquee */}
      <Marquee />

      {/* Latest Work */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover my most recent video editing projects featuring advanced techniques and creative storytelling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {latestVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={handlePlayVideo}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/gallery">
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                View More Work
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Skills & Tools */}
      <section className="py-16 px-4 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Skills */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Skills & Expertise</h2>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Tools & Software</h2>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, index) => (
                  <span key={index} className="skill-tag text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Process */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Creative Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My proven 4-step approach ensures every project exceeds expectations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creativeProcess.map((process, index) => (
              <div key={index} className="process-card">
                <div className="text-3xl font-bold text-primary mb-3">{process.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{process.title}</h3>
                <p className="text-sm text-muted-foreground">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-card/10 backdrop-blur-sm">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Get answers to common questions about my video editing services
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card/50 border border-border rounded-lg px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Video Player Modal */}
      <VideoPlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </div>
  );
};

export default Home;