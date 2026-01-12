import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_url: string | null;
  image_url: string | null;
  display_order: number;
}

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('certificates-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certificates' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCertificates(prev => [...prev, payload.new as Certificate].sort((a, b) => a.display_order - b.display_order));
          } else if (payload.eventType === 'UPDATE') {
            setCertificates(prev => prev.map(c => c.id === payload.new.id ? payload.new as Certificate : c));
          } else if (payload.eventType === 'DELETE') {
            setCertificates(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addCertificate = async (certificate: Omit<Certificate, "id">) => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .insert(certificate)
        .select()
        .single();

      if (error) throw error;
      toast.success("Certificate added successfully!");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Error adding certificate");
      throw error;
    }
  };

  const updateCertificate = async (id: string, updates: Partial<Certificate>) => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      toast.success("Certificate updated successfully!");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Error updating certificate");
      throw error;
    }
  };

  const deleteCertificate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Certificate deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error deleting certificate");
      throw error;
    }
  };

  return { certificates, loading, addCertificate, updateCertificate, deleteCertificate, refetch: fetchCertificates };
}
