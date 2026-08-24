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

  useEffect(() => {
    if (profile) {
      setIntro(profile.about_intro || "");
      setDescription(profile.about_description || "");
      setEducationPrimary(profile.about_education_primary || "");
      setEducationSecondary(profile.about_education_secondary || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        about_intro: intro,
        about_description: description,
        about_education_primary: educationPrimary,
        about_education_secondary: educationSecondary,
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

        <div className="form-grid-2">
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
              placeholder="e.g. B.Tech in IT"
            />
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
              placeholder="e.g. Web Development Certification"
            />
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
