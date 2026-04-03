import React from 'react';
import { motion } from 'framer-motion';

const clients = [
  'UNDERDAWG STUDIO',
  'DONEBYVERDE',
  'GROWWITHJO',
  'DIGIMAD',
  'DIGITAL CRAFT',
  'ZSIDEO',
];

const ClientsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Trusted by <span className="text-primary">Real Clients</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-main">
            Brands and creators I have worked with directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: '0 0 30px rgba(66, 164, 245, 0.2)',
              }}
              className="p-5 md:p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm text-center hover:border-primary/40 transition-colors"
            >
              <div className="text-xs md:text-sm font-display font-semibold tracking-[0.08em] text-foreground/90 leading-relaxed">
                {client}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
