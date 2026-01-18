import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTextScramble } from "@/hooks/useTextScramble";

interface ScrambleTitleProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  highlightText?: string;
  highlightClassName?: string;
  scrambleSpeed?: number;
  scrambleDuration?: number;
}

export function ScrambleTitle({
  children,
  as: Tag = "h2",
  className = "",
  highlightText,
  highlightClassName = "gradient-text",
  scrambleSpeed = 40,
  scrambleDuration = 1000,
}: ScrambleTitleProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.5, triggerOnce: true });

  // Split text into regular and highlighted parts
  let regularText = children;
  let highlightPart = "";
  
  if (highlightText && children.includes(highlightText)) {
    const parts = children.split(highlightText);
    regularText = parts[0];
    highlightPart = highlightText;
  }

  const { displayText: scrambledRegular } = useTextScramble({
    text: regularText,
    speed: scrambleSpeed,
    scrambleDuration,
    trigger: isVisible,
  });

  const { displayText: scrambledHighlight } = useTextScramble({
    text: highlightPart,
    speed: scrambleSpeed,
    scrambleDuration: scrambleDuration + 200,
    trigger: isVisible,
  });

  return (
    <div ref={ref}>
      <Tag className={`scramble-title ${className} ${isVisible ? 'revealed' : ''}`}>
        <span className="scramble-text">{scrambledRegular}</span>
        {highlightPart && (
          <span className={`scramble-text ${highlightClassName}`}>{scrambledHighlight}</span>
        )}
      </Tag>
    </div>
  );
}
