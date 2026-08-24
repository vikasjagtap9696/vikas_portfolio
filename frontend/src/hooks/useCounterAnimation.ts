import { useEffect, useState, useRef } from "react";

interface UseCounterAnimationOptions {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

export function useCounterAnimation({
  end,
  duration = 2000,
  delay = 0,
  suffix = "",
  prefix = "",
}: UseCounterAnimationOptions) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const startValue = 0;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart);
        
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [hasStarted, end, duration, delay]);

  const displayValue = `${prefix}${count}${suffix}`;

  return { ref, displayValue, count };
}

// Helper to parse stat strings like "3+", "25+", "100%", "15+"
export function parseStatValue(stat: string): { value: number; suffix: string; prefix: string } {
  const match = stat.match(/^([^\d]*)(\d+)(.*)$/);
  if (match) {
    return {
      prefix: match[1] || "",
      value: parseInt(match[2], 10),
      suffix: match[3] || "",
    };
  }
  return { value: 0, suffix: "", prefix: "" };
}
