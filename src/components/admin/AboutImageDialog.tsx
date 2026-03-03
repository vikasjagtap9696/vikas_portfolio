import { Modal } from "./Modal";
import { useProfileSettings, useUpdateProfileSettings } from "@/hooks/useProfileSettings";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner";
import { Image, CheckCircle } from "lucide-react";

interface AboutImageDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AboutImageDialog({ open, onClose }: AboutImageDialogProps) {
  const { data: profile } = useProfileSettings();
  const updateProfile = useUpdateProfileSettings();

  const handlePhotoChange = async (url: string) => {
    if (!profile?.id) return;

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        about_image_url: url,
      });
      toast.success("About image updated!");
    } catch (error) {
      toast.error("Failed to update about image");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="About Section Image" size="md" icon={<Image size={20} />}>
      <div className="admin-form-container">
        <div className="form-group" style={{ textAlign: 'center' }}>
          <label className="form-label-enhanced" style={{ justifyContent: 'center' }}>
            <span className="form-label-icon">🖼️</span>
            Showcase Image
          </label>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <ImageUpload
              value={profile?.about_image_url || ""}
              onChange={handlePhotoChange}
              bucket="images"
              folder="about"
              placeholder="Upload About Image"
            />
          </div>
          <p className="text-muted text-xs" style={{ marginTop: '1rem' }}>
            This image appears next to your biography in the About section.
          </p>
        </div>

        <div className="form-actions-enhanced" style={{ borderTop: 'none', paddingTop: '1rem' }}>
          <button className="btn btn-primary btn-glow" onClick={onClose} style={{ width: '100%' }}>
            <CheckCircle size={16} /> Save & Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
