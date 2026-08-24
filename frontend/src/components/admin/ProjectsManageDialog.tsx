import { useState } from "react";
import { Modal } from "./Modal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { ImageUpload } from "./ImageUpload";
import { useProjects, Project } from "@/hooks/useProjects";
import { Edit3, Trash2, Plus, FolderOpen, CheckCircle, X, ExternalLink, Github, Star } from "lucide-react";

interface ProjectsManageDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ProjectsManageDialog({ open, onClose }: ProjectsManageDialogProps) {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    github_url: "",
    live_url: "",
    tech_stack: "",
    featured: false
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", image_url: "", github_url: "", live_url: "", tech_stack: "", featured: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (p: Project) => {
    setFormData({
      title: p.title,
      description: p.description || "",
      image_url: p.image_url || "",
      github_url: p.github_url || "",
      live_url: p.live_url || "",
      tech_stack: p.tech_stack?.join(", ") || "",
      featured: p.featured || false
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title) return;
    setIsSaving(true);

    const baseData = {
      title: formData.title,
      description: formData.description || "",
      image_url: formData.image_url || "",
      github_url: formData.github_url || "",
      live_url: formData.live_url || "",
      tech_stack: formData.tech_stack.split(",").map(s => s.trim()).filter(Boolean),
      featured: formData.featured || false
    };

    try {
      if (editingId) {
        // Partial update via helper or direct call - backend now supports partial
        await updateProject(editingId, baseData);
      } else {
        // For new projects, add display_order
        await addProject({ ...baseData, display_order: projects.length });
      }
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setDeleteDialog({ open: true, project });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.project) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteDialog.project.id);
      setDeleteDialog({ open: false, project: null });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="Manage Projects" size="lg" icon={<FolderOpen size={20} />}>
        {/* Add Button */}
        <button className="btn-add-new" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>Add New Project</span>
        </button>

        {/* Projects List */}
        <div className="admin-list-container">
          {loading ? (
            <div className="admin-list-loading">
              <span className="spinner" />
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="admin-list-empty-enhanced">
              <FolderOpen size={48} />
              <h4>No Projects Yet</h4>
              <p>Add your first project to showcase your work</p>
            </div>
          ) : (
            <div className="projects-grid-admin">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="project-card-admin animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="project-card-image-admin">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} />
                    ) : (
                      <div className="project-card-placeholder">
                        <FolderOpen size={24} />
                      </div>
                    )}
                    {project.featured && (
                      <span className="project-featured-badge">
                        <Star size={12} /> Featured
                      </span>
                    )}
                  </div>
                  <div className="project-card-content-admin">
                    <h4>{project.title}</h4>
                    {project.description && (
                      <p className="project-card-desc">{project.description.slice(0, 80)}...</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="project-card-tech">
                        {project.tech_stack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="tech-tag-mini">{tech}</span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="tech-tag-mini">+{project.tech_stack.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="project-card-actions-admin">
                    <button
                      className="btn-action btn-action-edit"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="btn-action btn-action-delete"
                      onClick={() => handleDeleteClick(project)}
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

      {/* Add/Edit Project Modal */}
      <Modal
        open={showForm}
        onClose={resetForm}
        title={editingId ? "Edit Project" : "Add New Project"}
        size="lg"
        icon={editingId ? <Edit3 size={20} /> : <Plus size={20} />}
      >
        <div className="admin-form-container">
          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon">📋</span>
              Project Title
            </label>
            <input
              type="text"
              className="form-input-enhanced"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Project"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label-enhanced">
              <span className="form-label-icon">📝</span>
              Description
            </label>
            <textarea
              className="form-textarea-enhanced"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label-enhanced">
                <span className="form-label-icon">🖼️</span>
                Project Image
              </label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                bucket="images"
                folder="projects"
              />
            </div>
            <div className="form-group">
              <label className="form-label-enhanced">
                <span className="form-label-icon">🔧</span>
                Tech Stack
              </label>
              <input
                type="text"
                className="form-input-enhanced"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label-enhanced">
                <span className="form-label-icon"><Github size={14} /></span>
                GitHub URL
              </label>
              <input
                type="url"
                className="form-input-enhanced"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="form-group">
              <label className="form-label-enhanced">
                <span className="form-label-icon"><ExternalLink size={14} /></span>
                Live URL
              </label>
              <input
                type="url"
                className="form-input-enhanced"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                placeholder="https://myproject.com"
              />
            </div>
          </div>

          <div className="form-checkbox-enhanced" style={{ margin: '1rem 0' }}>
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              style={{ width: 'auto', marginRight: '0.5rem' }}
            />
            <label htmlFor="featured" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <Star size={14} />
              Featured Project
            </label>
          </div>

          <div className="form-actions-enhanced" style={{ borderTop: 'none', paddingTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            <button
              className="btn btn-primary btn-glow"
              onClick={handleSave}
              disabled={!formData.title || isSaving}
            >
              {isSaving ? (
                <><span className="spinner-small" /> Saving...</>
              ) : (
                <><CheckCircle size={16} /> {editingId ? "Update" : "Add"} Project</>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, project: null })}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteDialog.project?.title}"?`}
        isDeleting={isDeleting}
      />
    </>
  );
}
