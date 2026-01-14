import React, { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Interactive3DCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

const Interactive3DCard: React.FC<Interactive3DCardProps> = ({ 
  children, 
  className = '',
  glowColor = 'rgba(66, 164, 245, 0.3)',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position relative to center
    const maxRotation = 15;
    const rotX = (mouseY / (rect.height / 2)) * -maxRotation;
    const rotY = (mouseX / (rect.width / 2)) * maxRotation;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-xl"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Card content */}
      <div
        className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px ${glowColor}`
            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(125deg, transparent 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 100%)',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Scan line effect */}
        {isHovered && (
          <div className="scan-line" />
        )}

        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-primary/40 rounded-tl-sm" />
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-primary/40 rounded-tr-sm" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-primary/40 rounded-bl-sm" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-primary/40 rounded-br-sm" />

        {children}
      </div>
    </motion.div>
  );
};

export default Interactive3DCard;
