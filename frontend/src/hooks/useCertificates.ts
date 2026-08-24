import { useState, useEffect, useCallback } from "react";
import { certificatesApi } from "@/services/api";
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
      const response = await certificatesApi.getAll();
      setCertificates(response.data || []);
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

    return () => {
      unsubscribe();
    };
  }, [fetchCertificates]);

  const addCertificate = async (certificate: Omit<Certificate, "id">) => {
    try {
      const response = await certificatesApi.create(certificate);
      toast.success("Certificate added successfully!");
      dataEvents.emit(DATA_EVENTS.CERTIFICATES_UPDATED); // Notify all subscribers
      return response.data;
    } catch (error: any) {
      toast.error(error.message || "Error adding certificate");
      throw error;
    }
  };

  const updateCertificate = async (id: string, updates: Partial<Certificate>) => {
    try {
      const response = await certificatesApi.update(id, updates);
      toast.success("Certificate updated successfully!");
      dataEvents.emit(DATA_EVENTS.CERTIFICATES_UPDATED); // Notify all subscribers
      return response.data;
    } catch (error: any) {
      toast.error(error.message || "Error updating certificate");
      throw error;
    }
  };

  const deleteCertificate = async (id: string) => {
    try {
      await certificatesApi.delete(id);
      toast.success("Certificate deleted successfully!");
      dataEvents.emit(DATA_EVENTS.CERTIFICATES_UPDATED); // Notify all subscribers
    } catch (error: any) {
      toast.error(error.message || "Error deleting certificate");
      throw error;
    }
  };

  return { certificates, loading, addCertificate, updateCertificate, deleteCertificate, refetch: fetchCertificates };
}
