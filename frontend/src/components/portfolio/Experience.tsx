import { useState } from "react";
import { useExperiences, type Experience as ExperienceType } from "@/hooks/useExperiences";
import { useAuth } from "@/contexts/AuthContext";
import { ExperienceManageDialog } from "@/components/admin/ExperienceManageDialog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ScrambleTitle } from "./ScrambleTitle";

const typeLabels: Record<string, string> = {
  job: "Job",
  internship: "Internship",
  freelance: "Freelance",
  education: "Education"
};

export function Experience() {
  const { experiences: dbExperiences } = useExperiences();
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  const experiences = dbExperiences || [];

  return (
    <section ref={sectionRef} id="experience" className={`section relative section-animate-left ${isVisible ? 'visible' : ''}`}>
      {/* Admin Edit Button */}
      {user && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 50 }}>
          <button className="section-edit-btn" onClick={() => setShowDialog(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Experience
          </button>
        </div>
      )}

      {/* Background decoration */}
      <div
        className="bg-blob bg-blob-accent"
        style={{ top: 0, right: 0, width: "24rem", height: "24rem" }}
      />

      <div className="container relative z-10">
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <ScrambleTitle
            className="section-title"
            highlightText="Experience"
          >
            Work Experience
          </ScrambleTitle>
          <p className="section-subtitle">
            My professional journey and educational background
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="empty-state glass" style={{
            textAlign: "center",
            padding: "4rem 2rem",
            borderRadius: "var(--radius-xl)",
            maxWidth: "500px",
            margin: "0 auto"
          }}>
            <div className="empty-state-icon" style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1.5rem",
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2))",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "hsl(var(--foreground))" }}>
              No Experience Yet
            </h3>
            <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1.5rem" }}>
              {user ? "Add your first experience to showcase your journey." : "Experience will appear here once added."}
            </p>
            {user && (
              <button className="btn btn-primary" onClick={() => setShowDialog(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.5rem" }}>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Experience
              </button>
            )}
          </div>
        ) : (
        <div className={`timeline stagger-alternate ${isVisible ? 'visible' : ''}`}>
          <div className="timeline-line" />

          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="timeline-item"
            >
              {/* Timeline dot */}
              <div className="timeline-dot">
                {exp.is_current && (
                  <span className="animate-pulse" style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-primary)",
                    opacity: 0.75
                  }} />
                )}
              </div>

              {/* Content */}
              <div className="timeline-content">
                <div className="experience-card glass hover-glow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="experience-header">
                    <div>
                      <h3 className="experience-title">{exp.title}</h3>
                      <div className="experience-company">
                        {exp.experience_type === "education" ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                            <path d="M10 6h4"></path>
                            <path d="M10 10h4"></path>
                            <path d="M10 14h4"></path>
                            <path d="M10 18h4"></path>
                          </svg>
                        )}
                        <span>{exp.company}</span>
                      </div>
                    </div>
                    {exp.is_current ? (
                      <span className="experience-badge education">Current</span>
                    ) : exp.experience_type && (
                      <span className={`experience-badge ${exp.experience_type === "education" ? "education" : "work"}`}>
                        {typeLabels[exp.experience_type] || exp.experience_type}
                      </span>
                    )}
                  </div>

                  <div className="experience-meta">
                    <div className="experience-meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {exp.period}
                    </div>
                    {exp.location && (
                      <div className="experience-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {exp.location}
                      </div>
                    )}
                  </div>

                  {exp.description && exp.description.length > 0 && (
                    <ul className="experience-description about-list">
                      {exp.description.map((item, i) => (
                        <li key={i} className="about-list-item text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="experience-tech">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="experience-tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Empty space for timeline alignment */}
              <div className="timeline-spacer" />
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Dialog */}
      <ExperienceManageDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </section>
  );
}