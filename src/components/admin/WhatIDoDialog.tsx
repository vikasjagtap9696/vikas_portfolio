import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/useProfileSettings";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

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
    <Modal open={open} onClose={onClose} title="Edit What I Do">
      <div className="form-group">
        <label className="form-label">Add New Item</label>
        <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
          <input
            type="text"
            className="form-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title (e.g. Frontend)"
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              className="form-input"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Technologies (e.g. React, Next.js)"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button className="btn btn-primary" onClick={handleAdd}>
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Current Items</label>
        {items.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>No items added yet</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((item, index) => (
              <li key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem",
                background: "var(--color-bg-secondary)",
                borderRadius: "4px",
                marginBottom: "0.5rem"
              }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{item.title}</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{item.tech}</p>
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleRemove(index)}
                  style={{ color: "var(--color-danger)" }}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}
