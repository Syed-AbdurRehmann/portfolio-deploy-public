import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const trailRef = useRef<TrailPoint[]>([]);
  const idCounterRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Add trail point
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        id: idCounterRef.current++,
      });
      
      // Limit trail length
      if (trailRef.current.length > 20) {
        trailRef.current.shift();
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    // Detect hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a, button, [role="button"], .cursor-pointer, .interactive-card');
      setIsHovering(!!isHoverable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Canvas trail animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      const animateTrail = () => {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const trail = trailRef.current;
        if (trail.length > 1) {
          // Draw gradient trail
          for (let i = 1; i < trail.length; i++) {
            const point = trail[i];
            const prevPoint = trail[i - 1];
            const progress = i / trail.length;
            
            const gradient = ctx.createLinearGradient(
              prevPoint.x, prevPoint.y,
              point.x, point.y
            );
            
            gradient.addColorStop(0, `rgba(66, 164, 245, ${progress * 0.3})`);
            gradient.addColorStop(0.5, `rgba(180, 60, 60, ${progress * 0.4})`);
            gradient.addColorStop(1, `rgba(66, 164, 245, ${progress * 0.3})`);
            
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = progress * 8;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }
        
        // Fade out trail points
        if (trail.length > 0 && Math.random() > 0.7) {
          trailRef.current.shift();
        }
        
        animationFrameRef.current = requestAnimationFrame(animateTrail);
      };
      
      animationFrameRef.current = requestAnimationFrame(animateTrail);
    }

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Main cursor circle */}
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
          className="absolute rounded-full border-2 border-primary/60"
          style={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.2s, height 0.2s',
            boxShadow: '0 0 20px rgba(66, 164, 245, 0.4), inset 0 0 10px rgba(66, 164, 245, 0.1)',
          }}
        />
        
        {/* Inner dot */}
        <div 
          className="absolute rounded-full bg-primary"
          style={{
            width: 6,
            height: 6,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(66, 164, 245, 0.8)',
          }}
        />
        
        {/* Glow effect */}
        <div 
          className="absolute rounded-full"
          style={{
            width: isHovering ? 80 : 60,
            height: isHovering ? 80 : 60,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(66, 164, 245, 0.15) 0%, transparent 70%)',
            transition: 'width 0.2s, height 0.2s',
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
