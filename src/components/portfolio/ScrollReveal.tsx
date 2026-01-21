import { ReactNode, CSSProperties } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'flip' | 'rotate';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
}

const animationStyles: Record<AnimationType, { hidden: CSSProperties; visible: CSSProperties }> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    hidden: { opacity: 0, transform: 'translateY(-40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    hidden: { opacity: 0, transform: 'translateX(-40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    hidden: { opacity: 0, transform: 'translateX(40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    hidden: { opacity: 0, transform: 'scale(0.8)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    hidden: { opacity: 0, transform: 'scale(1.2)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'flip': {
    hidden: { opacity: 0, transform: 'perspective(600px) rotateX(-30deg)' },
    visible: { opacity: 1, transform: 'perspective(600px) rotateX(0)' },
  },
  'rotate': {
    hidden: { opacity: 0, transform: 'rotate(-10deg) scale(0.9)' },
    visible: { opacity: 1, transform: 'rotate(0) scale(1)' },
  },
};

const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = '',
  style = {},
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });

  const animStyles = animationStyles[animation];
  const currentStyles = isVisible ? animStyles.visible : animStyles.hidden;

  const combinedStyles: CSSProperties = {
    ...style,
    ...currentStyles,
    transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={combinedStyles}>
      {children}
    </div>
  );
};

export default ScrollReveal;

// Staggered reveal for multiple children
interface StaggeredRevealProps {
  children: ReactNode[];
  animation?: AnimationType;
  staggerDelay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  itemClassName?: string;
}

export const StaggeredReveal = ({
  children,
  animation = 'fade-up',
  staggerDelay = 100,
  duration = 600,
  threshold = 0.1,
  className = '',
  itemClassName = '',
}: StaggeredRevealProps) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => {
        const animStyles = animationStyles[animation];
        const currentStyles = isVisible ? animStyles.visible : animStyles.hidden;

        return (
          <div
            key={index}
            className={itemClassName}
            style={{
              ...currentStyles,
              transition: `opacity ${duration}ms ease ${index * staggerDelay}ms, transform ${duration}ms ease ${index * staggerDelay}ms`,
              willChange: 'opacity, transform',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
