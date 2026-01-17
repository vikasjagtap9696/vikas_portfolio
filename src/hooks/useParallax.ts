import { useEffect, useState, useCallback } from "react";

interface ParallaxOffset {
  x: number;
  y: number;
}

interface UseParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal" | "both";
  reverse?: boolean;
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, direction = "vertical", reverse = false } = options;
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const multiplier = reverse ? -1 : 1;

    setOffset({
      x: direction === "horizontal" || direction === "both" ? scrollX * speed * multiplier : 0,
      y: direction === "vertical" || direction === "both" ? scrollY * speed * multiplier : 0,
    });
  }, [speed, direction, reverse]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return offset;
}

// Multi-layer parallax for complex effects
export function useMultiLayerParallax(layerCount: number, baseSpeed: number = 0.1) {
  const [offsets, setOffsets] = useState<ParallaxOffset[]>(
    Array(layerCount).fill({ x: 0, y: 0 })
  );

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    
    setOffsets(
      Array(layerCount)
        .fill(null)
        .map((_, index) => {
          const layerSpeed = baseSpeed * (index + 1);
          return {
            x: 0,
            y: scrollY * layerSpeed,
          };
        })
    );
  }, [layerCount, baseSpeed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return offsets;
}
