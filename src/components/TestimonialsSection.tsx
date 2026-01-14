import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'YouTube Creator (2M+ Subs)',
    content: "Working with Syed transformed my channel completely. His editing style is unique, engaging, and perfectly captures my vision. My audience engagement increased by 40%!",
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Brand Manager, TechCorp',
    content: "Exceptional attention to detail and fast turnaround. Syed delivered our product launch video ahead of schedule and it exceeded all our expectations. Highly recommend!",
    rating: 5,
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    role: 'TikTok Influencer (500K+ Followers)',
    content: "The 3D effects and transitions Syed creates are next level. He understands social media trends and knows exactly what makes content go viral.",
    rating: 5,
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    role: 'E-commerce Entrepreneur',
    content: "Our product videos never looked better. Syed's creative approach to showcasing products has directly contributed to a 60% increase in conversions.",
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 px-4 bg-card/30 backdrop-blur-sm relative">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            What <span className="text-primary">Clients</span> Say
          </h2>
          <p className="text-muted-foreground font-main">
            Don't just take my word for it – hear from creators who've transformed their content
          </p>
        </motion.div>

        <div className="relative">
          {/* Testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-card/80 border border-primary/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/20" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-lg md:text-xl text-foreground/90 mb-8 font-main leading-relaxed italic">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Author */}
              <div>
                <div className="text-lg font-display font-bold text-foreground">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm text-primary font-main">
                  {testimonials[currentIndex].role}
                </div>
              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-12 h-12 rounded-full bg-card border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-primary w-6' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-12 h-12 rounded-full bg-card border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
