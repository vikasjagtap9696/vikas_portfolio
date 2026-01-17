import { ReactNode } from "react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function MagneticButton({ children, className = "", onClick, style }: MagneticButtonProps) {
  const magnetic = useMagneticEffect({ strength: 0.4, ease: 0.12 });

  return (
    <button
      ref={magnetic.ref}
      className={`magnetic-btn ${className}`}
      onClick={onClick}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      onMouseEnter={magnetic.onMouseEnter}
      style={style}
    >
      <span className="magnetic-btn-content">{children}</span>
    </button>
  );
}
