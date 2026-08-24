import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/useProfileSettings";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface HeroStatsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HeroStatsDialog({ open, onClose }: HeroStatsDialogProps) {
  const { data: profile } = useProfileSettings();
  const updateProfile = useUpdateProfileSettings();

  const [yearsExperience, setYearsExperience] = useState("");
  const [projectsCompleted, setProjectsCompleted] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [clientSatisfaction, setClientSatisfaction] = useState("");

  useEffect(() => {
    if (profile) {
      setYearsExperience(profile.stat_years_experience || "");
      setProjectsCompleted(profile.stat_projects_completed || "");
      setTechnologies(profile.stat_technologies || "");
      setClientSatisfaction(profile.stat_client_satisfaction || "");
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        stat_years_experience: yearsExperience,
        stat_projects_completed: projectsCompleted,
        stat_technologies: technologies,
        stat_client_satisfaction: clientSatisfaction,
      });
      toast.success("Hero stats updated!");
      onClose();
    } catch (error) {
      toast.error("Failed to update hero stats");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Hero Stats" size="lg">
      <div className="admin-form-container">
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon">📈</span>
              Years of Experience
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              placeholder="e.g. 5+"
            />
          </div>
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon">🚀</span>
              Projects Completed
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={projectsCompleted}
              onChange={(e) => setProjectsCompleted(e.target.value)}
              placeholder="e.g. 50+"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon">💻</span>
              Technologies
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g. 20+"
            />
          </div>
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon">😊</span>
              Client Satisfaction
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={clientSatisfaction}
              onChange={(e) => setClientSatisfaction(e.target.value)}
              placeholder="e.g. 100%"
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
              <><CheckCircle size={16} /> Save Stats</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
