import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PearlButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

const PearlButton: React.FC<PearlButtonProps> = ({ 
  children, 
  onClick, 
  className = '',
  size = 'md',
  variant = 'primary'
}) => {
  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  const variantStyles = {
    primary: {
      bg: 'hsl(210 15% 6%)',
      glow: 'hsl(205 90% 60%)',
    },
    secondary: {
      bg: 'hsl(210 15% 8%)',
      glow: 'hsl(200 100% 65%)',
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.button
      onClick={onClick}
      className={`relative rounded-full cursor-pointer border-0 outline-none font-main font-medium ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: style.bg,
        color: 'rgba(255, 255, 255, 0.85)',
        boxShadow: `
          inset 0 0.3rem 0.9rem rgba(66, 164, 245, 0.15),
          inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
          inset 0 -0.4rem 0.9rem rgba(66, 164, 245, 0.2),
          0 2rem 2rem rgba(0, 0, 0, 0.3),
          0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8)
        `,
      }}
      whileHover={{
        boxShadow: `
          inset 0 0.3rem 0.5rem rgba(66, 164, 245, 0.25),
          inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
          inset 0 -0.4rem 0.9rem rgba(66, 164, 245, 0.35),
          0 2rem 2rem rgba(0, 0, 0, 0.3),
          0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8),
          0 0 30px rgba(66, 164, 245, 0.3)
        `,
        scale: 1.02,
      }}
      whileTap={{
        y: 2,
        scale: 0.98,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
      
      {/* Top shine */}
      <div 
        className="absolute top-0 left-[10%] right-[10%] h-[40%] rounded-t-full pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default PearlButton;
