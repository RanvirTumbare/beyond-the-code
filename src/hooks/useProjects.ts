import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Project } from '@/lib/types';
import { INITIAL_PROJECTS } from '@/lib/mockData';

export function useProjects(includeDrafts = false) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_projects');
        let list: Project[] = stored ? JSON.parse(stored) : INITIAL_PROJECTS;
        if (!includeDrafts) {
          list = list.filter((p) => p.status === 'published');
        }
        setProjects(list);
        setLoading(false);
        return;
      }

      let query = supabase.from('projects').select('*').order('sort_order', { ascending: true });
      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setProjects(data as Project[]);
    } catch (err: unknown) {
      console.warn('Failed to load projects from Supabase, using mock fallback:', err);
      const stored = localStorage.getItem('btc_projects');
      let list: Project[] = stored ? JSON.parse(stored) : INITIAL_PROJECTS;
      if (!includeDrafts) {
        list = list.filter((p) => p.status === 'published');
      }
      setProjects(list);
    } finally {
      setLoading(false);
    }
  }, [includeDrafts]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const saveProject = async (
    projectData: Partial<Project>,
    projectId?: string
  ): Promise<{ success: boolean; data?: Project; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_projects');
        let list: Project[] = stored ? JSON.parse(stored) : INITIAL_PROJECTS;

        if (projectId) {
          list = list.map((p) =>
            p.id === projectId
              ? ({ ...p, ...projectData, updated_at: new Date().toISOString() } as Project)
              : p
          );
        } else {
          const newP: Project = {
            id: `p-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            title: projectData.title || 'Untitled Project',
            slug: projectData.slug || `project-${Date.now()}`,
            category: projectData.category || 'Other',
            summary: projectData.summary || '',
            cover_image_url: projectData.cover_image_url || null,
            problem: projectData.problem || '',
            why_selected: projectData.why_selected || '',
            solution: projectData.solution || '',
            tech_stack: projectData.tech_stack || [],
            features: projectData.features || '',
            screenshots: projectData.screenshots || [],
            team: projectData.team || [],
            my_contribution: projectData.my_contribution || '',
            challenges: projectData.challenges || '',
            learnings: projectData.learnings || '',
            demo_video_url: projectData.demo_video_url || null,
            github_url: projectData.github_url || null,
            live_url: projectData.live_url || null,
            featured: projectData.featured ?? false,
            status: projectData.status || 'published',
            sort_order: projectData.sort_order ?? list.length + 1,
            seo_title: projectData.seo_title || null,
            seo_description: projectData.seo_description || null,
          };
          list.push(newP);
        }

        localStorage.setItem('btc_projects', JSON.stringify(list));
        setProjects(includeDrafts ? list : list.filter((p) => p.status === 'published'));
        return { success: true };
      }

      if (projectId) {
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId)
          .select()
          .single();
        if (error) throw error;
        setProjects((prev) => prev.map((p) => (p.id === projectId ? (data as Project) : p)));
        return { success: true, data: data as Project };
      } else {
        const { data, error } = await supabase.from('projects').insert([projectData]).select().single();
        if (error) throw error;
        setProjects((prev) => [...prev, data as Project]);
        return { success: true, data: data as Project };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project';
      return { success: false, error: msg };
    }
  };

  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_projects');
        let list: Project[] = stored ? JSON.parse(stored) : INITIAL_PROJECTS;
        list = list.filter((p) => p.id !== id);
        localStorage.setItem('btc_projects', JSON.stringify(list));
        setProjects(includeDrafts ? list : list.filter((p) => p.status === 'published'));
        return { success: true };
      }

      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete project';
      return { success: false, error: msg };
    }
  };

  return { projects, loading, error, saveProject, deleteProject, refresh: fetchProjects };
}

export function useProjectDetail(slug: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!isSupabaseConfigured) {
          const stored = localStorage.getItem('btc_projects');
          const list: Project[] = stored ? JSON.parse(stored) : INITIAL_PROJECTS;
          const found = list.find((p) => p.slug === slug);
          setProject(found || null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setProject(data as Project);
      } catch (err: unknown) {
        console.warn('Project detail fetch error, trying local fallback:', err);
        const stored = localStorage.getItem('btc_projects');
        const list: Project[] = stored ? JSON.parse(stored) : INITIAL_PROJECTS;
        const found = list.find((p) => p.slug === slug);
        setProject(found || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return { project, loading, error };
}
