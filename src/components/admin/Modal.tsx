import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  icon?: ReactNode;
}

export function Modal({ open, onClose, title, children, size = "md", icon }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!open) return null;

  const sizeClasses = {
    sm: "modal-sm",
    md: "modal-md",
    lg: "modal-lg",
    xl: "modal-xl",
  };

  return createPortal(
    <div 
      className={`modal-overlay-enhanced ${isClosing ? 'closing' : ''}`} 
      onClick={handleClose}
    >
      <div 
        className={`modal-content-enhanced ${sizeClasses[size]} ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="modal-glow-orb modal-glow-orb-1" />
        <div className="modal-glow-orb modal-glow-orb-2" />
        
        <div className="modal-header-enhanced">
          <div className="modal-title-wrapper">
            {icon ? (
              <span className="modal-icon">{icon}</span>
            ) : (
              <span className="modal-icon">
                <Sparkles size={20} />
              </span>
            )}
            <h3 className="modal-title-enhanced">{title}</h3>
          </div>
          <button className="modal-close-enhanced" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body-enhanced">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
