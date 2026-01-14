import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  hue: number;
}

const MeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const prevMouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animationFrameRef = useRef<number>();
  const blobsRef = useRef<Blob[]>([]);
  const timeRef = useRef(0);

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

    // Initialize aura blobs
    const initBlobs = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      blobsRef.current = [
        // Main large aura blob
        {
          x: width * 0.3,
          y: height * 0.4,
          targetX: width * 0.3,
          targetY: height * 0.4,
          radius: 250,
          baseRadius: 250,
          vx: 0,
          vy: 0,
          hue: 0, // Red
        },
        // Secondary blob
        {
          x: width * 0.6,
          y: height * 0.5,
          targetX: width * 0.6,
          targetY: height * 0.5,
          radius: 200,
          baseRadius: 200,
          vx: 0,
          vy: 0,
          hue: 0,
        },
        // Third blob
        {
          x: width * 0.5,
          y: height * 0.3,
          targetX: width * 0.5,
          targetY: height * 0.3,
          radius: 180,
          baseRadius: 180,
          vx: 0,
          vy: 0,
          hue: 350,
        },
        // Smaller accent blobs
        {
          x: width * 0.2,
          y: height * 0.6,
          targetX: width * 0.2,
          targetY: height * 0.6,
          radius: 120,
          baseRadius: 120,
          vx: 0,
          vy: 0,
          hue: 10,
        },
        {
          x: width * 0.75,
          y: height * 0.35,
          targetX: width * 0.75,
          targetY: height * 0.35,
          radius: 150,
          baseRadius: 150,
          vx: 0,
          vy: 0,
          hue: 355,
        },
      ];
    };

    initBlobs();

    // Create mesh points for geometric lines
    const createMeshPoints = () => {
      const points: { x: number; y: number; originX: number; originY: number }[] = [];
      const spacing = 120;
      const cols = Math.ceil(window.innerWidth / spacing) + 4;
      const rows = Math.ceil(window.innerHeight / spacing) + 4;

      for (let i = -2; i < cols; i++) {
        for (let j = -2; j < rows; j++) {
          points.push({ 
            x: i * spacing, 
            y: j * spacing, 
            originX: i * spacing, 
            originY: j * spacing 
          });
        }
      }
      return { points, cols: cols + 2, rows: rows + 2 };
    };

    let mesh = createMeshPoints();

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      timeRef.current += 0.01;

      // Clear canvas
      ctx.fillStyle = 'hsl(0, 0%, 3%)';
      ctx.fillRect(0, 0, width, height);

      // Calculate mouse velocity for dispersion effect
      const mouseVelX = mouseRef.current.x - prevMouseRef.current.x;
      const mouseVelY = mouseRef.current.y - prevMouseRef.current.y;
      const mouseSpeed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
      
      prevMouseRef.current = { ...mouseRef.current };

      // Update and draw aura blobs
      blobsRef.current.forEach((blob, index) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - blob.x;
        const dy = mouseRef.current.y - blob.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Dispersion effect - push blobs away from cursor
        if (distance < 300) {
          const force = (300 - distance) / 300;
          const angle = Math.atan2(dy, dx);
          const disperseStrength = force * (mouseSpeed * 0.5 + 20);
          
          blob.vx -= Math.cos(angle) * disperseStrength * 0.1;
          blob.vy -= Math.sin(angle) * disperseStrength * 0.1;
          
          // Squish the blob when cursor is near
          blob.radius = blob.baseRadius * (1 - force * 0.3);
        } else {
          // Return to base radius
          blob.radius += (blob.baseRadius - blob.radius) * 0.02;
        }
        
        // Apply velocity
        blob.x += blob.vx;
        blob.y += blob.vy;
        
        // Damping
        blob.vx *= 0.95;
        blob.vy *= 0.95;
        
        // Return to original position slowly
        blob.x += (blob.targetX - blob.x) * 0.01;
        blob.y += (blob.targetY - blob.y) * 0.01;
        
        // Add organic movement
        const wobbleX = Math.sin(timeRef.current + index * 2) * 30;
        const wobbleY = Math.cos(timeRef.current * 0.7 + index * 1.5) * 25;
        
        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(
          blob.x + wobbleX, blob.y + wobbleY, 0,
          blob.x + wobbleX, blob.y + wobbleY, blob.radius * 1.5
        );
        
        const hue = blob.hue;
        gradient.addColorStop(0, `hsla(${hue}, 85%, 55%, 0.6)`);
        gradient.addColorStop(0.3, `hsla(${hue}, 80%, 45%, 0.4)`);
        gradient.addColorStop(0.6, `hsla(${hue}, 75%, 35%, 0.2)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(blob.x + wobbleX, blob.y + wobbleY, blob.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw mesh grid with parallax
      const { points, cols, rows } = mesh;
      
      points.forEach(point => {
        const dx = mouseRef.current.x - point.originX;
        const dy = mouseRef.current.y - point.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
          const force = (300 - distance) / 300 * 20;
          const angle = Math.atan2(dy, dx);
          point.x = point.originX - Math.cos(angle) * force;
          point.y = point.originY - Math.sin(angle) * force;
        } else {
          point.x += (point.originX - point.x) * 0.1;
          point.y += (point.originY - point.y) * 0.1;
        }
      });

      // Draw diagonal lines
      for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
          const idx = i * rows + j;
          const point = points[idx];
          const diagPoint = points[idx + rows + 1];

          if (!point || !diagPoint) continue;

          const centerX = (point.x + diagPoint.x) / 2;
          const centerY = (point.y + diagPoint.y) / 2;
          const distToMouse = Math.sqrt(
            Math.pow(mouseRef.current.x - centerX, 2) + 
            Math.pow(mouseRef.current.y - centerY, 2)
          );
          
          const opacity = 0.03 + Math.max(0, (200 - distToMouse) / 200) * 0.08;

          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(diagPoint.x, diagPoint.y);
          ctx.strokeStyle = `rgba(180, 40, 40, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw corner accent lines
      const corners = [
        { x: 0, y: 0, angles: [0.3, 0.5, 0.7] },
        { x: width, y: 0, angles: [2.5, 2.7, 2.9] },
        { x: 0, y: height, angles: [5.6, 5.8, 6.0] },
        { x: width, y: height, angles: [3.6, 3.8, 4.0] },
      ];

      corners.forEach(corner => {
        corner.angles.forEach((angle, idx) => {
          const length = 400 + idx * 150;
          const endX = corner.x + Math.cos(angle) * length;
          const endY = corner.y + Math.sin(angle) * length;

          ctx.beginPath();
          ctx.moveTo(corner.x, corner.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = 'rgba(180, 40, 40, 0.15)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
      });

      // Vignette
      const vignetteGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.7
      );
      vignetteGradient.addColorStop(0, 'transparent');
      vignetteGradient.addColorStop(0.6, 'transparent');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      initBlobs();
      mesh = createMeshPoints();
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'hsl(0 0% 3%)' }}
    />
  );
};

export default MeshBackground;
