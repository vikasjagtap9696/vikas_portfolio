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
      setProjects(
        (data || []).map((p) => ({
          ...p,
          tech_stack: p.tech_stack || [],
          featured: p.featured ?? false,
          display_order: p.display_order ?? 0,
        }))
      );
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
    const { data, error } = await supabase
      .from("projects")
      .insert([project])
      .select()
      .single();

    if (error) { toast.error(error.message); throw error; }
    toast.success("Project added!");
    dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED);
    return data;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) { toast.error(error.message); throw error; }
    toast.success("Project updated!");
    dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED);
    return data;
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) { toast.error(error.message); throw error; }
    toast.success("Project deleted!");
    dataEvents.emit(DATA_EVENTS.PROJECTS_UPDATED);
  };

  return { projects, loading, addProject, updateProject, deleteProject, refetch: fetchProjects };
}
