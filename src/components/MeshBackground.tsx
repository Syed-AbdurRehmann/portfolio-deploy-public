import { useEffect, useRef, useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const MeshBackground = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Detect low-end device
  const isLowEndDevice = useMemo(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory < 4 : false;
    const hasSlowCPU = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
    return isMobile || hasLowMemory || hasSlowCPU;
  }, []);

  // Determine particle count based on device - significantly reduced
  const particleCount = useMemo(() => {
    const width = window.innerWidth;
    if (isLowEndDevice) return 15; // Very low for mobile
    if (width < 640) return 20; // Mobile
    if (width < 1024) return 30; // Tablet
    return 40; // Desktop (reduced from 50)
  }, [isLowEndDevice]);

  const maxDistance = useMemo(() => {
    if (isLowEndDevice) return 80; // Reduced connection range
    const width = window.innerWidth;
    if (width < 640) return 90;
    return 110; // Reduced from 120
  }, [isLowEndDevice]);

  useEffect(() => {
    // Initialize particles with slower velocity on low-end devices
    const velocityMultiplier = isLowEndDevice ? 0.3 : 0.5;
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * velocityMultiplier,
      vy: (Math.random() - 0.5) * velocityMultiplier,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.7 + 0.2,
    }));

    let lastTime = performance.now();
    // Lower FPS cap for low-end devices
    const minFrameTime = isLowEndDevice ? 1000 / 20 : 1000 / 30; // 20fps mobile, 30fps desktop

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      
      // Skip frame if not enough time has passed
      if (deltaTime < minFrameTime) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTime = currentTime;

      const svg = svgRef.current;
      if (!svg) return;

      const particles = particlesRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;

        // Keep within bounds
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
      });

      // Clear and redraw
      svg.innerHTML = '';

      // Add defs with gradients
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      
      const particleGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
      particleGradient.setAttribute("id", "particleGradient");
      particleGradient.innerHTML = `
        <stop offset="0%" stop-color="hsl(270, 91%, 65%)" />
        <stop offset="100%" stop-color="hsl(280, 100%, 70%)" />
      `;
      
      const connectionGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      connectionGradient.setAttribute("id", "connectionGradient");
      connectionGradient.innerHTML = `
        <stop offset="0%" stop-color="hsl(270, 91%, 65%)" />
        <stop offset="100%" stop-color="hsl(280, 100%, 70%)" />
      `;
      
      defs.appendChild(particleGradient);
      defs.appendChild(connectionGradient);
      svg.appendChild(defs);

      // Draw connections (optimized - limit connections on low-end devices)
      const maxConnections = isLowEndDevice ? 30 : 60;
      let connectionCount = 0;
      
      for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
        for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          
          // Quick distance check before sqrt
          const distSq = dx * dx + dy * dy;
          const maxDistSq = maxDistance * maxDistance;
          
          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", particles[i].x.toString());
            line.setAttribute("y1", particles[i].y.toString());
            line.setAttribute("x2", particles[j].x.toString());
            line.setAttribute("y2", particles[j].y.toString());
            line.setAttribute("stroke", "url(#connectionGradient)");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("opacity", (Math.max(0, 1 - distance / maxDistance) * 0.25).toString());
            svg.appendChild(line);
            connectionCount++;
          }
        }
      }

      // Draw particles
      particles.forEach(particle => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", particle.x.toString());
        circle.setAttribute("cy", particle.y.toString());
        circle.setAttribute("r", particle.size.toString());
        circle.setAttribute("fill", "url(#particleGradient)");
        circle.setAttribute("opacity", particle.opacity.toString());
        svg.appendChild(circle);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const velocityMultiplier = isLowEndDevice ? 0.3 : 0.5;
        particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * velocityMultiplier,
          vy: (Math.random() - 0.5) * velocityMultiplier,
          size: Math.random() * 2.5 + 1,
          opacity: Math.random() * 0.7 + 0.2,
        }));
      }, 250);
    };

    // Passive event listener for better scroll performance
    const handleMouseMove = (e: MouseEvent) => {
      // Only update mouse position if not on low-end device
      if (!isLowEndDevice) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
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
  }, [particleCount, maxDistance, isLowEndDevice]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" style={{ willChange: 'contents' }} />
      
      {/* Mouse glow effect - disabled on low-end devices */}
      {!isLowEndDevice && (
        <div 
          className="absolute w-80 h-80 rounded-full pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            left: mouseRef.current.x - 160,
            top: mouseRef.current.y - 160,
            background: 'radial-gradient(circle, hsl(270 91% 65% / 0.08) 0%, transparent 70%)',
            willChange: 'transform',
          }}
        />
      )}
    </div>
  );
};

export default MeshBackground;