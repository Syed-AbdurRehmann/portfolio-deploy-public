import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Phone, Play } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import VideoRollSlider from "@/components/VideoRollSlider";
import VideoPlayer from "@/components/VideoPlayer";
import PearlButton from "@/components/PearlButton";
import RotatingText from "@/components/RotatingText";
import ClientsSection from "@/components/ClientsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import { type Video } from "@/data/videos";
import { useVideos } from "@/hooks/useVideos";

const Home = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { videos, isLoading: videosLoading } = useVideos();
  const latestVideos = videos.filter((video) => video.isLatest);

  useEffect(() => {
    if (!homeRef.current) {
      return;
    }

    const targets = Array.from(homeRef.current.querySelectorAll<HTMLElement>("[data-home-reveal]"));

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    targets.forEach((target, index) => {
      target.style.setProperty("--home-reveal-delay", `${Math.min(index * 70, 280)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

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

  const stats = [
    { value: "300+", label: "Projects Completed" },
    { value: "50+", label: "Happy Clients" },
    { value: "5+", label: "Years Experience" },
    { value: "24h", label: "Avg. Turnaround" },
  ];

  return (
    <div ref={homeRef} className="min-h-screen relative z-10 overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative pt-20">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="text-sm font-main text-primary">Available for new projects</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight">
              <span className="text-foreground">I Create</span>
              <br />
              <span className="relative inline-block">
                <span className="text-primary">Stunning</span>
              </span>
              {" "}
              <span className="text-foreground">Videos</span>
            </h1>

            {/* Rotating text */}
            <div className="flex items-center justify-center gap-3 text-xl md:text-2xl mb-8 font-main text-muted-foreground">
              <span>Specializing in</span>
              <RotatingText 
                words={["Viral Reels", "Motion Graphics", "Logo Animation", "Brand Videos", "VFX Edits"]}
                className="text-xl md:text-2xl"
              />
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-main"
            >
              Professional video editor transforming your vision into captivating visual stories. 
              From short-form content to cinematic productions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/portfolio">
                <PearlButton size="lg">
                  <Play className="w-5 h-5" />
                  View My Work
                  <ArrowRight className="w-5 h-5" />
                </PearlButton>
              </Link>
              <a href="https://wa.me/923324112404" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full border border-primary/30 text-primary font-main font-medium flex items-center gap-2 hover:bg-primary/10 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Free Consultation
                </motion.button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs font-main uppercase tracking-wider">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section data-home-reveal className="home-reveal py-16 px-4 border-y border-primary/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-black text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-main">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Work */}
      <section id="work" data-home-reveal className="home-reveal py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              3D Featured <span className="text-primary">Showcase</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-main">
              Roll through large video cards with a cinematic depth effect and tap any center card to play instantly.
            </p>
          </motion.div>

          {videosLoading ? (
            <div className="text-center text-muted-foreground font-main mb-12">Loading featured videos...</div>
          ) : (
            <div className="mb-12">
              <VideoRollSlider videos={latestVideos.slice(0, 8)} onPlay={handlePlayVideo} />
            </div>
          )}

          {!videosLoading && latestVideos.length === 0 && (
            <div className="text-center text-muted-foreground font-main mb-12">
              No featured videos available yet.
            </div>
          )}

          <div className="text-center">
            <Link to="/portfolio">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(66, 164, 245, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl border border-primary/30 text-primary font-main font-medium inline-flex items-center gap-2 hover:bg-primary/10 transition-all"
              >
                View All Work
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section id="clients" data-home-reveal className="home-reveal">
        <ClientsSection />
      </section>

      {/* About / Skills */}
      <section id="about" data-home-reveal className="home-reveal py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Skills & <span className="text-primary">Expertise</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-main">
              Years of experience with industry-leading tools and techniques
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-display font-bold text-foreground mb-8">Capabilities</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-foreground font-main">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-display font-bold text-foreground mb-8">Tools & Software</h3>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool, index) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(66, 164, 245, 0.2)' }}
                    className="skill-tag text-sm cursor-default"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creative Process */}
      <section data-home-reveal className="home-reveal py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Creative <span className="text-primary">Process</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-main">
              My proven 4-step approach ensures every project exceeds expectations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creativeProcess.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 0 30px rgba(66, 164, 245, 0.15)' }}
                className="process-card"
              >
                <div className="text-4xl font-display font-black text-primary/50 mb-4">{process.step}</div>
                <h3 className="text-lg font-display font-bold text-foreground mb-3">{process.title}</h3>
                <p className="text-sm text-muted-foreground font-main">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div data-home-reveal className="home-reveal">
        <TestimonialsSection />
      </div>

      {/* FAQ */}
      <section id="faq" data-home-reveal className="home-reveal py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground font-main">
              Get answers to common questions about my video editing services
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card/50 border border-border/50 rounded-xl px-6 backdrop-blur-sm hover:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-display font-medium text-foreground hover:text-primary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-main pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <div data-home-reveal className="home-reveal">
        <ContactSection />
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground font-main text-sm">
            © {new Date().getFullYear()} Syed Abdurrehman. All rights reserved.
          </p>
        </div>
      </footer>

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
