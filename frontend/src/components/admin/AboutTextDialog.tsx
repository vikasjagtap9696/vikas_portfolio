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

  const parseEducation = (
    value: string,
    collegeValue?: string | null,
    cgpaValue?: string | null,
    startValue?: string | null,
    endValue?: string | null,
  ) => {
    const [degree = "", legacyCollege = "", legacyCgpa = "", legacyStart = "", legacyEnd = ""] = value.split("|").map((part) => part.trim());
    return {
      degree,
      college: collegeValue || legacyCollege,
      cgpa: cgpaValue || legacyCgpa,
      start: startValue || legacyStart,
      end: endValue || legacyEnd,
    };
  };

  useEffect(() => {
    if (profile) {
      setIntro(profile.about_intro || "");
      setDescription(profile.about_description || "");
      const primary = parseEducation(
        profile.about_education_primary || "",
        profile.about_education_primary_college,
        profile.about_education_primary_cgpa,
        profile.about_education_primary_start,
        profile.about_education_primary_end,
      );
      const secondary = parseEducation(
        profile.about_education_secondary || "",
        profile.about_education_secondary_college,
        profile.about_education_secondary_cgpa,
        profile.about_education_secondary_start,
        profile.about_education_secondary_end,
      );
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
          <div className="education-entry">
            <h4 className="education-entry-title">
              <GraduationCap size={16} />
              Primary Education
            </h4>
            <label className="education-field-label" htmlFor="primary-degree">Degree / Course</label>
            <input
              id="primary-degree"
              type="text"
              className="form-input-enhanced"
              value={educationPrimary}
              onChange={(e) => setEducationPrimary(e.target.value)}
              placeholder="e.g. B.Sc. Computer Science"
            />
            <label className="education-field-label" htmlFor="primary-college">College / University</label>
            <input id="primary-college" type="text" className="form-input-enhanced" value={primaryCollege} onChange={(e) => setPrimaryCollege(e.target.value)} placeholder="College / University name" />
            <label className="education-field-label" htmlFor="primary-cgpa">CGPA / Grade</label>
            <input id="primary-cgpa" type="text" className="form-input-enhanced" value={primaryCgpa} onChange={(e) => setPrimaryCgpa(e.target.value)} placeholder="e.g. 8.5 / 10" />
            <div className="education-date-fields">
              <div>
                <label className="education-field-label" htmlFor="primary-start">Start year</label>
                <input id="primary-start" type="text" className="form-input-enhanced" value={primaryStart} onChange={(e) => setPrimaryStart(e.target.value)} placeholder="2022" />
              </div>
              <div>
                <label className="education-field-label" htmlFor="primary-end">End year</label>
                <input id="primary-end" type="text" className="form-input-enhanced" value={primaryEnd} onChange={(e) => setPrimaryEnd(e.target.value)} placeholder="2025" />
              </div>
            </div>
          </div>
          <div className="education-entry">
            <h4 className="education-entry-title">
              <GraduationCap size={16} />
              Secondary Education
            </h4>
            <label className="education-field-label" htmlFor="secondary-degree">Degree / Course</label>
            <input
              id="secondary-degree"
              type="text"
              className="form-input-enhanced"
              value={educationSecondary}
              onChange={(e) => setEducationSecondary(e.target.value)}
              placeholder="e.g. Higher Secondary Certificate"
            />
            <label className="education-field-label" htmlFor="secondary-college">College / Institute</label>
            <input id="secondary-college" type="text" className="form-input-enhanced" value={secondaryCollege} onChange={(e) => setSecondaryCollege(e.target.value)} placeholder="College / Institute name" />
            <label className="education-field-label" htmlFor="secondary-cgpa">CGPA / Grade</label>
            <input id="secondary-cgpa" type="text" className="form-input-enhanced" value={secondaryCgpa} onChange={(e) => setSecondaryCgpa(e.target.value)} placeholder="e.g. 78%" />
            <div className="education-date-fields">
              <div>
                <label className="education-field-label" htmlFor="secondary-start">Start year</label>
                <input id="secondary-start" type="text" className="form-input-enhanced" value={secondaryStart} onChange={(e) => setSecondaryStart(e.target.value)} placeholder="2020" />
              </div>
              <div>
                <label className="education-field-label" htmlFor="secondary-end">End year</label>
                <input id="secondary-end" type="text" className="form-input-enhanced" value={secondaryEnd} onChange={(e) => setSecondaryEnd(e.target.value)} placeholder="2022" />
              </div>
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
