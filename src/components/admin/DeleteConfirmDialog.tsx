import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay-enhanced" onClick={onClose} style={{ cursor: 'auto' }}>
      <div 
        className="delete-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'auto' }}
      >
        <div className="delete-confirm-icon">
          <AlertTriangle size={32} />
        </div>
        <h3 className="delete-confirm-title">{title}</h3>
        <p className="delete-confirm-description">
          {description || "This action cannot be undone. This will permanently delete the item."}
        </p>
        <div className="delete-confirm-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button 
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-small" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
