import { useEffect, useState, useRef, useCallback } from "react";

interface UseTextScrambleOptions {
  text: string;
  speed?: number;
  scrambleDuration?: number;
  characters?: string;
  trigger?: boolean;
}

export function useTextScramble({
  text,
  speed = 50,
  scrambleDuration = 800,
  characters = "!<>-_\\/[]{}—=+*^?#________",
  trigger = true,
}: UseTextScrambleOptions) {
  const [displayText, setDisplayText] = useState(text);
  const [isComplete, setIsComplete] = useState(false);
  const frameRef = useRef<number>();
  const hasStarted = useRef(false);

  const randomChar = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, [characters]);

  useEffect(() => {
    if (!trigger || hasStarted.current) return;
    hasStarted.current = true;

    const chars = text.split("");
    const totalFrames = Math.ceil(scrambleDuration / speed);
    let frame = 0;

    const update = () => {
      const progress = frame / totalFrames;
      
      const result = chars.map((char, index) => {
        // Calculate when this character should be revealed
        const revealPoint = index / chars.length;
        
        if (char === " ") return " ";
        
        if (progress >= revealPoint + 0.3) {
          // Character is fully revealed
          return char;
        } else if (progress >= revealPoint) {
          // Character is being scrambled
          return randomChar();
        } else {
          // Character hasn't started yet - show scrambled
          return randomChar();
        }
      });

      setDisplayText(result.join(""));
      frame++;

      if (frame <= totalFrames + 5) {
        frameRef.current = requestAnimationFrame(update);
      } else {
        setDisplayText(text);
        setIsComplete(true);
      }
    };

    // Start with scrambled text
    setDisplayText(chars.map(c => c === " " ? " " : randomChar()).join(""));
    frameRef.current = requestAnimationFrame(update);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [trigger, text, speed, scrambleDuration, randomChar]);

  return { displayText, isComplete };
}
