import { useState } from "react";
import { Modal } from "./Modal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useSkills, Skill } from "@/hooks/useSkills";
import { Edit3, Trash2, Plus, Zap, Code, CheckCircle, X, GripVertical } from "lucide-react";

interface SkillsManageDialogProps {
  open: boolean;
  onClose: () => void;
}

const categoryOptions = [
  { value: "Frontend", icon: <Code size={14} />, color: "#8b5cf6" },
  { value: "Backend", icon: <Zap size={14} />, color: "#06b6d4" },
  { value: "Database", icon: <Code size={14} />, color: "#10b981" },
  { value: "DevOps", icon: <Zap size={14} />, color: "#f59e0b" },
  { value: "Tools", icon: <Code size={14} />, color: "#ec4899" },
];

export function SkillsManageDialog({ open, onClose }: SkillsManageDialogProps) {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; skill: Skill | null }>({
    open: false,
    skill: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "Frontend", 
    icon: "", 
    proficiency: 80 
  });

  const resetForm = () => {
    setFormData({ name: "", category: "Frontend", icon: "", proficiency: 80 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (skill: Skill) => {
    setFormData({ 
      name: skill.name, 
      category: skill.category, 
      icon: skill.icon || "", 
      proficiency: skill.proficiency || 80 
    });
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) return;
    setIsSaving(true);
    try {
      if (editingId) {
        await updateSkill(editingId, formData);
      } else {
        await addSkill({ ...formData, display_order: skills.length });
      }
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (skill: Skill) => {
    setDeleteDialog({ open: true, skill });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.skill) return;
    setIsDeleting(true);
    try {
      await deleteSkill(deleteDialog.skill.id);
      setDeleteDialog({ open: false, skill: null });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <>
      <Modal open={open} onClose={onClose} title="Manage Skills" size="lg" icon={<Zap size={20} />}>
        {/* Add Button */}
        {!showForm && (
          <button 
            className="btn-add-new"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            <span>Add New Skill</span>
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="admin-form-card animate-scale-in">
            <div className="admin-form-header">
              <h4>{editingId ? "Edit Skill" : "Add New Skill"}</h4>
              <button className="btn-icon-close" onClick={resetForm}>
                <X size={16} />
              </button>
            </div>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon">📝</span>
                  Skill Name
                </label>
                <input 
                  type="text" 
                  className="form-input-enhanced" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., React, Node.js"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon">📁</span>
                  Category
                </label>
                <select 
                  className="form-select-enhanced" 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.value}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label-enhanced">
                <span className="form-label-icon">💪</span>
                Proficiency: {formData.proficiency}%
              </label>
              <div className="slider-enhanced-wrapper">
                <input 
                  type="range" 
                  className="slider-enhanced" 
                  min="0" 
                  max="100" 
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                />
                <div 
                  className="slider-fill" 
                  style={{ width: `${formData.proficiency}%` }}
                />
              </div>
            </div>
            
            <div className="form-actions-enhanced">
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button 
                className="btn btn-primary btn-glow" 
                onClick={handleSave}
                disabled={!formData.name || isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-small" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    {editingId ? "Update Skill" : "Add Skill"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Skills List */}
        <div className="admin-list-container">
          {loading ? (
            <div className="admin-list-loading">
              <span className="spinner" />
              <p>Loading skills...</p>
            </div>
          ) : Object.keys(groupedSkills).length === 0 ? (
            <div className="admin-list-empty-enhanced">
              <Zap size={48} />
              <h4>No Skills Yet</h4>
              <p>Add your first skill to get started</p>
            </div>
          ) : (
            Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="skill-category-group animate-fade-in">
                <div className="skill-category-header-admin">
                  <span className="skill-category-badge">{category}</span>
                  <span className="skill-category-count">{categorySkills.length} skills</span>
                </div>
                <div className="skill-items-list">
                  {categorySkills.map((skill, index) => (
                    <div 
                      key={skill.id} 
                      className="admin-list-item-enhanced"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="admin-list-item-drag">
                        <GripVertical size={16} />
                      </div>
                      <div className="admin-list-item-content">
                        <div className="admin-list-item-title">{skill.name}</div>
                        <div className="admin-list-item-meta">
                          <div className="proficiency-bar-mini">
                            <div 
                              className="proficiency-fill-mini"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span>{skill.proficiency}%</span>
                        </div>
                      </div>
                      <div className="admin-list-item-actions">
                        <button 
                          className="btn-action btn-action-edit"
                          onClick={() => handleEdit(skill)}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="btn-action btn-action-delete"
                          onClick={() => handleDeleteClick(skill)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, skill: null })}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteDialog.skill?.name}"?`}
        isDeleting={isDeleting}
      />
    </>
  );
}
