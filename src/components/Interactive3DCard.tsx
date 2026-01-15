import React, { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface Interactive3DCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  isActive?: boolean; // For mobile video playing state
}

const Interactive3DCard: React.FC<Interactive3DCardProps> = ({ 
  children, 
  className = '',
  glowColor = 'rgba(66, 164, 245, 0.4)',
  onClick,
  isActive = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  // Motion values for smooth animations - MUST be called unconditionally
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configs for smooth movement
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateXTransform = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateYTransform = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const rotateXSpring = useSpring(rotateXTransform, springConfig);
  const rotateYSpring = useSpring(rotateYTransform, springConfig);
  
  // Glare position - MUST be called unconditionally
  const glareXTransform = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareYTransform = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const glareX = useSpring(glareXTransform, springConfig);
  const glareY = useSpring(glareYTransform, springConfig);
  
  // Glare background - computed from spring values
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
  };

  // On mobile, show color when active (playing), otherwise grayscale
  const showEffects = isMobile ? isActive : isHovered;

  // Mobile-optimized render without 3D effects
  if (isMobile) {
    return (
      <motion.div
        ref={cardRef}
        className={`interactive-card relative ${className}`}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-950/90"
          style={{
            boxShadow: showEffects
              ? `0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px ${glowColor}`
              : '0 5px 15px -5px rgba(0, 0, 0, 0.4)',
            filter: showEffects ? 'grayscale(0%)' : 'grayscale(100%)',
            transition: 'filter 0.4s ease, box-shadow 0.3s ease',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  // Desktop version with full 3D effects
  return (
    <motion.div
      ref={cardRef}
      className={`interactive-card relative ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow effect behind card */}
        <motion.div
          className="absolute -inset-2 rounded-2xl blur-xl"
          style={{
            background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Main card container */}
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-950/90 backdrop-blur-sm"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: isHovered 
              ? `0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px ${glowColor}`
              : '0 10px 30px -10px rgba(0, 0, 0, 0.4)',
            // Grayscale to color effect
            filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
            transition: 'filter 0.4s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Glare/shine effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: glareBackground,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Scanline effect */}
          {isHovered && (
            <div 
              className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(66, 164, 245, 0.03), transparent)',
                animation: 'scanMove 2s linear infinite',
              }}
            />
          )}

          {/* Corner accents */}
          <motion.div
            className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 rounded-tl-sm z-20"
            style={{ borderColor: isHovered ? 'rgba(66, 164, 245, 0.6)' : 'rgba(255,255,255,0.2)' }}
            animate={{ 
              boxShadow: isHovered ? '0 0 10px rgba(66, 164, 245, 0.5)' : 'none',
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 rounded-tr-sm z-20"
            style={{ borderColor: isHovered ? 'rgba(66, 164, 245, 0.6)' : 'rgba(255,255,255,0.2)' }}
            animate={{ 
              boxShadow: isHovered ? '0 0 10px rgba(66, 164, 245, 0.5)' : 'none',
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 rounded-bl-sm z-20"
            style={{ borderColor: isHovered ? 'rgba(66, 164, 245, 0.6)' : 'rgba(255,255,255,0.2)' }}
            animate={{ 
              boxShadow: isHovered ? '0 0 10px rgba(66, 164, 245, 0.5)' : 'none',
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 rounded-br-sm z-20"
            style={{ borderColor: isHovered ? 'rgba(66, 164, 245, 0.6)' : 'rgba(255,255,255,0.2)' }}
            animate={{ 
              boxShadow: isHovered ? '0 0 10px rgba(66, 164, 245, 0.5)' : 'none',
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-20"
            style={{
              border: '1px solid transparent',
              background: isHovered 
                ? 'linear-gradient(135deg, rgba(66, 164, 245, 0.3), transparent, rgba(66, 164, 245, 0.3)) border-box'
                : 'none',
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Interactive3DCard;
