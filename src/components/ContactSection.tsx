import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import PearlButton from './PearlButton';

const CONTACT_EMAIL = 'syed4abdurrehman@gmail.com';
const WHATSAPP_NUMBER = '923324112404';

const PROJECT_TYPE_LABELS: Record<string, string> = {
  'short-form': 'Short Form Content (Reels/TikTok)',
  'long-form': 'Long Form Video',
  'logo-animation': 'Logo Animation',
  corporate: 'Corporate/Brand Video',
  other: 'Other',
};

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: '',
  });
  const [submitFeedback, setSubmitFeedback] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      project: '',
      message: '',
    });
  };

  const getInquiryPayload = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !formData.project || !message) {
      return null;
    }

    const projectLabel = PROJECT_TYPE_LABELS[formData.project] || 'Not specified';
    const messageLines = [
      'Hi Syed, I want to discuss a project.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Project Type: ${projectLabel}`,
      '',
      'Message:',
      message,
    ];

    return {
      projectLabel,
      whatsappText: messageLines.join('\n'),
      emailBody: messageLines.join('\n'),
    };
  };

  const handleEmailSubmit = () => {
    const payload = getInquiryPayload();
    if (!payload) {
      setSubmitFeedback('Please complete all fields before sending.');
      return;
    }

    const subject = encodeURIComponent(`Project Inquiry - ${payload.projectLabel}`);
    const body = encodeURIComponent(payload.emailBody);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    setSubmitFeedback('Opening your email app with prefilled details...');
    resetForm();
  };

  const handleWhatsAppSubmit = () => {
    const payload = getInquiryPayload();
    if (!payload) {
      setSubmitFeedback('Please complete all fields before sending.');
      return;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(payload.whatsappText)}`;
    const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    if (!popup) {
      window.location.href = whatsappUrl;
    }

    setSubmitFeedback('Opening WhatsApp with your message...');
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-12 md:py-20 px-3 md:px-4 relative overflow-x-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 px-2"
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4">
            Let's Create Something <span className="text-primary">Amazing</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-main">
            Ready to elevate your content? Get in touch for a free consultation and let's discuss your project
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <div className="px-1">
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4 md:mb-6">
                Get in Touch
              </h3>
              <p className="text-sm md:text-base text-muted-foreground font-main mb-6 md:mb-8 leading-relaxed">
                I'm always excited to work on new projects. Whether you need a single video edit or ongoing content creation, I'm here to help bring your vision to life.
              </p>
            </div>

            {/* Contact methods */}
            <div className="space-y-3 md:space-y-4">
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/40 transition-all group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm text-muted-foreground font-main">WhatsApp</div>
                  <div className="text-sm md:text-base text-foreground font-medium group-hover:text-primary transition-colors truncate">
                    +92 332 411 2404
                  </div>
                </div>
              </a>

              <a 
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/40 transition-all group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm text-muted-foreground font-main">Email</div>
                  <div className="text-sm md:text-base text-foreground font-medium group-hover:text-primary transition-colors break-all">
                    {CONTACT_EMAIL}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm text-muted-foreground font-main">Location</div>
                  <div className="text-sm md:text-base text-foreground font-medium">
                    Available Worldwide (Remote)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="pt-2 md:pt-4">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <PearlButton size="lg" className="w-full text-sm md:text-base">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
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
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 p-4 md:p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-2 font-main">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all font-main text-sm md:text-base"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-2 font-main">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all font-main text-sm md:text-base"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="contact-project" className="block text-sm font-medium text-foreground mb-2 font-main">Project Type</label>
                <select
                  id="contact-project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all font-main text-sm md:text-base"
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
                <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-2 font-main">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all resize-none font-main text-sm md:text-base"
                  placeholder="Tell me about your project..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group text-sm md:text-base"
                >
                  Send via Email
                  <Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppSubmit}
                  className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl border border-green-500/50 text-green-400 font-semibold hover:bg-green-500/10 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  Send on WhatsApp
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground font-main text-center">
                Email works on desktop without WhatsApp. WhatsApp remains available for instant chat.
              </p>

              {submitFeedback && (
                <p className="text-xs md:text-sm text-primary font-main text-center" role="status">
                  {submitFeedback}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
