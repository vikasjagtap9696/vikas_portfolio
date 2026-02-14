import { useState, useEffect } from "react";
import { experienceApi } from "@/services/api";
import { toast } from "sonner";

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string | null;
  period: string;
  description: string[];
  technologies: string[];
  is_current: boolean;
  experience_type: string;
  display_order: number;
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = async () => {
    try {
      const response = await experienceApi.getAll();
      setExperiences(response.data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const addExperience = async (experience: Omit<Experience, "id">) => {
    try {
      const response = await experienceApi.create(experience);
      // Refetch to get the latest data including ID
      await fetchExperiences();
      toast.success("Experience added successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.message || "Error adding experience");
      throw error;
    }
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      await experienceApi.update(id, updates);
      await fetchExperiences();
      toast.success("Experience updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error updating experience");
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await experienceApi.delete(id);
      setExperiences(experiences.filter(e => e.id !== id));
      toast.success("Experience deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error deleting experience");
      throw error;
    }
  };

  return { experiences, loading, addExperience, updateExperience, deleteExperience, refetch: fetchExperiences };
}
