import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();

    // Subscribe to custom data events (cross-component sync)
    const unsubscribe = dataEvents.subscribe(DATA_EVENTS.PROJECTS_UPDATED, fetchProjects);

    // Subscribe to realtime changes from database
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchProjects]);

  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      toast.success("Project added successfully!");
      dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED); // Notify all subscribers
      return data;
    } catch (error: any) {
      toast.error(error.message || "Error adding project");
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      toast.success("Project updated successfully!");
      dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED); // Notify all subscribers
      return data;
    } catch (error: any) {
      toast.error(error.message || "Error updating project");
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Project deleted successfully!");
      dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED); // Notify all subscribers
    } catch (error: any) {
      toast.error(error.message || "Error deleting project");
      throw error;
    }
  };

  return { projects, loading, addProject, updateProject, deleteProject, refetch: fetchProjects };
}
