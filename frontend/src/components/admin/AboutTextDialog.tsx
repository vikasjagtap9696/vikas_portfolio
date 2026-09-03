import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/useProfileSettings";
import { toast } from "sonner";
import { CheckCircle, Info, FileText, GraduationCap } from "lucide-react";

interface AboutTextDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AboutTextDialog({ open, onClose }: AboutTextDialogProps) {
  const { data: profile } = useProfileSettings();
  const updateProfile = useUpdateProfileSettings();

  const [intro, setIntro] = useState("");
  const [description, setDescription] = useState("");
  const [educationPrimary, setEducationPrimary] = useState("");
  const [educationSecondary, setEducationSecondary] = useState("");
  const [primaryCollege, setPrimaryCollege] = useState("");
  const [primaryCgpa, setPrimaryCgpa] = useState("");
  const [primaryStart, setPrimaryStart] = useState("");
  const [primaryEnd, setPrimaryEnd] = useState("");
  const [secondaryCollege, setSecondaryCollege] = useState("");
  const [secondaryCgpa, setSecondaryCgpa] = useState("");
  const [secondaryStart, setSecondaryStart] = useState("");
  const [secondaryEnd, setSecondaryEnd] = useState("");

  const parseEducation = (value: string) => {
    const [degree = "", college = "", cgpa = "", start = "", end = ""] = value.split("|").map((part) => part.trim());
    return { degree, college, cgpa, start, end };
  };

  useEffect(() => {
    if (profile) {
      setIntro(profile.about_intro || "");
      setDescription(profile.about_description || "");
      const primary = parseEducation(profile.about_education_primary || "");
      const secondary = parseEducation(profile.about_education_secondary || "");
      setEducationPrimary(primary.degree);
      setEducationSecondary(secondary.degree);
      setPrimaryCollege(primary.college);
      setPrimaryCgpa(primary.cgpa);
      setPrimaryStart(primary.start);
      setPrimaryEnd(primary.end);
      setSecondaryCollege(secondary.college);
      setSecondaryCgpa(secondary.cgpa);
      setSecondaryStart(secondary.start);
      setSecondaryEnd(secondary.end);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        about_intro: intro,
        about_description: description,
        about_education_primary: educationPrimary.trim(),
        about_education_secondary: educationSecondary.trim(),
        about_education_primary_college: primaryCollege.trim(),
        about_education_primary_cgpa: primaryCgpa.trim(),
        about_education_primary_start: primaryStart.trim(),
        about_education_primary_end: primaryEnd.trim(),
        about_education_secondary_college: secondaryCollege.trim(),
        about_education_secondary_cgpa: secondaryCgpa.trim(),
        about_education_secondary_start: secondaryStart.trim(),
        about_education_secondary_end: secondaryEnd.trim(),
      });
      toast.success("About text updated!");
      onClose();
    } catch (error) {
      toast.error("Failed to update about text");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit About Section" size="lg" icon={<Info size={20} />}>
      <div className="admin-form-container">
        <div className="form-group">
          <label className="form-label-enhanced">
            <span className="form-label-icon"><Info size={14} /></span>
            About Intro (Short Hook)
          </label>
          <input
            type="text"
            className="form-input-enhanced"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="I am a passionate software engineer..."
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label-enhanced">
            <span className="form-label-icon"><FileText size={14} /></span>
            Detailed Biography
          </label>
          <textarea
            className="form-textarea-enhanced"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell your professional story..."
            rows={5}
          />
        </div>

        <div className="form-grid-2 education-form-grid">
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon"><GraduationCap size={14} /></span>
              Primary Education
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={educationPrimary}
              onChange={(e) => setEducationPrimary(e.target.value)}
              placeholder="Degree, e.g. B.Tech in IT"
            />
            <input type="text" className="form-input-enhanced" value={primaryCollege} onChange={(e) => setPrimaryCollege(e.target.value)} placeholder="College / University" />
            <input type="text" className="form-input-enhanced" value={primaryCgpa} onChange={(e) => setPrimaryCgpa(e.target.value)} placeholder="CGPA / Grade" />
            <div className="form-grid-2">
              <input type="text" className="form-input-enhanced" value={primaryStart} onChange={(e) => setPrimaryStart(e.target.value)} placeholder="Starting year" />
              <input type="text" className="form-input-enhanced" value={primaryEnd} onChange={(e) => setPrimaryEnd(e.target.value)} placeholder="Ending year" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon"><GraduationCap size={14} /></span>
              Secondary Education / Certs
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={educationSecondary}
              onChange={(e) => setEducationSecondary(e.target.value)}
              placeholder="Degree / Certification"
            />
            <input type="text" className="form-input-enhanced" value={secondaryCollege} onChange={(e) => setSecondaryCollege(e.target.value)} placeholder="College / Institute" />
            <input type="text" className="form-input-enhanced" value={secondaryCgpa} onChange={(e) => setSecondaryCgpa(e.target.value)} placeholder="CGPA / Grade" />
            <div className="form-grid-2">
              <input type="text" className="form-input-enhanced" value={secondaryStart} onChange={(e) => setSecondaryStart(e.target.value)} placeholder="Starting year" />
              <input type="text" className="form-input-enhanced" value={secondaryEnd} onChange={(e) => setSecondaryEnd(e.target.value)} placeholder="Ending year" />
            </div>
          </div>
        </div>

        <div className="form-actions-enhanced" style={{ borderTop: 'none', paddingTop: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary btn-glow"
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <><span className="spinner-small" /> Saving...</>
            ) : (
              <><CheckCircle size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
