import { useEffect, useRef, useCallback, useMemo } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulsePhase: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  color: string;
  createdAt: number;
  lifetime: number;
  angle: number;
}

const CloudChamberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const linesRef = useRef<Line[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const lastLineTimeRef = useRef(0);

  const colors = useMemo(() => ({
    red: 'rgba(220, 60, 60, ',
    blue: 'rgba(66, 164, 245, ',
    purple: 'rgba(168, 85, 247, ',
    white: 'rgba(255, 255, 255, ',
  }), []);

  const isLowEndDevice = useMemo(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory 
      ? (navigator as unknown as { deviceMemory: number }).deviceMemory < 4 
      : false;
    return isMobile || hasLowMemory;
  }, []);

  const config = useMemo(() => ({
    particleCount: isLowEndDevice ? 20 : 40,
    maxLines: isLowEndDevice ? 8 : 15,
    lineSpawnInterval: isLowEndDevice ? 800 : 400,
    lineLifetime: 2000,
    fps: isLowEndDevice ? 24 : 60,
  }), [isLowEndDevice]);

  const createParticle = useCallback((width: number, height: number): Particle => {
    const colorKeys = ['red', 'blue', 'white'] as const;
    const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors[colorKey],
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }, [colors]);

  const createLine = useCallback((width: number, height: number): Line => {
    const angle = Math.random() * Math.PI * 2;
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const length = 100 + Math.random() * 300;
    const colorKeys = ['red', 'blue', 'purple'] as const;
    const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    
    return {
      x1: startX,
      y1: startY,
      x2: startX + Math.cos(angle) * length,
      y2: startY + Math.sin(angle) * length,
      opacity: 0.6 + Math.random() * 0.4,
      color: colors[colorKey],
      createdAt: performance.now(),
      lifetime: config.lineLifetime + Math.random() * 1000,
      angle,
    };
  }, [colors, config.lineLifetime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Initialize particles
    particlesRef.current = Array.from(
      { length: config.particleCount }, 
      () => createParticle(window.innerWidth, window.innerHeight)
    );

    let lastFrameTime = performance.now();
    const frameInterval = 1000 / config.fps;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      
      if (deltaTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTime = currentTime;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Spawn new lines
      if (currentTime - lastLineTimeRef.current > config.lineSpawnInterval && linesRef.current.length < config.maxLines) {
        linesRef.current.push(createLine(width, height));
        lastLineTimeRef.current = currentTime;
      }

      // Update and draw lines
      linesRef.current = linesRef.current.filter(line => {
        const age = currentTime - line.createdAt;
        if (age > line.lifetime) return false;

        const progress = age / line.lifetime;
        const fadeOpacity = line.opacity * (1 - progress * progress);

        // Draw line with glow
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = line.color + '0.5)';
        ctx.strokeStyle = line.color + fadeOpacity + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Core line
        ctx.shadowBlur = 3;
        ctx.strokeStyle = line.color + (fadeOpacity * 0.8) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        return true;
      });

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulsePhase += 0.02;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        // Pulsing opacity
        const pulseOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulsePhase));
        const pulseSize = particle.size * (1 + 0.2 * Math.sin(particle.pulsePhase));

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + (pulseOpacity * 0.2) + ')';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + pulseOpacity + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = particle.color + '0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Mouse glow effect
      if (!isLowEndDevice) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 150
        );
        gradient.addColorStop(0, 'rgba(66, 164, 245, 0.08)');
        gradient.addColorStop(0.5, 'rgba(66, 164, 245, 0.03)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      particlesRef.current = Array.from(
        { length: config.particleCount }, 
        () => createParticle(window.innerWidth, window.innerHeight)
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, createParticle, createLine, isLowEndDevice]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'hsl(0 0% 2%)' }}
    />
  );
};

export default CloudChamberBackground;
