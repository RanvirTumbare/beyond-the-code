import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Certificate } from '@/lib/types';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';

export function useCertificates(includeDrafts = false) {
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_certificates');
        let list: Certificate[] = stored ? JSON.parse(stored) : INITIAL_CERTIFICATES;
        if (!includeDrafts) {
          list = list.filter((c) => c.status === 'published');
        }
        setCertificates(list);
        setLoading(false);
        return;
      }

      let query = supabase.from('certificates').select('*').order('completion_date', { ascending: false, nullsFirst: false });
      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setCertificates(data as Certificate[]);
    } catch (err: unknown) {
      console.warn('Failed to load certificates from Supabase, using mock fallback:', err);
      const stored = localStorage.getItem('btc_certificates');
      let list: Certificate[] = stored ? JSON.parse(stored) : INITIAL_CERTIFICATES;
      if (!includeDrafts) {
        list = list.filter((c) => c.status === 'published');
      }
      setCertificates(list);
    } finally {
      setLoading(false);
    }
  }, [includeDrafts]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const saveCertificate = async (
    certData: Partial<Certificate>,
    certId?: string
  ): Promise<{ success: boolean; data?: Certificate; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_certificates');
        let list: Certificate[] = stored ? JSON.parse(stored) : INITIAL_CERTIFICATES;

        if (certId) {
          list = list.map((c) =>
            c.id === certId
              ? ({ ...c, ...certData, updated_at: new Date().toISOString() } as Certificate)
              : c
          );
        } else {
          const newC: Certificate = {
            id: `cert-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            title: certData.title || 'Untitled Certificate',
            issuer: certData.issuer || 'Issuing Authority',
            completion_date: certData.completion_date || null,
            category: certData.category || 'General',
            skills: certData.skills || [],
            file_url: certData.file_url || null,
            file_type: certData.file_type || 'image',
            verification_url: certData.verification_url || null,
            in_progress: certData.in_progress ?? false,
            status: certData.status || 'published',
          };
          list.push(newC);
        }

        localStorage.setItem('btc_certificates', JSON.stringify(list));
        setCertificates(includeDrafts ? list : list.filter((c) => c.status === 'published'));
        return { success: true };
      }

      if (certId) {
        const { data, error } = await supabase
          .from('certificates')
          .update(certData)
          .eq('id', certId)
          .select()
          .single();
        if (error) throw error;
        setCertificates((prev) => prev.map((c) => (c.id === certId ? (data as Certificate) : c)));
        return { success: true, data: data as Certificate };
      } else {
        const { data, error } = await supabase.from('certificates').insert([certData]).select().single();
        if (error) throw error;
        setCertificates((prev) => [...prev, data as Certificate]);
        return { success: true, data: data as Certificate };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save certificate';
      return { success: false, error: msg };
    }
  };

  const deleteCertificate = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_certificates');
        let list: Certificate[] = stored ? JSON.parse(stored) : INITIAL_CERTIFICATES;
        list = list.filter((c) => c.id !== id);
        localStorage.setItem('btc_certificates', JSON.stringify(list));
        setCertificates(includeDrafts ? list : list.filter((c) => c.status === 'published'));
        return { success: true };
      }

      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw error;
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete certificate';
      return { success: false, error: msg };
    }
  };

  return { certificates, loading, error, saveCertificate, deleteCertificate, refresh: fetchCertificates };
}
