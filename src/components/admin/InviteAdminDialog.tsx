import { useState } from "react";
import { Modal } from "./Modal";
import { toast } from "sonner";
import { authApi } from "@/services/api";

interface InviteAdminDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InviteAdminDialog({ open, onClose }: InviteAdminDialogProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // NOT IMPLEMENTED YET IN BACKEND
  // I will just mock it or show not implemented toast

  const handleInvite = async () => {
    toast.error("Invite Admin functionality is not yet implemented in this backend version.");
    onClose();
  };

  /*
  const handleInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
       // TODO: API call to invite admin
       // await authApi.inviteAdmin(email);
       toast.success("Admin role granted successfully!");
       setEmail("");
       onClose();

    } catch (error) {
      console.error("Error inviting admin:", error);
      toast.error("Failed to grant admin role");
    } finally {
      setLoading(false);
    }
  };
  */

  return (
    <Modal open={open} onClose={onClose} title="Invite Admin">
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Enter the email address of a registered user to grant them admin access.
      </p>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
        />
      </div>

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleInvite} disabled={loading}>
          {loading ? "Inviting..." : "Grant Admin Access"}
        </button>
      </div>
    </Modal>
  );
}
