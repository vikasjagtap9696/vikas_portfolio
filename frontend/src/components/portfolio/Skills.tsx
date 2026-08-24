import { useState } from "react";
import { useSkills, Skill } from "@/hooks/useSkills";
import { useAuth } from "@/contexts/AuthContext";
import { SkillsManageDialog } from "@/components/admin/SkillsManageDialog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ScrambleTitle } from "./ScrambleTitle";

const categoryConfig: Record<string, { color: "primary" | "accent" }> = {
  "Frontend": { color: "primary" },
  "Backend": { color: "accent" },
  "Database": { color: "primary" },
  "Tools & Others": { color: "accent" }
};

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "Frontend":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      );
    case "Backend":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
      );
    case "Database":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      );
  }
};

export function Skills() {
  const { skills: dbSkills } = useSkills();
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const { ref: sectionRef, isVisible: scrollIsVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  const isVisible = true; // Force true for debugging "not seen" issue
  const skills = dbSkills || [];

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section ref={sectionRef} id="skills" className={`section relative section-animate-elastic ${isVisible ? 'visible' : ''}`}>
      {/* Admin Edit Button */}
      {user && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 50 }}>
          <button className="section-edit-btn" onClick={() => setShowDialog(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Skills
          </button>
        </div>
      )}

      {/* Background decoration */}
      <div
        className="bg-blob bg-blob-primary"
        style={{ top: "50%", left: 0, width: "18rem", height: "18rem", transform: "translateY(-50%)" }}
      />
      <div
        className="bg-blob bg-blob-accent"
        style={{ top: "50%", right: 0, width: "18rem", height: "18rem", transform: "translateY(-50%)" }}
      />

      <div className="container relative z-10">
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <ScrambleTitle
            className="section-title"
            highlightText="Skills"
          >
            My Skills
          </ScrambleTitle>
          <p className="section-subtitle">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {Object.keys(skillsByCategory).length === 0 ? (
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
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "hsl(var(--foreground))" }}>
              No Skills Yet
            </h3>
            <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1.5rem" }}>
              {user ? "Add your first skill to showcase your expertise." : "Skills will appear here once added."}
            </p>
            {user && (
              <button className="btn btn-primary" onClick={() => setShowDialog(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.5rem" }}>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Skill
              </button>
            )}
          </div>
        ) : (
        <div className={`skills-grid stagger-scale ${isVisible ? 'visible' : ''}`}>
          {Object.entries(skillsByCategory).map(([category, categorySkills], index) => {
            const config = categoryConfig[category] || { color: "primary" };

            return (
              <div
                key={category}
                className="skill-category glass hover-glow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="skill-category-header">
                  <div className={`skill-category-icon ${config.color}`}>
                    <CategoryIcon category={category} />
                  </div>
                  <h3 className="skill-category-title">{category}</h3>
                </div>

                <div className="skill-list">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percent">{skill.proficiency}%</span>
                      </div>
                      <div className="progress-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Tech Stack Tags */}
        <div style={{ marginTop: "4rem" }}>
          <p className="text-center text-muted" style={{ marginBottom: "2rem" }}>Technologies I work with</p>
          <div className="tech-tags">
            {skills.slice(0, 10).map((skill) => (
              <div key={skill.id} className="tech-tag glass hover-scale">
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog */}
      <SkillsManageDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </section>
  );
}