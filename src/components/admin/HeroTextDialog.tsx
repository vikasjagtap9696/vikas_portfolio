import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/useProfileSettings";
import { toast } from "sonner";
import { CheckCircle, User, Type, FileText } from "lucide-react";

interface HeroTextDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HeroTextDialog({ open, onClose }: HeroTextDialogProps) {
  const { data: profile } = useProfileSettings();
  const updateProfile = useUpdateProfileSettings();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.hero_name || "");
      setTitle(profile.hero_title || "");
      setSubtitle(profile.hero_subtitle || "");
      setBio(profile.hero_bio || "");
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        hero_name: name,
        hero_title: title,
        hero_subtitle: subtitle,
        hero_bio: bio,
      });
      toast.success("Hero text updated!");
      onClose();
    } catch (error) {
      toast.error("Failed to update hero text");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Hero Text" size="lg">
      <div className="admin-form-container">
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon"><User size={14} /></span>
              Your Name
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vikas Jagtap"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon"><Type size={14} /></span>
              Professional Title
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Full Stack Developer"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label-enhanced">
            <span className="form-label-icon"><Type size={14} /></span>
            Subtitle / Intro Line
          </label>
          <input
            type="text"
            className="form-input-enhanced"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Crafting Digital Experiences..."
          />
        </div>

        <div className="form-group">
          <label className="form-label-enhanced">
            <span className="form-label-icon"><FileText size={14} /></span>
            Hero Bio
          </label>
          <textarea
            className="form-textarea-enhanced"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your story in a few sentences..."
            rows={4}
          />
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
              <><CheckCircle size={16} /> Update Hero</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
