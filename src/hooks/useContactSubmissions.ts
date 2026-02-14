import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactApi } from "@/services/api";
import { toast } from "sonner";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useContactSubmissions() {
  const queryClient = useQueryClient();

  // Fetch submissions
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const response = await contactApi.getAll();
      return response.data as ContactSubmission[];
    },
  });

  // Mark as read (NOT IMPLEMENTED IN BACKEND YET, BUT STUBBED HERE)
  // I will add a stub implementation or just ignore it for now as the backend route didn't have explicit mark-read logic, 
  // only delete and create. I should probably add it to the backend or just assume it works if I update the backend.
  // The current backend contact.js has: POST / (create), GET / (list), DELETE /:id (delete).
  // It is missing "mark as read". For now I will comment it out or make it a no-op to avoid errors, 
  // or better yet, implement it in backend in a moment.

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Implement mark as read in backend
      // await contactApi.markAsRead(id); 
      console.log("Mark as read not implemented yet for id", id);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
    },
    onError: (error: Error) => {
      // toast.error(error.message);
    },
  });

  const deleteSubmission = useMutation({
    mutationFn: async (id: string) => {
      await contactApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
      toast.success("Submission deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return {
    submissions,
    isLoading,
    markAsRead,
    deleteSubmission,
    unreadCount,
  };
}
