import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectsManageDialog } from "@/components/admin/ProjectsManageDialog";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ScrambleTitle } from "./ScrambleTitle";

export function Projects() {
  const { projects, loading } = useProjects();
  const { user } = useAuth();
  const { data: profileSettings } = useProfileSettings();
  const [showDialog, setShowDialog] = useState(false);
  const { ref: sectionRef, isVisible: scrollIsVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const isVisible = true; // Force true for debugging "not seen" issue

  // Ensure tech_stack is an array
  const getTechStack = (tech: any): string[] => {
    if (Array.isArray(tech)) return tech;
    if (typeof tech === 'string') {
      try { return JSON.parse(tech); } catch (e) { return tech.split(',').map((s: string) => s.trim()); }
    }
    return [];
  };

  // Show all projects if no featured ones, or just show featured. 
  // For debugging "not seen", let's prioritize showing *something* if data exists.
  const featuredProjects = projects.some(p => p.featured) ? projects.filter(p => p.featured) : projects;

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="project-card glass animate-pulse">
      <div className="project-image-container">
        <div className="skeleton-image" style={{ height: "200px", background: "hsl(var(--muted))", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />
      </div>
      <div className="project-content">
        <div className="skeleton-text" style={{ height: "1.5rem", width: "70%", background: "hsl(var(--muted))", borderRadius: "var(--radius)", marginBottom: "0.75rem" }} />
        <div className="skeleton-text" style={{ height: "1rem", width: "100%", background: "hsl(var(--muted))", borderRadius: "var(--radius)", marginBottom: "0.5rem" }} />
        <div className="skeleton-text" style={{ height: "1rem", width: "80%", background: "hsl(var(--muted))", borderRadius: "var(--radius)", marginBottom: "1rem" }} />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-badge" style={{ height: "1.5rem", width: "4rem", background: "hsl(var(--muted))", borderRadius: "var(--radius-full)" }} />
          ))}
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
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
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "hsl(var(--foreground))" }}>
        No Projects Yet
      </h3>
      <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1.5rem" }}>
        {user ? "Add your first project to showcase your work." : "Projects will appear here once added."}
      </p>
      {user && (
        <button className="btn btn-primary" onClick={() => setShowDialog(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.5rem" }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Project
        </button>
      )}
    </div>
  );

  return (
    <section ref={sectionRef} id="projects" className={`section section-animate-curtain visible`} style={{ position: "relative" }}>
      {/* Admin Edit Button */}
      {user && projects.length > 0 && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 50 }}>
          <button className="section-edit-btn" onClick={() => setShowDialog(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Projects
          </button>
        </div>
      )}

      <div className="container">
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <ScrambleTitle
            className="section-title"
            highlightText="Projects"
          >
            Featured Projects
          </ScrambleTitle>
          <p className="section-subtitle">
            A showcase of my recent work and personal projects
          </p>
        </div>

        {loading ? (
          <div className="projects-grid">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featuredProjects.length === 0 && projects.length === 0 ? (
          <EmptyState />
        ) : featuredProjects.length === 0 ? (
          <div className="empty-state glass" style={{
            textAlign: "center",
            padding: "3rem 2rem",
            borderRadius: "var(--radius-xl)",
            maxWidth: "500px",
            margin: "0 auto"
          }}>
            <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
              No featured projects. Mark projects as "Featured" to display them here.
            </p>
            {user && (
              <button className="btn btn-outline" onClick={() => setShowDialog(true)}>
                Manage Projects
              </button>
            )}
          </div>
        ) : (
          <div className={`projects-grid stagger-wave visible`}>
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="project-card glass hover-glow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-image-container">
                  <img
                    src={project.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"}
                    alt={project.title}
                    className="project-image"
                  />
                  <div className="project-image-overlay" />
                  <div className="project-links">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        aria-label="GitHub"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        aria-label="Live Demo"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech-stack">
                    {getTechStack(project.tech_stack).slice(0, 4).map((tech) => (
                      <span key={tech} className="badge">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {profileSettings?.github_url && (
          <div className="text-center" style={{ marginTop: "3rem" }}>
            <a
              href={profileSettings.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "0.5rem" }}>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View All on GitHub
            </a>
          </div>
        )}
      </div>

      {/* Dialog */}
      <ProjectsManageDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </section>
  );
}