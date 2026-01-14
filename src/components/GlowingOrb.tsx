import React from 'react';
import { motion } from 'framer-motion';

interface GlowingOrbProps {
  size?: number;
  color?: string;
  className?: string;
}

const GlowingOrb: React.FC<GlowingOrbProps> = ({ 
  size = 100, 
  color = 'hsl(205 90% 60%)',
  className = '' 
}) => {
  return (
    <motion.div
      className={`relative pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: 0.5,
        }}
      />
      
      {/* Middle glow */}
      <motion.div
        className="absolute inset-[20%] rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
        animate={{
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Core */}
      <motion.div
        className="absolute inset-[35%] rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default GlowingOrb;
