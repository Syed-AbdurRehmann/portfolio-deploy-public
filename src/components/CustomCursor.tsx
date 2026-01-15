import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Don't show custom cursor on mobile/touch devices
    if (isMobile || (typeof window !== 'undefined' && 'ontouchstart' in window)) {
      document.body.style.cursor = 'auto';
      return;
    }

    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a, button, [role="button"], .cursor-pointer, .interactive-card');
      setIsHovering(!!isHoverable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isMobile]);

  // Don't render on mobile/touch devices
  if (isMobile || (typeof window !== 'undefined' && 'ontouchstart' in window)) {
    return null;
  }

  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{ duration: 0.15 }}
    >
      {/* Outer ring */}
      <div 
        className="absolute rounded-full border-2"
        style={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
          borderColor: isHovering ? 'rgba(66, 164, 245, 0.8)' : 'rgba(255, 255, 255, 0.6)',
          boxShadow: isHovering 
            ? '0 0 20px rgba(66, 164, 245, 0.5), inset 0 0 10px rgba(66, 164, 245, 0.2)'
            : '0 0 15px rgba(255, 255, 255, 0.2)',
        }}
      />
      
      {/* Inner dot */}
      <div 
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: isHovering ? 'rgb(66, 164, 245)' : 'white',
          boxShadow: isHovering 
            ? '0 0 10px rgba(66, 164, 245, 0.8)'
            : '0 0 8px rgba(255, 255, 255, 0.6)',
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;
