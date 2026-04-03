import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Underdawg Studio',
    role: 'CONTENT AGENCY',
    content: "Best video editor we've worked with. Understands the brief, delivers on time, and the quality is always top-notch. Our engagement doubled after the edit.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Hassan Saqib',
    role: 'AGENCY MANAGER',
    content: "Incredible motion graphics work. Syed brought our brand vision to life with stunning animations that perfectly captured our identity.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Digimad',
    role: 'STARTUP FOUNDER',
    content: "Fast, professional, and creative. Syed delivered exactly what we needed for our product launch video. The edits were seamless and engaging.",
    rating: 5,
  },
  {
    id: 4,
    name: 'Donebyverde',
    role: 'SOCIAL MEDIA MANAGER',
    content: "Working with Syed was a game-changer. Our clients' social media presence improved dramatically with the viral-worthy edits Syed created for us.",
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
    <section id="testimonials" className="py-20 px-4 relative">
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
              aria-label="Show previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="w-10 h-10 rounded-full inline-flex items-center justify-center"
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                >
                  <span
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-primary w-6'
                        : 'bg-muted-foreground/40 hover:bg-muted-foreground/60 w-2'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="sr-only" aria-live="polite">
              Showing testimonial {currentIndex + 1} of {testimonials.length}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-12 h-12 rounded-full bg-card border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
              aria-label="Show next testimonial"
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
