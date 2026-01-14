import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import PearlButton from './PearlButton';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - would integrate with backend
    const whatsappMessage = `Hi! I'm ${formData.name}. ${formData.message}`;
    window.open(`https://wa.me/923324112404?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 px-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Let's Create Something <span className="text-primary">Amazing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-main">
            Ready to elevate your content? Get in touch for a free consultation and let's discuss your project
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                Get in Touch
              </h3>
              <p className="text-muted-foreground font-main mb-8">
                I'm always excited to work on new projects. Whether you need a single video edit or ongoing content creation, I'm here to help bring your vision to life.
              </p>
            </div>

            {/* Contact methods */}
            <div className="space-y-4">
              <a 
                href="https://wa.me/923324112404" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-main">WhatsApp</div>
                  <div className="text-foreground font-medium group-hover:text-primary transition-colors">+92 332 411 2404</div>
                </div>
              </a>

              <a 
                href="mailto:contact@syedabdurrehman.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-main">Email</div>
                  <div className="text-foreground font-medium group-hover:text-primary transition-colors">contact@syedabdurrehman.com</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-main">Location</div>
                  <div className="text-foreground font-medium">Available Worldwide (Remote)</div>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="pt-4">
              <a href="https://wa.me/923324112404" target="_blank" rel="noopener noreferrer">
                <PearlButton size="lg" className="w-full">
                  <MessageCircle className="w-5 h-5" />
                  Book a Free Consultation
                </PearlButton>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-main">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all font-main"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-main">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all font-main"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-main">Project Type</label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all font-main"
                >
                  <option value="">Select a project type</option>
                  <option value="short-form">Short Form Content (Reels/TikTok)</option>
                  <option value="long-form">Long Form Video</option>
                  <option value="logo-animation">Logo Animation</option>
                  <option value="corporate">Corporate/Brand Video</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-main">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all resize-none font-main"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
              >
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
