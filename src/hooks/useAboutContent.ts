import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AboutContent, Skill } from '@/lib/types';
import { INITIAL_ABOUT_CONTENT, INITIAL_SKILLS } from '@/lib/mockData';

export function useAboutContent() {
  const [about, setAbout] = useState<AboutContent>(INITIAL_ABOUT_CONTENT);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const storedAbout = localStorage.getItem('btc_about_content');
        const storedSkills = localStorage.getItem('btc_skills');
        if (storedAbout) setAbout(JSON.parse(storedAbout));
        if (storedSkills) setSkills(JSON.parse(storedSkills));
        setLoading(false);
        return;
      }

      // Fetch about_content
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single();

      if (aboutError && aboutError.code !== 'PGRST116') throw aboutError;
      if (aboutData) setAbout(aboutData as AboutContent);

      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (skillsError) throw skillsError;
      if (skillsData && skillsData.length > 0) {
        setSkills(skillsData as Skill[]);
      }
    } catch (err: unknown) {
      console.warn('Failed to load about data from Supabase, using mock fallback:', err);
      const storedAbout = localStorage.getItem('btc_about_content');
      const storedSkills = localStorage.getItem('btc_skills');
      setAbout(storedAbout ? JSON.parse(storedAbout) : INITIAL_ABOUT_CONTENT);
      setSkills(storedSkills ? JSON.parse(storedSkills) : INITIAL_SKILLS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  const updateAboutContent = async (updates: Partial<AboutContent>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const updated = { ...about, ...updates, updated_at: new Date().toISOString() };
        setAbout(updated);
        localStorage.setItem('btc_about_content', JSON.stringify(updated));
        return { success: true };
      }

      const { data, error } = await supabase
        .from('about_content')
        .update(updates)
        .eq('id', about.id)
        .select()
        .single();

      if (error) throw error;
      setAbout(data as AboutContent);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update about content';
      return { success: false, error: msg };
    }
  };

  const addSkill = async (newSkill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const item: Skill = {
          ...newSkill,
          id: `s-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const updated = [...skills, item];
        setSkills(updated);
        localStorage.setItem('btc_skills', JSON.stringify(updated));
        return { success: true };
      }

      const { data, error } = await supabase.from('skills').insert([newSkill]).select().single();
      if (error) throw error;
      setSkills((prev) => [...prev, data as Skill]);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add skill';
      return { success: false, error: msg };
    }
  };

  const deleteSkill = async (skillId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const updated = skills.filter((s) => s.id !== skillId);
        setSkills(updated);
        localStorage.setItem('btc_skills', JSON.stringify(updated));
        return { success: true };
      }

      const { error } = await supabase.from('skills').delete().eq('id', skillId);
      if (error) throw error;
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete skill';
      return { success: false, error: msg };
    }
  };

  return {
    about,
    skills,
    loading,
    error,
    updateAboutContent,
    addSkill,
    deleteSkill,
    refresh: fetchAboutData,
  };
}

