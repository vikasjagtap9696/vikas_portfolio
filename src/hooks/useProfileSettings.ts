import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, uploadApi } from "@/services/api"; // Added uploadApi

interface ProfileSettings {
  id: string;
  avatar_url: string | null;
  hero_background_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  about_image_url: string | null;
  hero_name: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_bio: string | null;
  about_intro: string | null;
  about_description: string | null;
  about_education_primary: string | null;
  about_education_secondary: string | null;
  career_goals: string[] | null;
  stat_years_experience: string | null;
  stat_projects_completed: string | null;
  stat_technologies: string | null;
  stat_client_satisfaction: string | null;
  footer_tagline: string | null;
  footer_copyright: string | null;
  footer_location: string | null;
  what_i_do: { title: string; tech: string }[] | null;
}

export function useProfileSettings() {
  return useQuery({
    queryKey: ["profile-settings"],
    queryFn: async () => {
      const response = await profileApi.get();
      // Ensure career_goals and stats are parsed if they come as string from MySQL JSON
      return response.data as ProfileSettings;
    },
  });
}

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      id: string;
      avatar_url?: string | null;
      hero_background_url?: string | null;
      github_url?: string | null;
      linkedin_url?: string | null;
      twitter_url?: string | null;
      email?: string | null;
      about_image_url?: string | null;
      hero_name?: string | null;
      hero_title?: string | null;
      hero_subtitle?: string | null;
      hero_bio?: string | null;
      about_intro?: string | null;
      about_description?: string | null;
      about_education_primary?: string | null;
      about_education_secondary?: string | null;
      career_goals?: string[] | null;
      stat_years_experience?: string | null;
      stat_projects_completed?: string | null;
      stat_technologies?: string | null;
      stat_client_satisfaction?: string | null;
      footer_tagline?: string | null;
      footer_copyright?: string | null;
      footer_location?: string | null;
      what_i_do?: { title: string; tech: string }[] | null;
    }) => {
      await profileApi.update(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-settings"] });
    },
  });
}

export function useUploadHeroBackground() {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadApi.upload(file);
      return response.data.url;
    },
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadApi.upload(file);
      return response.data.url;
    },
  });
}

export function useUploadAboutImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadApi.upload(file);
      return response.data.url;
    },
  });
}
