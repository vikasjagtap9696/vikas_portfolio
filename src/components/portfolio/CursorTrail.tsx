import { useEffect, useRef, useCallback } from "react";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  id: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const idCounter = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    
    // Add new trail point
    trailRef.current.push({
      x: e.clientX,
      y: e.clientY,
      age: 0,
      id: idCounter.current++,
    });

    // Limit trail length
    if (trailRef.current.length > 50) {
      trailRef.current.shift();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw trail points
    trailRef.current = trailRef.current.filter((point) => {
      point.age += 1;
      
      // Remove old points
      if (point.age > 30) return false;

      // Calculate opacity and size based on age
      const lifeProgress = point.age / 30;
      const opacity = 1 - lifeProgress;
      const size = (1 - lifeProgress * 0.5) * 8;

      // Draw glow effect
      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        size * 3
      );
      gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity * 0.8})`);
      gradient.addColorStop(0.4, `rgba(139, 92, 246, ${opacity * 0.3})`);
      gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

      ctx.beginPath();
      ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw core
      ctx.beginPath();
      ctx.arc(point.x, point.y, size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
      ctx.fill();

      return true;
    });

    // Draw connecting lines between recent points
    if (trailRef.current.length > 1) {
      ctx.beginPath();
      ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
      
      for (let i = 1; i < trailRef.current.length; i++) {
        const point = trailRef.current[i];
        const prevPoint = trailRef.current[i - 1];
        
        // Smooth curve
        const cpX = (point.x + prevPoint.x) / 2;
        const cpY = (point.y + prevPoint.y) / 2;
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, cpY);
      }
      
      const lastPoint = trailRef.current[trailRef.current.length - 1];
      const opacity = Math.max(0, 1 - lastPoint.age / 30);
      ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-trail-canvas"
      aria-hidden="true"
    />
  );
}
