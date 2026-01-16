export function WaveTransition() {
  return (
    <div className="wave-container">
      <svg
        className="wave-svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Back wave - slowest */}
        <path
          className="wave wave-back"
          fill="url(#waveGradient1)"
          d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,75 1440,60 L1440,120 L0,120 Z"
        />
        
        {/* Middle wave */}
        <path
          className="wave wave-middle"
          fill="url(#waveGradient2)"
          d="M0,80 C240,40 480,100 720,80 C960,60 1200,100 1440,80 L1440,120 L0,120 Z"
        />
        
        {/* Front wave - fastest */}
        <path
          className="wave wave-front"
          fill="url(#waveGradient3)"
          d="M0,90 C180,110 360,70 540,90 C720,110 900,70 1080,90 C1260,110 1380,85 1440,90 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
