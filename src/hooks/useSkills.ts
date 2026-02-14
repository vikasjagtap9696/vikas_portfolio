import { useState, useEffect } from "react";
import { skillsApi } from "@/services/api";
import { toast } from "sonner";

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  display_order: number;
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const response = await skillsApi.getAll();
      setSkills(response.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async (skill: Omit<Skill, "id">) => {
    try {
      const response = await skillsApi.create(skill);
      const newSkill = response.data;
      setSkills([...skills, newSkill]);
      toast.success("Skill added successfully!");
      return newSkill;
    } catch (error: any) {
      toast.error(error.message || "Error adding skill");
      throw error;
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    try {
      await skillsApi.update(id, updates);
      // Optimistic update or refetch. 
      // The API might not return the full updated object if not implemented to do so.
      // But let's assume I can refetch or just merge.
      fetchSkills(); // Refetch for simplicity
      toast.success("Skill updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error updating skill");
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await skillsApi.delete(id);
      setSkills(skills.filter(s => s.id !== id));
      toast.success("Skill deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error deleting skill");
      throw error;
    }
  };

  return { skills, loading, addSkill, updateSkill, deleteSkill, refetch: fetchSkills };
}
