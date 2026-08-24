import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/useProfileSettings";
import { toast } from "sonner";
import { Plus, Trash2, CheckCircle, Target, Trophy, Flame } from "lucide-react";

interface CareerGoalsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CareerGoalsDialog({ open, onClose }: CareerGoalsDialogProps) {
  const { data: profile } = useProfileSettings();
  const updateProfile = useUpdateProfileSettings();

  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    if (profile) {
      setGoals(profile.career_goals || []);
    }
  }, [profile]);

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal("");
    }
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        career_goals: goals,
      });
      toast.success("Career goals updated!");
      onClose();
    } catch (error) {
      toast.error("Failed to update career goals");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Career Goals" size="md" icon={<Target size={20} />}>
      <div className="admin-form-container">
        <div className="admin-form-card" style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <label className="form-label-enhanced">
            <span className="form-label-icon"><Plus size={14} /></span>
            Add New Goal / Aspiration
          </label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="text"
              className="form-input-enhanced"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="e.g. Master system design architecture"
              onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
            />
            <button className="btn btn-primary" onClick={handleAddGoal} style={{ padding: '0 1rem' }}>
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label-enhanced">
            <span className="form-label-icon"><Trophy size={14} /></span>
            Current Goals ({goals.length})
          </label>
          {goals.length === 0 ? (
            <div className="admin-list-empty-enhanced" style={{ padding: '2rem 1rem' }}>
              <Flame size={32} />
              <p>No goals added yet</p>
            </div>
          ) : (
            <div className="admin-list-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {goals.map((goal, index) => (
                  <div key={index} className="admin-list-item-enhanced">
                    <div className="admin-list-item-content">
                      <div className="admin-list-item-title">{goal}</div>
                    </div>
                    <button
                      className="btn-action btn-action-delete"
                      onClick={() => handleRemoveGoal(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <><CheckCircle size={16} /> Update Goals</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
