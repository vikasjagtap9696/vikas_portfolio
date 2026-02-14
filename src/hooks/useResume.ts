import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi, uploadApi } from "@/services/api";
import { toast } from "sonner";

export interface ResumeSettings {
  id: string;
  file_url: string | null;
  file_name: string | null;
  updated_at: string;
}

export function useResume() {
  const queryClient = useQueryClient();

  const { data: resumeSettings, isLoading } = useQuery({
    queryKey: ["resume-settings"],
    queryFn: async () => {
      const response = await resumeApi.get();
      return response.data as ResumeSettings | null;
    },
  });

  const uploadResume = useMutation({
    mutationFn: async (file: File) => {
      // 1. Upload file
      const uploadResponse = await uploadApi.upload(file);
      const fileUrl = uploadResponse.data.url;

      // 2. Update resume settings
      await resumeApi.update({
        file_url: fileUrl,
        file_name: file.name
      });

      return fileUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume-settings"] });
      toast.success("Resume uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload failed");
    },
  });

  return {
    resumeSettings,
    isLoading,
    uploadResume,
  };
}
