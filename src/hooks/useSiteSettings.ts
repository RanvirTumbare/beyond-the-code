import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SiteSettings } from '@/lib/types';
import { INITIAL_SITE_SETTINGS } from '@/lib/mockData';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_site_settings');
        if (stored) {
          setSettings(JSON.parse(stored));
        } else {
          setSettings(INITIAL_SITE_SETTINGS);
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setSettings(data as SiteSettings);
      }
    } catch (err: unknown) {
      console.warn('Failed to load site_settings from Supabase, using fallback:', err);
      const stored = localStorage.getItem('btc_site_settings');
      setSettings(stored ? JSON.parse(stored) : INITIAL_SITE_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Apply accent color CSS variable
  useEffect(() => {
    if (settings?.accent_color) {
      document.documentElement.style.setProperty('--accent-color', settings.accent_color);
    }
  }, [settings?.accent_color]);

  const updateSettings = async (updates: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const updated = { ...settings, ...updates, updated_at: new Date().toISOString() };
        setSettings(updated);
        localStorage.setItem('btc_site_settings', JSON.stringify(updated));
        return { success: true };
      }

      let targetId = settings.id;
      if (!targetId || targetId === 'settings-1') {
        const { data: existingRow } = await supabase
          .from('site_settings')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (existingRow?.id) {
          targetId = existingRow.id;
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from('site_settings')
            .insert([updates])
            .select()
            .single();
          if (insertError) throw insertError;
          setSettings(inserted as SiteSettings);
          return { success: true };
        }
      }

      const { data, error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', targetId)
        .select()
        .single();

      if (error) throw error;
      setSettings(data as SiteSettings);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update settings';
      return { success: false, error: msg };
    }
  };

  return { settings, loading, error, updateSettings, refresh: fetchSettings };
}

