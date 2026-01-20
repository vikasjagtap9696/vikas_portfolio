import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onLoadingComplete, 800);
      }, 400);
    }
  }, [progress, onLoadingComplete]);

  return (
    <div
      className={`loading-screen ${isExiting ? "exiting" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "hsl(var(--background))",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.1)" : "scale(1)",
      }}
    >
      {/* Animated Logo */}
      <div
        className="loading-logo"
        style={{
          position: "relative",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse-glow 2s ease-in-out infinite",
            boxShadow: "0 0 60px hsl(var(--primary) / 0.4)",
          }}
        >
          <span
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "hsl(var(--primary-foreground))",
              fontFamily: "var(--font-heading)",
            }}
          >
            VJ
          </span>
        </div>
        
        {/* Orbiting dots */}
        <div
          style={{
            position: "absolute",
            inset: "-20px",
            animation: "spin 3s linear infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "hsl(var(--primary))",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: "-35px",
            animation: "spin 4s linear infinite reverse",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "hsl(var(--accent))",
            }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "200px",
          height: "4px",
          background: "hsl(var(--muted))",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: `${Math.min(progress, 100)}%`,
            height: "100%",
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
            borderRadius: "var(--radius-full)",
            transition: "width 0.15s ease",
          }}
        />
      </div>

      {/* Loading text */}
      <p
        style={{
          color: "hsl(var(--muted-foreground))",
          fontSize: "0.875rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Loading...
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 60px hsl(var(--primary) / 0.4);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 80px hsl(var(--primary) / 0.6);
          }
        }
      `}</style>
    </div>
  );
}
