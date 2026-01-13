import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { dataEvents, DATA_EVENTS } from "@/lib/dataEvents";

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

  const fetchCertificates = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCertificates();

    // Subscribe to custom data events (cross-component sync)
    const unsubscribe = dataEvents.subscribe(DATA_EVENTS.CERTIFICATES_UPDATED, fetchCertificates);

    // Subscribe to realtime changes from database
    const channel = supabase
      .channel('certificates-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certificates' },
        () => {
          fetchCertificates();
        }
      )
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchCertificates]);

  const addCertificate = async (certificate: Omit<Certificate, "id">) => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .insert(certificate)
        .select()
        .single();

      if (error) throw error;
      toast.success("Certificate added successfully!");
      dataEvents.emit(DATA_EVENTS.CERTIFICATES_UPDATED); // Notify all subscribers
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
      dataEvents.emit(DATA_EVENTS.CERTIFICATES_UPDATED); // Notify all subscribers
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
      dataEvents.emit(DATA_EVENTS.CERTIFICATES_UPDATED); // Notify all subscribers
    } catch (error: any) {
      toast.error(error.message || "Error deleting certificate");
      throw error;
    }
  };

  return { certificates, loading, addCertificate, updateCertificate, deleteCertificate, refetch: fetchCertificates };
}
