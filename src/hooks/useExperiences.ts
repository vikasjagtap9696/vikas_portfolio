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

// Map from DB format (type) to frontend format (experience_type)
function mapFromApi(item: any): Experience {
  return {
    ...item,
    experience_type: item.experience_type || item.type || "job",
    description: typeof item.description === "string" ? JSON.parse(item.description) : (item.description || []),
    technologies: typeof item.technologies === "string" ? JSON.parse(item.technologies) : (item.technologies || []),
    is_current: Boolean(item.is_current),
  };
}

// Map from frontend format to DB format (type instead of experience_type)
function mapToApi(data: any) {
  const { experience_type, ...rest } = data;
  return { ...rest, type: experience_type || "job" };
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = async () => {
    try {
      const response = await experienceApi.getAll();
      const raw = response.data || [];
      setExperiences(raw.map(mapFromApi));
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
      await experienceApi.create(mapToApi(experience));
      await fetchExperiences();
      toast.success("Experience added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error adding experience");
      throw error;
    }
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      await experienceApi.update(id, mapToApi(updates));
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
