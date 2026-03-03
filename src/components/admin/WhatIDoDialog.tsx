import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/useProfileSettings";
import { toast } from "sonner";
import { Plus, Trash2, CheckCircle, Briefcase, Zap, Terminal } from "lucide-react";

interface WhatIDoDialogProps {
  open: boolean;
  onClose: () => void;
}

interface WhatIDoItem {
  title: string;
  tech: string;
}

export function WhatIDoDialog({ open, onClose }: WhatIDoDialogProps) {
  const { data: profile } = useProfileSettings();
  const updateProfile = useUpdateProfileSettings();

  const [items, setItems] = useState<WhatIDoItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newTech, setNewTech] = useState("");

  useEffect(() => {
    if (profile) {
      setItems(profile.what_i_do || []);
    }
  }, [profile]);

  const handleAdd = () => {
    if (newTitle.trim() && newTech.trim()) {
      setItems([...items, { title: newTitle.trim(), tech: newTech.trim() }]);
      setNewTitle("");
      setNewTech("");
    }
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        what_i_do: items,
      });
      toast.success("What I Do updated!");
      onClose();
    } catch (error) {
      toast.error("Failed to update What I Do");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Services & Focus" size="md" icon={<Briefcase size={20} />}>
      <div className="admin-form-container">
        <div className="admin-form-card" style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <label className="form-label-enhanced">
            <span className="form-label-icon"><Plus size={14} /></span>
            Add New Service/Focus
          </label>
          <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
            <input
              type="text"
              className="form-input-enhanced"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title (e.g. Frontend Development)"
            />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                className="form-input-enhanced"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Tech (e.g. React, Vue, Next.js)"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <button className="btn btn-primary" onClick={handleAdd} style={{ padding: '0 1rem' }}>
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label-enhanced">
            <span className="form-label-icon"><Terminal size={14} /></span>
            Active Services ({items.length})
          </label>
          {items.length === 0 ? (
            <div className="admin-list-empty-enhanced" style={{ padding: '2rem 1rem' }}>
              <Zap size={32} />
              <p>No items added yet</p>
            </div>
          ) : (
            <div className="admin-list-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item, index) => (
                  <div key={index} className="admin-list-item-enhanced">
                    <div className="admin-list-item-content">
                      <div className="admin-list-item-title">{item.title}</div>
                      <div className="admin-list-item-meta">{item.tech}</div>
                    </div>
                    <button
                      className="btn-action btn-action-delete"
                      onClick={() => handleRemove(index)}
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
              <><CheckCircle size={16} /> Update Portfolio</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
