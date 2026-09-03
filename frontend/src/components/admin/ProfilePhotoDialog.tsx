import { Modal } from "./Modal";
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/useProfileSettings";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner";
import { User, CheckCircle } from "lucide-react";

interface ProfilePhotoDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ProfilePhotoDialog({ open, onClose }: ProfilePhotoDialogProps) {
  const { data: profile } = useProfileSettings();
  const updateProfile = useUpdateProfileSettings();

  const handlePhotoChange = async (url: string) => {
    try {
      await updateProfile.mutateAsync({
        avatar_url: url,
      });
      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error("Failed to update profile photo");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Profile Identity" size="md" icon={<User size={20} />}>
      <div className="admin-form-container">
        <div className="form-group" style={{ textAlign: 'center' }}>
          <label className="form-label-enhanced" style={{ justifyContent: 'center' }}>
            <span className="form-label-icon">📸</span>
            Profile Photo
          </label>
          <div className="profile-photo-upload" style={{ maxWidth: '300px', margin: '0 auto' }}>
            <ImageUpload
              value={profile?.avatar_url || ""}
              onChange={handlePhotoChange}
              bucket="images"
              folder="profile"
              placeholder="Upload Profile Photo"
            />
          </div>
          <p className="text-muted text-xs" style={{ marginTop: '1rem' }}>
            Your profile photo will be displayed in the hero section and footer.
          </p>
        </div>

        <div className="form-actions-enhanced" style={{ borderTop: 'none', paddingTop: '1rem' }}>
          <button className="btn btn-primary btn-glow" onClick={onClose} style={{ width: '100%' }}>
            <CheckCircle size={16} /> Finish
          </button>
        </div>
      </div>
    </Modal>
  );
}
