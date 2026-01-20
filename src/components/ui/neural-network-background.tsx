'use client';

import { useEffect, useState } from 'react';

export default function NeuralNetworkBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Primary blue gradient - diagonal beam effect */}
      <div 
        className="absolute inset-0 opacity-80 transition-all duration-1000 ease-out"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 50% at ${30 + mousePosition.x * 0.2}% ${20 + mousePosition.y * 0.2}%,
              hsl(210, 100%, 25%) 0%,
              hsl(215, 80%, 15%) 30%,
              transparent 70%
            )
          `,
        }}
      />
      
      {/* Secondary subtle blue glow */}
      <div 
        className="absolute inset-0 opacity-60 transition-all duration-700 ease-out"
        style={{
          background: `
            radial-gradient(
              ellipse 60% 80% at ${60 + mousePosition.x * 0.1}% ${50 + mousePosition.y * 0.15}%,
              hsl(200, 90%, 20%) 0%,
              hsl(210, 70%, 10%) 40%,
              transparent 70%
            )
          `,
        }}
      />
      
      {/* Diagonal light beam */}
      <div 
        className="absolute inset-0 opacity-40 transition-all duration-500 ease-out"
        style={{
          background: `
            linear-gradient(
              135deg,
              transparent 0%,
              transparent 30%,
              hsl(205, 85%, 30%) 45%,
              hsl(210, 80%, 20%) 55%,
              transparent 70%,
              transparent 100%
            )
          `,
          transform: `translate(${(mousePosition.x - 50) * 0.05}%, ${(mousePosition.y - 50) * 0.05}%)`,
        }}
      />
      
      {/* Soft vignette overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 100% 100% at 50% 50%,
              transparent 0%,
              transparent 50%,
              hsla(0, 0%, 0%, 0.4) 100%
            )
          `,
        }}
      />
      
      {/* Subtle noise texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
