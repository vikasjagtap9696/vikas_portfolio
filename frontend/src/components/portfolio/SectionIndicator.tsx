import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certificates", label: "Certificates" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

export function SectionIndicator() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" }
      );

      observer.observe(element);
      observers.push(observer);
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observers.forEach((obs) => obs.disconnect());
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className="group relative flex items-center justify-end"
          aria-label={`Navigate to ${label}`}
        >
          {/* Label tooltip */}
          <span
            className={`absolute right-6 px-2 py-1 text-xs font-medium rounded bg-card/90 backdrop-blur-sm border border-border/50 whitespace-nowrap transition-all duration-300 ${
              activeSection === id
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0"
            }`}
          >
            {label}
          </span>

          {/* Dot indicator */}
          <span
            className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === id
                ? "bg-primary scale-125"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/60 scale-100"
            }`}
          >
            {activeSection === id && (
              <>
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                <span className="absolute -inset-1 rounded-full border border-primary/50" />
              </>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
