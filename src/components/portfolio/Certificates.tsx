import { useState } from "react";
import { useCertificates } from "@/hooks/useCertificates";
import { useAuth } from "@/contexts/AuthContext";
import { CertificatesManageDialog } from "@/components/admin/CertificatesManageDialog";
import { format } from "date-fns";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ScrambleTitle } from "./ScrambleTitle";

export function Certificates() {
  const { certificates, loading } = useCertificates();
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="certificate-card glass">
      <div className="certificate-image-container">
        <div className="skeleton" style={{ height: "100%", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />
      </div>
      <div className="certificate-content">
        <div className="skeleton" style={{ height: "1.25rem", width: "80%", marginBottom: "0.75rem" }} />
        <div className="skeleton" style={{ height: "1rem", width: "60%", marginBottom: "0.5rem" }} />
        <div className="skeleton" style={{ height: "0.875rem", width: "40%" }} />
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
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      </div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "hsl(var(--foreground))" }}>
        No Certificates Yet
      </h3>
      <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1.5rem" }}>
        {user ? "Add your first certificate to showcase your credentials." : "Certificates will appear here once added."}
      </p>
      {user && (
        <button className="btn btn-primary" onClick={() => setShowDialog(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.5rem" }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Certificate
        </button>
      )}
    </div>
  );

  return (
    <section ref={sectionRef} id="certificates" className={`section relative section-animate-zoom ${isVisible ? 'visible' : ''}`}>
      {/* Admin Edit Button */}
      {user && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 50 }}>
          <button className="section-edit-btn" onClick={() => setShowDialog(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Certificates
          </button>
        </div>
      )}

      {/* Background decoration */}
      <div 
        className="bg-blob bg-blob-primary" 
        style={{ bottom: 0, left: 0, width: "24rem", height: "24rem" }}
      />

      <div className="container relative z-10">
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <ScrambleTitle 
            className="section-title" 
            highlightText="Certificates"
          >
            Certificates & Credentials
          </ScrambleTitle>
          <p className="section-subtitle">
            Professional certifications validating my skills and expertise
          </p>
        </div>

        {loading ? (
          <div className="certificates-grid">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={`certificates-grid stagger-scale ${isVisible ? 'visible' : ''}`}>
            {certificates.map((cert, index) => (
              <div
                key={cert.id}
                className="certificate-card glass hover-glow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="certificate-image-container">
                  <img
                    src={cert.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop"}
                    alt={cert.title}
                    className="certificate-image"
                  />
                  <div className="certificate-overlay" />
                  <div className="certificate-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </div>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certificate-link"
                      aria-label="View credential"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                </div>

                <div className="certificate-content">
                  <h3 className="certificate-title">{cert.title}</h3>
                  <p className="certificate-issuer">{cert.issuer}</p>
                  <div className="certificate-date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{formatDate(cert.issue_date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <CertificatesManageDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </section>
  );
}