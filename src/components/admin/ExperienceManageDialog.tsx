import { useState } from "react";
import { Modal } from "./Modal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useExperiences, Experience } from "@/hooks/useExperiences";
import { Edit3, Trash2, Plus, Briefcase, CheckCircle, X, MapPin, Calendar, GraduationCap, Building } from "lucide-react";

interface ExperienceManageDialogProps {
  open: boolean;
  onClose: () => void;
}

const experienceTypes = [
  { value: "job", label: "Work Experience", icon: <Briefcase size={14} /> },
  { value: "education", label: "Education", icon: <GraduationCap size={14} /> },
  { value: "internship", label: "Internship", icon: <Building size={14} /> },
];

export function ExperienceManageDialog({ open, onClose }: ExperienceManageDialogProps) {
  const { experiences, loading, addExperience, updateExperience, deleteExperience } = useExperiences();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; experience: Experience | null }>({
    open: false,
    experience: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    company: "", 
    location: "", 
    period: "", 
    description: "", 
    technologies: "", 
    experience_type: "job", 
    is_current: false 
  });

  const resetForm = () => {
    setFormData({ title: "", company: "", location: "", period: "", description: "", technologies: "", experience_type: "job", is_current: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (e: Experience) => {
    setFormData({
      title: e.title,
      company: e.company,
      location: e.location || "",
      period: e.period,
      description: e.description?.join("\n") || "",
      technologies: e.technologies?.join(", ") || "",
      experience_type: e.experience_type || "job",
      is_current: e.is_current || false
    });
    setEditingId(e.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.company || !formData.period) return;
    setIsSaving(true);
    const data = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      period: formData.period,
      description: formData.description.split("\n").filter(Boolean),
      technologies: formData.technologies.split(",").map(s => s.trim()).filter(Boolean),
      experience_type: formData.experience_type,
      is_current: formData.is_current,
      display_order: experiences.length
    };
    try {
      if (editingId) await updateExperience(editingId, data);
      else await addExperience(data);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (experience: Experience) => {
    setDeleteDialog({ open: true, experience });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.experience) return;
    setIsDeleting(true);
    try {
      await deleteExperience(deleteDialog.experience.id);
      setDeleteDialog({ open: false, experience: null });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "education": return <GraduationCap size={16} />;
      case "internship": return <Building size={16} />;
      default: return <Briefcase size={16} />;
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="Manage Experience" size="lg" icon={<Briefcase size={20} />}>
        {/* Add Button */}
        {!showForm && (
          <button className="btn-add-new" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            <span>Add New Experience</span>
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="admin-form-card animate-scale-in">
            <div className="admin-form-header">
              <h4>{editingId ? "Edit Experience" : "Add New Experience"}</h4>
              <button className="btn-icon-close" onClick={resetForm}>
                <X size={16} />
              </button>
            </div>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon">💼</span>
                  Job Title
                </label>
                <input 
                  type="text" 
                  className="form-input-enhanced" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon">🏢</span>
                  Company / Institution
                </label>
                <input 
                  type="text" 
                  className="form-input-enhanced" 
                  value={formData.company} 
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Google"
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon"><Calendar size={14} /></span>
                  Period
                </label>
                <input 
                  type="text" 
                  className="form-input-enhanced" 
                  value={formData.period} 
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="Jan 2022 - Present"
                />
              </div>
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon"><MapPin size={14} /></span>
                  Location
                </label>
                <input 
                  type="text" 
                  className="form-input-enhanced" 
                  value={formData.location} 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon">📑</span>
                  Type
                </label>
                <select 
                  className="form-select-enhanced" 
                  value={formData.experience_type}
                  onChange={(e) => setFormData({ ...formData, experience_type: e.target.value })}
                >
                  {experienceTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label-enhanced">
                <span className="form-label-icon">📝</span>
                Description (one per line)
              </label>
              <textarea 
                className="form-textarea-enhanced" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="• Led development of key features&#10;• Improved performance by 50%"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label-enhanced">
                <span className="form-label-icon">🔧</span>
                Technologies (comma-separated)
              </label>
              <input 
                type="text" 
                className="form-input-enhanced" 
                value={formData.technologies} 
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>

            <div className="form-checkbox-enhanced">
              <input 
                type="checkbox" 
                id="is_current" 
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
              />
              <label htmlFor="is_current">
                <CheckCircle size={14} />
                Currently Working Here
              </label>
            </div>
            
            <div className="form-actions-enhanced">
              <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              <button 
                className="btn btn-primary btn-glow" 
                onClick={handleSave}
                disabled={!formData.title || !formData.company || !formData.period || isSaving}
              >
                {isSaving ? (
                  <><span className="spinner-small" /> Saving...</>
                ) : (
                  <><CheckCircle size={16} /> {editingId ? "Update" : "Add"} Experience</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Experience List */}
        <div className="admin-list-container">
          {loading ? (
            <div className="admin-list-loading">
              <span className="spinner" />
              <p>Loading experiences...</p>
            </div>
          ) : experiences.length === 0 ? (
            <div className="admin-list-empty-enhanced">
              <Briefcase size={48} />
              <h4>No Experience Yet</h4>
              <p>Add your work history and education</p>
            </div>
          ) : (
            <div className="experience-list-admin">
              {experiences.map((exp, index) => (
                <div 
                  key={exp.id} 
                  className="experience-card-admin animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="experience-card-icon">
                    {getTypeIcon(exp.experience_type)}
                  </div>
                  <div className="experience-card-content">
                    <div className="experience-card-header">
                      <h4>{exp.title}</h4>
                      {exp.is_current && <span className="current-badge">Current</span>}
                    </div>
                    <p className="experience-card-company">{exp.company}</p>
                    <div className="experience-card-meta">
                      <span><Calendar size={12} /> {exp.period}</span>
                      {exp.location && <span><MapPin size={12} /> {exp.location}</span>}
                    </div>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="experience-card-tech">
                        {exp.technologies.slice(0, 4).map((tech, i) => (
                          <span key={i} className="tech-tag-mini">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="experience-card-actions">
                    <button 
                      className="btn-action btn-action-edit"
                      onClick={() => handleEdit(exp)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="btn-action btn-action-delete"
                      onClick={() => handleDeleteClick(exp)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, experience: null })}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteDialog.experience?.title}" at ${deleteDialog.experience?.company}?`}
        isDeleting={isDeleting}
      />
    </>
  );
}
