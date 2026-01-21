import { useEffect, useState, useCallback } from 'react';

type CursorType = 'default' | 'pointer' | 'grab' | 'text' | 'expand';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const updateCursorType = useCallback((target: HTMLElement) => {
    const tagName = target.tagName.toLowerCase();
    const isLink = tagName === 'a' || target.closest('a');
    const isButton = tagName === 'button' || target.closest('button') || target.getAttribute('role') === 'button';
    const isInput = ['input', 'textarea'].includes(tagName);
    const isDraggable = target.getAttribute('draggable') === 'true' || target.closest('[draggable="true"]');
    const isExpandable = target.closest('.expand-cursor') || target.classList.contains('expand-cursor');
    const isCard = target.closest('.project-card') || target.closest('.certificate-card');

    if (isExpandable || isCard) {
      setCursorType('expand');
    } else if (isDraggable) {
      setCursorType('grab');
    } else if (isInput) {
      setCursorType('text');
    } else if (isLink || isButton) {
      setCursorType('pointer');
    } else {
      setCursorType('default');
    }
  }, []);

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      updateCursorType(e.target as HTMLElement);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, input, textarea, [role="button"]').forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [updateCursorType]);

  if (!isVisible) return null;

  const getCursorStyles = () => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      left: position.x,
      top: position.y,
      pointerEvents: 'none',
      zIndex: 99999,
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease, opacity 0.2s ease',
    };

    const dotStyle: React.CSSProperties = {
      ...baseStyle,
      width: isClicking ? '8px' : '10px',
      height: isClicking ? '8px' : '10px',
      borderRadius: '50%',
      backgroundColor: 'hsl(var(--primary))',
      opacity: 0.9,
    };

    const ringStyle: React.CSSProperties = {
      ...baseStyle,
      width: isClicking ? '35px' : '45px',
      height: isClicking ? '35px' : '45px',
      borderRadius: '50%',
      border: '2px solid hsl(var(--primary) / 0.5)',
      backgroundColor: 'transparent',
      transition: 'width 0.3s ease, height 0.3s ease, transform 0.1s ease, border 0.2s ease',
    };

    switch (cursorType) {
      case 'pointer':
        return {
          dot: { ...dotStyle, backgroundColor: 'hsl(var(--primary))' },
          ring: { ...ringStyle, width: isClicking ? '50px' : '60px', height: isClicking ? '50px' : '60px', border: '2px solid hsl(var(--primary) / 0.8)' },
        };
      case 'grab':
        return {
          dot: { ...dotStyle, width: '20px', height: '20px', backgroundColor: 'hsl(var(--primary) / 0.3)' },
          ring: { ...ringStyle, width: '55px', height: '55px', borderStyle: 'dashed' as const },
        };
      case 'text':
        return {
          dot: { ...dotStyle, width: '3px', height: '24px', borderRadius: '2px' },
          ring: { ...ringStyle, opacity: 0 },
        };
      case 'expand':
        return {
          dot: { ...dotStyle, width: '60px', height: '60px', backgroundColor: 'hsl(var(--primary) / 0.15)', mixBlendMode: 'difference' as const },
          ring: { ...ringStyle, width: '80px', height: '80px', border: '2px solid hsl(var(--primary) / 0.4)' },
        };
      default:
        return { dot: dotStyle, ring: ringStyle };
    }
  };

  const styles = getCursorStyles();

  return (
    <>
      <div className="custom-cursor-ring" style={styles.ring} />
      <div className="custom-cursor-dot" style={styles.dot} />
      {cursorType === 'expand' && (
        <div
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 99999,
            fontSize: '10px',
            fontWeight: 600,
            color: 'hsl(var(--primary))',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          View
        </div>
      )}
    </>
  );
};

export default CustomCursor;
