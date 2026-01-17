import { useCallback, useRef } from "react";

interface MagneticOptions {
  strength?: number;
  ease?: number;
}

export function useMagneticEffect(options: MagneticOptions = {}) {
  const { strength = 0.3, ease = 0.15 } = options;
  const elementRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  const animate = useCallback(() => {
    if (!elementRef.current) return;

    // Smooth lerp animation
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    elementRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0)`;

    // Continue animation if not at target
    if (
      Math.abs(targetX.current - currentX.current) > 0.1 ||
      Math.abs(targetY.current - currentY.current) > 0.1
    ) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [ease]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      targetX.current = deltaX * strength;
      targetY.current = deltaY * strength;

      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [strength, animate]
  );

  const handleMouseLeave = useCallback(() => {
    targetX.current = 0;
    targetY.current = 0;

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseEnter = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.style.transition = "none";
    }
  }, []);

  return {
    ref: elementRef,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
  };
}
