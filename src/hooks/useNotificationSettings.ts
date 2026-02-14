import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/services/api";
import { toast } from "sonner";

export interface NotificationSettings {
  id: string;
  notification_email: string;
  send_confirmation_email: boolean;
  updated_at: string;
}

export function useNotificationSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      const response = await notificationsApi.get();
      return response.data as NotificationSettings | null;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (data: { email: string; sendConfirmation: boolean }) => {
      await notificationsApi.update({
        notification_email: data.email,
        send_confirmation_email: data.sendConfirmation
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Settings saved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
}
