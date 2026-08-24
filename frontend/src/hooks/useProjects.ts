import { useState, useEffect, useCallback } from "react";
import { projectsApi } from "@/services/api";
import { toast } from "sonner";
import { dataEvents, DATA_EVENTS } from "@/lib/dataEvents";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  display_order: number;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await projectsApi.getAll();
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    const unsubscribe = dataEvents.subscribe(DATA_EVENTS.PROJECTS_UPDATED, fetchProjects);
    return () => { unsubscribe(); };
  }, [fetchProjects]);

  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const response = await projectsApi.create(project);
      toast.success("Project added successfully!");
      dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED);
      return response.data;
    } catch (error: any) {
      toast.error(error.message || "Error adding project");
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const response = await projectsApi.update(id, updates);
      toast.success("Project updated successfully!");
      dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED);
      return response.data;
    } catch (error: any) {
      toast.error(error.message || "Error updating project");
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsApi.delete(id);
      toast.success("Project deleted successfully!");
      dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED);
    } catch (error: any) {
      toast.error(error.message || "Error deleting project");
      throw error;
    }
  };

  return { projects, loading, addProject, updateProject, deleteProject, refetch: fetchProjects };
}
