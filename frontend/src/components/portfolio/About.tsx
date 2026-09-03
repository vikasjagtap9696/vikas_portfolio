import { useState } from "react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useAuth } from "@/contexts/AuthContext";
import { AboutTextDialog } from "@/components/admin/AboutTextDialog";
import { CareerGoalsDialog } from "@/components/admin/CareerGoalsDialog";
import { AboutImageDialog } from "@/components/admin/AboutImageDialog";
import { WhatIDoDialog } from "@/components/admin/WhatIDoDialog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ScrambleTitle } from "./ScrambleTitle";

export function About() {
  const { data: profileSettings } = useProfileSettings();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  const careerGoals = profileSettings?.career_goals || [];
  const whatIDo = profileSettings?.what_i_do || [];

  const parseEducation = (edu: string, college: string | null | undefined, cgpa: string | null | undefined, start: string | null | undefined, end: string | null | undefined) => {
    const [title = "", legacyCollege = "", legacyCgpa = "", legacyStart = "", legacyEnd = ""] = edu.split("|").map(s => s.trim());
    return {
      title,
      college: college || legacyCollege,
      cgpa: cgpa || legacyCgpa,
      start: start || legacyStart,
      end: end || legacyEnd,
    };
  };

  const primaryEdu = parseEducation(
    profileSettings?.about_education_primary || "",
    profileSettings?.about_education_primary_college,
    profileSettings?.about_education_primary_cgpa,
    profileSettings?.about_education_primary_start,
    profileSettings?.about_education_primary_end,
  );
  const secondaryEdu = parseEducation(
    profileSettings?.about_education_secondary || "",
    profileSettings?.about_education_secondary_college,
    profileSettings?.about_education_secondary_cgpa,
    profileSettings?.about_education_secondary_start,
    profileSettings?.about_education_secondary_end,
  );

  return (
    <section ref={sectionRef} id="about" className={`section section-animate-rotate ${isVisible ? 'visible' : ''}`} style={{ position: "relative" }}>
      {/* Admin Edit Button */}
      {user && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 50, display: "flex", gap: "0.5rem" }}>
          <button className="section-edit-btn" onClick={() => setOpenDialog("aboutText")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit About
          </button>
          <button className="section-edit-btn" onClick={() => setOpenDialog("careerGoals")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Goals
          </button>
          <button className="section-edit-btn" onClick={() => setOpenDialog("aboutImage")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
           Image
          </button>
          <button className="section-edit-btn" onClick={() => setOpenDialog("whatIDo")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            What I Do
          </button>
        </div>
      )}

      <div className="container">
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <ScrambleTitle 
            className="section-title" 
            highlightText="Me"
          >
            About Me
          </ScrambleTitle>
          <p className="section-subtitle">
            {profileSettings?.about_intro || ""}
          </p>
        </div>

       

        <div className={`about-grid stagger-alternate ${isVisible ? 'visible' : ''}`}>
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Who I Am */}
            <div className="about-card glass hover-glow">
              <div className="about-card-header">
                <div className="about-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3 className="about-card-title">Who I Am</h3>
              </div>
              <p className="about-card-content">
                {profileSettings?.about_description || ""}
              </p>
            </div>

            {/* Education */}
            <div className="about-card glass hover-glow">
              <div className="about-card-header">
                <div className="about-icon" style={{ background: "rgba(6, 182, 212, 0.2)", color: "var(--color-accent)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <h3 className="about-card-title">Education</h3>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-medium">{primaryEdu.title}</p>
                  {primaryEdu.college && <p className="text-muted text-sm">{primaryEdu.college}</p>}
                  {(primaryEdu.cgpa || primaryEdu.start || primaryEdu.end) && (
                    <p className="text-muted text-sm about-education-meta">
                      {primaryEdu.cgpa && `CGPA: ${primaryEdu.cgpa}`}
                      {(primaryEdu.start || primaryEdu.end) && ` | ${primaryEdu.start || ""} - ${primaryEdu.end || "Present"}`}
                    </p>
                  )}
                </div>
                <div>
                  <p className="font-medium">{secondaryEdu.title}</p>
                  {secondaryEdu.college && <p className="text-muted text-sm">{secondaryEdu.college}</p>}
                  {(secondaryEdu.cgpa || secondaryEdu.start || secondaryEdu.end) && (
                    <p className="text-muted text-sm about-education-meta">
                      {secondaryEdu.cgpa && `CGPA: ${secondaryEdu.cgpa}`}
                      {(secondaryEdu.start || secondaryEdu.end) && ` | ${secondaryEdu.start || ""} - ${secondaryEdu.end || "Present"}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Career Goals */}
            <div className="about-card glass hover-glow">
              <div className="about-card-header">
                <div className="about-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
                <h3 className="about-card-title">Career Goals</h3>
              </div>
              <ul className="about-list">
                {careerGoals.map((goal, index) => (
                  <li key={index} className="about-list-item">
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            {/* What I Do */}
            <div className="about-card glass hover-glow">
              <div className="about-card-header">
                <div className="about-icon" style={{ background: "rgba(6, 182, 212, 0.2)", color: "var(--color-accent)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <h3 className="about-card-title">What I Do</h3>
              </div>
              <div className="what-i-do-grid">
                {whatIDo.map((item, index) => (
                  <div key={index} className="what-i-do-item">
                    <p className="what-i-do-title">{item.title}</p>
                    <p className="what-i-do-tech">{item.tech}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AboutTextDialog open={openDialog === "aboutText"} onClose={() => setOpenDialog(null)} />
      <CareerGoalsDialog open={openDialog === "careerGoals"} onClose={() => setOpenDialog(null)} />
      <AboutImageDialog open={openDialog === "aboutImage"} onClose={() => setOpenDialog(null)} />
      <WhatIDoDialog open={openDialog === "whatIDo"} onClose={() => setOpenDialog(null)} />
    </section>
  );
}