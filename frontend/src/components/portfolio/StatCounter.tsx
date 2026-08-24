import { useRef, useCallback, useEffect } from "react";
import { useCounterAnimation, parseStatValue } from "@/hooks/useCounterAnimation";

interface StatCounterProps {
  value: string;
  label: string;
  detail?: string;
  delay?: number;
}

export function StatCounter({ value, label, detail, delay = 0 }: StatCounterProps) {
  const { value: numValue, suffix, prefix } = parseStatValue(value);
  const { ref, displayValue } = useCounterAnimation({
    end: numValue,
    duration: 2000,
    delay,
    suffix,
    prefix,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }, [ref]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, [ref]);

  return (
    <div
      ref={ref}
      className="stat-card stat-card-3d glass hover-glow stat-reveal"
      style={{ animationDelay: `${delay / 1000}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      <div className="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <div className="stat-value gradient-text">{displayValue}</div>
      <div className="stat-label">{label}</div>
      {detail && <div className="stat-detail">{detail}</div>}
    </div>
  );
}
