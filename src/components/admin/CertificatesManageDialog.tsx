import { useState } from "react";
import { Modal } from "./Modal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useCertificates } from "@/hooks/useCertificates";
import { Edit3, Trash2, Plus, Award, CheckCircle, X, ExternalLink, Calendar, Image } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_url: string | null;
  image_url: string | null;
  display_order: number;
}

interface CertificatesManageDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CertificatesManageDialog({ open, onClose }: CertificatesManageDialogProps) {
  const { certificates, loading, addCertificate, updateCertificate, deleteCertificate } = useCertificates();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; certificate: Certificate | null }>({
    open: false,
    certificate: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    issuer: "", 
    issue_date: "", 
    credential_url: "", 
    image_url: "" 
  });

  const resetForm = () => {
    setFormData({ title: "", issuer: "", issue_date: "", credential_url: "", image_url: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (c: Certificate) => {
    setFormData({
      title: c.title,
      issuer: c.issuer,
      issue_date: c.issue_date || "",
      credential_url: c.credential_url || "",
      image_url: c.image_url || ""
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.issuer) return;
    setIsSaving(true);
    try {
      if (editingId) {
        await updateCertificate(editingId, formData);
      } else {
        await addCertificate({ ...formData, display_order: certificates.length });
      }
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (certificate: Certificate) => {
    setDeleteDialog({ open: true, certificate });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.certificate) return;
    setIsDeleting(true);
    try {
      await deleteCertificate(deleteDialog.certificate.id);
      setDeleteDialog({ open: false, certificate: null });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="Manage Certificates" size="lg" icon={<Award size={20} />}>
        {/* Add Button */}
        {!showForm && (
          <button className="btn-add-new" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            <span>Add New Certificate</span>
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="admin-form-card animate-scale-in">
            <div className="admin-form-header">
              <h4>{editingId ? "Edit Certificate" : "Add New Certificate"}</h4>
              <button className="btn-icon-close" onClick={resetForm}>
                <X size={16} />
              </button>
            </div>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon">🏆</span>
                  Certificate Title
                </label>
                <input 
                  type="text" 
                  className="form-input-enhanced" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="AWS Solutions Architect"
                />
              </div>
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon">🏛️</span>
                  Issuer
                </label>
                <input 
                  type="text" 
                  className="form-input-enhanced" 
                  value={formData.issuer} 
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon"><Calendar size={14} /></span>
                  Issue Date
                </label>
                <input 
                  type="date" 
                  className="form-input-enhanced" 
                  value={formData.issue_date} 
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label-enhanced">
                  <span className="form-label-icon"><ExternalLink size={14} /></span>
                  Credential URL
                </label>
                <input 
                  type="url" 
                  className="form-input-enhanced" 
                  value={formData.credential_url} 
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="https://credential.link/..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label-enhanced">
                <span className="form-label-icon"><Image size={14} /></span>
                Certificate Image URL (optional)
              </label>
              <input 
                type="url" 
                className="form-input-enhanced" 
                value={formData.image_url} 
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            
            <div className="form-actions-enhanced">
              <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              <button 
                className="btn btn-primary btn-glow" 
                onClick={handleSave}
                disabled={!formData.title || !formData.issuer || isSaving}
              >
                {isSaving ? (
                  <><span className="spinner-small" /> Saving...</>
                ) : (
                  <><CheckCircle size={16} /> {editingId ? "Update" : "Add"} Certificate</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Certificates List */}
        <div className="admin-list-container">
          {loading ? (
            <div className="admin-list-loading">
              <span className="spinner" />
              <p>Loading certificates...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="admin-list-empty-enhanced">
              <Award size={48} />
              <h4>No Certificates Yet</h4>
              <p>Add your certifications and credentials</p>
            </div>
          ) : (
            <div className="certificates-grid-admin">
              {certificates.map((cert, index) => (
                <div 
                  key={cert.id} 
                  className="certificate-card-admin animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="certificate-card-image">
                    {cert.image_url ? (
                      <img src={cert.image_url} alt={cert.title} />
                    ) : (
                      <div className="certificate-card-placeholder">
                        <Award size={32} />
                      </div>
                    )}
                  </div>
                  <div className="certificate-card-content">
                    <h4>{cert.title}</h4>
                    <p className="certificate-issuer">{cert.issuer}</p>
                    {cert.issue_date && (
                      <p className="certificate-date">
                        <Calendar size={12} /> {formatDate(cert.issue_date)}
                      </p>
                    )}
                    {cert.credential_url && (
                      <a 
                        href={cert.credential_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="certificate-link"
                      >
                        <ExternalLink size={12} /> View Credential
                      </a>
                    )}
                  </div>
                  <div className="certificate-card-actions">
                    <button 
                      className="btn-action btn-action-edit"
                      onClick={() => handleEdit(cert)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="btn-action btn-action-delete"
                      onClick={() => handleDeleteClick(cert)}
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
        onClose={() => setDeleteDialog({ open: false, certificate: null })}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteDialog.certificate?.title}"?`}
        isDeleting={isDeleting}
      />
    </>
  );
}
