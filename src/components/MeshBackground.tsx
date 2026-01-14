import { useEffect, useRef } from "react";

const MeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animationFrameRef = useRef<number>();

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

    // Create mesh points for parallax grid
    const createMeshPoints = () => {
      const points: { x: number; y: number; originX: number; originY: number }[] = [];
      const spacing = 100;
      const cols = Math.ceil(window.innerWidth / spacing) + 4;
      const rows = Math.ceil(window.innerHeight / spacing) + 4;

      for (let i = -2; i < cols; i++) {
        for (let j = -2; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          points.push({ x, y, originX: x, originY: y });
        }
      }
      return { points, cols: cols + 2, rows: rows + 2, spacing };
    };

    let mesh = createMeshPoints();

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear canvas with dark background
      ctx.fillStyle = 'hsl(0, 0%, 3%)';
      ctx.fillRect(0, 0, width, height);

      // Update mesh points based on mouse position (parallax effect)
      const mouseInfluence = 30;
      mesh.points.forEach(point => {
        const dx = mouseRef.current.x - point.originX;
        const dy = mouseRef.current.y - point.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 400;
        
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * mouseInfluence;
          const angle = Math.atan2(dy, dx);
          point.x = point.originX - Math.cos(angle) * force * 0.5;
          point.y = point.originY - Math.sin(angle) * force * 0.5;
        } else {
          point.x += (point.originX - point.x) * 0.08;
          point.y += (point.originY - point.y) * 0.08;
        }
      });

      // Draw radiating lines from focal points
      const drawRadialLines = () => {
        const focalPoints = [
          { x: width * 0.08, y: height * 0.05, lineCount: 16, maxOpacity: 0.12 },
          { x: width * 0.92, y: height * 0.08, lineCount: 14, maxOpacity: 0.10 },
          { x: width * 0.05, y: height * 0.95, lineCount: 12, maxOpacity: 0.08 },
          { x: width * 0.95, y: height * 0.92, lineCount: 14, maxOpacity: 0.10 },
          { x: width * 0.5, y: height * 0.4, lineCount: 32, maxOpacity: 0.06 },
        ];

        focalPoints.forEach((focal) => {
          const angleOffset = Math.random() * 0.001; // Subtle movement
          
          for (let i = 0; i < focal.lineCount; i++) {
            const angle = angleOffset + (i / focal.lineCount) * Math.PI * 2;
            const length = Math.max(width, height) * 2;
            
            const endX = focal.x + Math.cos(angle) * length;
            const endY = focal.y + Math.sin(angle) * length;

            // Calculate opacity based on mouse proximity
            const midX = focal.x + Math.cos(angle) * 200;
            const midY = focal.y + Math.sin(angle) * 200;
            const distToMouse = Math.sqrt(
              Math.pow(mouseRef.current.x - midX, 2) + 
              Math.pow(mouseRef.current.y - midY, 2)
            );
            const baseOpacity = focal.maxOpacity * 0.6;
            const opacity = baseOpacity + Math.max(0, (350 - distToMouse) / 350) * focal.maxOpacity * 0.5;

            ctx.beginPath();
            ctx.moveTo(focal.x, focal.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(180, 40, 40, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      };

      // Draw the mesh grid with parallax
      const drawMesh = () => {
        const { points, cols, rows } = mesh;

        for (let i = 0; i < cols - 1; i++) {
          for (let j = 0; j < rows - 1; j++) {
            const idx = i * rows + j;
            const point = points[idx];
            const rightPoint = points[idx + rows];
            const bottomPoint = points[idx + 1];
            const diagPoint = points[idx + rows + 1];

            if (!point || !rightPoint || !bottomPoint || !diagPoint) continue;

            // Calculate distance from mouse for opacity
            const centerX = (point.x + diagPoint.x) / 2;
            const centerY = (point.y + diagPoint.y) / 2;
            const distToMouse = Math.sqrt(
              Math.pow(mouseRef.current.x - centerX, 2) + 
              Math.pow(mouseRef.current.y - centerY, 2)
            );
            
            const baseOpacity = 0.04;
            const hoverOpacity = Math.max(0, (250 - distToMouse) / 250) * 0.12;
            const opacity = baseOpacity + hoverOpacity;

            // Draw grid lines
            ctx.strokeStyle = `rgba(140, 30, 30, ${opacity * 0.4})`;
            ctx.lineWidth = 0.3;

            // Horizontal
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(rightPoint.x, rightPoint.y);
            ctx.stroke();

            // Vertical
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(bottomPoint.x, bottomPoint.y);
            ctx.stroke();

            // Diagonal (more prominent)
            ctx.strokeStyle = `rgba(180, 40, 40, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(diagPoint.x, diagPoint.y);
            ctx.stroke();
          }
        }
      };

      // Draw corner accent lines
      const drawCornerAccents = () => {
        const corners = [
          { x: 0, y: 0, angles: [0.2, 0.4, 0.6, 0.8] },
          { x: width, y: 0, angles: [2.4, 2.6, 2.8, 3.0] },
          { x: 0, y: height, angles: [5.5, 5.7, 5.9, 6.1] },
          { x: width, y: height, angles: [3.5, 3.7, 3.9, 4.1] },
        ];

        corners.forEach(corner => {
          corner.angles.forEach((angle, idx) => {
            const length = 300 + idx * 100;
            const endX = corner.x + Math.cos(angle) * length;
            const endY = corner.y + Math.sin(angle) * length;

            const distToMouse = Math.sqrt(
              Math.pow(mouseRef.current.x - corner.x, 2) + 
              Math.pow(mouseRef.current.y - corner.y, 2)
            );
            const opacity = 0.15 + Math.max(0, (400 - distToMouse) / 400) * 0.15;

            ctx.beginPath();
            ctx.moveTo(corner.x, corner.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(200, 50, 50, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        });
      };

      drawRadialLines();
      drawMesh();
      drawCornerAccents();

      // Subtle mouse glow
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 300
      );
      gradient.addColorStop(0, 'rgba(180, 40, 40, 0.06)');
      gradient.addColorStop(0.4, 'rgba(180, 40, 40, 0.02)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Vignette effect
      const vignetteGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.7
      );
      vignetteGradient.addColorStop(0, 'transparent');
      vignetteGradient.addColorStop(0.7, 'transparent');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
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
