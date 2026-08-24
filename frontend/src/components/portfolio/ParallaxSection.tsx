import { ReactNode } from "react";
import { useParallax } from "@/hooks/useParallax";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  variant?: "circles" | "blobs" | "dots" | "gradient";
}

export function ParallaxSection({ children, className = "", variant = "circles" }: ParallaxSectionProps) {
  const isMobile = typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches;

  const p1 = useParallax({ speed: 0.1, direction: "both" });
  const p2 = useParallax({ speed: 0.15, direction: "both", reverse: true });
  const p3 = useParallax({ speed: 0.08, direction: "vertical" });

  const parallax1 = isMobile ? { x: 0, y: 0 } : p1;
  const parallax2 = isMobile ? { x: 0, y: 0 } : p2;
  const parallax3 = isMobile ? { x: 0, y: 0 } : p3;

  const renderBackground = () => {
    switch (variant) {
      case "circles":
        return (
          <>
            <div
              className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl -top-32 -left-32"
              style={{ transform: `translate(${parallax1.x}px, ${parallax1.y}px)` }}
            />
            <div
              className="absolute w-48 h-48 rounded-full bg-accent/5 blur-3xl -bottom-24 -right-24"
              style={{ transform: `translate(${parallax2.x}px, ${parallax2.y}px)` }}
            />
          </>
        );
      case "blobs":
        return (
          <>
            <div
              className="absolute w-96 h-96 bg-primary/3 blur-3xl rounded-full -top-48 left-1/4"
              style={{ transform: `translate(${parallax1.x}px, ${parallax1.y}px)` }}
            />
            <div
              className="absolute w-72 h-72 bg-accent/3 blur-3xl rounded-full -bottom-36 right-1/4"
              style={{ transform: `translate(${parallax2.x}px, ${parallax2.y}px)` }}
            />
            <div
              className="absolute w-56 h-56 bg-secondary/5 blur-2xl rounded-full top-1/2 -left-28"
              style={{ transform: `translate(${parallax3.x}px, ${parallax3.y}px)` }}
            />
          </>
        );
      case "dots":
        return (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              transform: `translate(${parallax1.x * 0.5}px, ${parallax1.y * 0.5}px)`,
            }}
          />
        );
      case "gradient":
        return (
          <>
            <div
              className="absolute w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent -top-0"
              style={{ transform: `translateY(${parallax1.y * 0.3}px)` }}
            />
            <div
              className="absolute w-full h-1/2 bg-gradient-to-t from-accent/5 to-transparent -bottom-0"
              style={{ transform: `translateY(${parallax2.y * 0.3}px)` }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        {renderBackground()}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
