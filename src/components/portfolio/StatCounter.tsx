import { useCounterAnimation, parseStatValue } from "@/hooks/useCounterAnimation";

interface StatCounterProps {
  value: string;
  label: string;
  delay?: number;
}

export function StatCounter({ value, label, delay = 0 }: StatCounterProps) {
  const { value: numValue, suffix, prefix } = parseStatValue(value);
  const { ref, displayValue } = useCounterAnimation({
    end: numValue,
    duration: 2000,
    delay,
    suffix,
    prefix,
  });

  return (
    <div 
      ref={ref} 
      className="stat-card glass hover-glow stat-reveal" 
      style={{ animationDelay: `${delay / 1000}s` }}
    >
      <div className="stat-value gradient-text">{displayValue}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
