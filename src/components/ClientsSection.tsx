import React from 'react';
import { motion } from 'framer-motion';

const clients = [
  { name: 'YouTube Creators', projects: '50+' },
  { name: 'Instagram Influencers', projects: '80+' },
  { name: 'TikTok Stars', projects: '100+' },
  { name: 'Corporate Brands', projects: '25+' },
  { name: 'Gaming Streamers', projects: '40+' },
  { name: 'E-commerce', projects: '30+' },
];

const ClientsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Trusted by <span className="text-primary">Creators</span> Worldwide
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-main">
            From viral content creators to established brands, I've helped hundreds of clients elevate their video content
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: '0 0 30px rgba(66, 164, 245, 0.2)',
              }}
              className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm text-center hover:border-primary/40 transition-colors"
            >
              <div className="text-3xl font-display font-bold text-primary mb-2">
                {client.projects}
              </div>
              <div className="text-sm text-muted-foreground font-main">
                {client.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
