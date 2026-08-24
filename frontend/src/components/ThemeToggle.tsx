import { useState, useEffect, useCallback } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
    document.documentElement.classList.toggle("light", !shouldBeDark);
  }, []);

  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Create overlay for transition effect
    const overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
      overflow: hidden;
    `;

    // Create expanding circle
    const circle = document.createElement("div");
    const size = Math.max(window.innerWidth, window.innerHeight) * 2.5;
    circle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      margin-left: -${size / 2}px;
      margin-top: -${size / 2}px;
      border-radius: 50%;
      background: ${isDark ? "radial-gradient(circle, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)" : "radial-gradient(circle, #0b1120 0%, #111827 50%, #1e293b 100%)"};
      transform: scale(0);
      animation: themeRipple 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `;

    overlay.appendChild(circle);
    document.body.appendChild(overlay);

    // Remove overlay after animation
    setTimeout(() => {
      overlay.remove();
    }, 800);
  }, [isDark]);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    createRipple(e);

    // Delay theme change slightly for visual effect
    setTimeout(() => {
      const newTheme = !isDark;
      setIsDark(newTheme);
      document.documentElement.classList.toggle("dark", newTheme);
      document.documentElement.classList.toggle("light", !newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
    }, 300);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  return (
    <>
      <style>{`
        @keyframes themeRipple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        
        @keyframes iconRotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(0.8);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
        
        @keyframes starTwinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        
        @keyframes sunRays {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .theme-toggle-icon.animating svg {
          animation: iconRotate 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .theme-toggle:hover .sun-rays {
          animation: sunRays 8s linear infinite;
        }
      `}</style>
      
      <button
        onClick={toggleTheme}
        className={`theme-toggle ${isAnimating ? "animating" : ""}`}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        disabled={isAnimating}
      >
        <div className="theme-toggle-track">
          <div className={`theme-toggle-thumb ${isDark ? "dark" : "light"}`}>
            <div className={`theme-toggle-icon ${isAnimating ? "animating" : ""}`}>
              {isDark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sun-icon">
                  <circle cx="12" cy="12" r="5" />
                  <g className="sun-rays">
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </g>
                </svg>
              )}
            </div>
          </div>
        </div>
        <span className="theme-toggle-stars">
          {isDark && (
            <>
              <span className="star star-1" style={{ animationDelay: "0s" }}>✦</span>
              <span className="star star-2" style={{ animationDelay: "0.2s" }}>✦</span>
              <span className="star star-3" style={{ animationDelay: "0.4s" }}>✦</span>
            </>
          )}
        </span>
      </button>
    </>
  );
}
