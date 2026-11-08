import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DiaryPost } from '@/lib/types';
import { INITIAL_DIARY_POSTS } from '@/lib/mockData';

export function useDiary(includeDrafts = false) {
  const [posts, setPosts] = useState<DiaryPost[]>(INITIAL_DIARY_POSTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_diary_posts');
        let list: DiaryPost[] = stored ? JSON.parse(stored) : INITIAL_DIARY_POSTS;
        if (!includeDrafts) {
          list = list.filter((p) => p.status === 'published');
        }
        setPosts(list);
        setLoading(false);
        return;
      }

      let query = supabase.from('diary_posts').select('*').order('published_at', { ascending: false });
      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setPosts(data as DiaryPost[]);
    } catch (err: unknown) {
      console.warn('Failed to load diary posts from Supabase, using mock fallback:', err);
      const stored = localStorage.getItem('btc_diary_posts');
      let list: DiaryPost[] = stored ? JSON.parse(stored) : INITIAL_DIARY_POSTS;
      if (!includeDrafts) {
        list = list.filter((p) => p.status === 'published');
      }
      setPosts(list);
    } finally {
      setLoading(false);
    }
  }, [includeDrafts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const savePost = async (
    postData: Partial<DiaryPost>,
    postId?: string
  ): Promise<{ success: boolean; data?: DiaryPost; error?: string }> => {
    try {
      // Auto compute reading time if content given (approx 200 words per minute)
      const wordCount = (postData.content || '').split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      const payload = { ...postData, reading_time: postData.reading_time || readingTime };

      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_diary_posts');
        let list: DiaryPost[] = stored ? JSON.parse(stored) : INITIAL_DIARY_POSTS;

        if (postId) {
          list = list.map((p) =>
            p.id === postId
              ? ({ ...p, ...payload, updated_at: new Date().toISOString() } as DiaryPost)
              : p
          );
        } else {
          const newPost: DiaryPost = {
            id: `dp-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            title: payload.title || 'Untitled Post',
            slug: payload.slug || `post-${Date.now()}`,
            category: payload.category || 'Technology',
            cover_image_url: payload.cover_image_url || null,
            excerpt: payload.excerpt || '',
            content: payload.content || '',
            reading_time: readingTime,
            published_at: payload.published_at || new Date().toISOString(),
            status: payload.status || 'published',
            is_future_note: payload.is_future_note ?? false,
            seo_title: payload.seo_title || null,
            seo_description: payload.seo_description || null,
          };
          list.unshift(newPost);
        }

        localStorage.setItem('btc_diary_posts', JSON.stringify(list));
        setPosts(includeDrafts ? list : list.filter((p) => p.status === 'published'));
        return { success: true };
      }

      if (postId) {
        const { data, error } = await supabase
          .from('diary_posts')
          .update(payload)
          .eq('id', postId)
          .select()
          .single();
        if (error) throw error;
        setPosts((prev) => prev.map((p) => (p.id === postId ? (data as DiaryPost) : p)));
        return { success: true, data: data as DiaryPost };
      } else {
        const { data, error } = await supabase.from('diary_posts').insert([payload]).select().single();
        if (error) throw error;
        setPosts((prev) => [data as DiaryPost, ...prev]);
        return { success: true, data: data as DiaryPost };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save diary post';
      return { success: false, error: msg };
    }
  };

  const deletePost = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_diary_posts');
        let list: DiaryPost[] = stored ? JSON.parse(stored) : INITIAL_DIARY_POSTS;
        list = list.filter((p) => p.id !== id);
        localStorage.setItem('btc_diary_posts', JSON.stringify(list));
        setPosts(includeDrafts ? list : list.filter((p) => p.status === 'published'));
        return { success: true };
      }

      const { error } = await supabase.from('diary_posts').delete().eq('id', id);
      if (error) throw error;
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete diary post';
      return { success: false, error: msg };
    }
  };

  return { posts, loading, error, savePost, deletePost, refresh: fetchPosts };
}

export function useDiaryDetail(slug: string) {
  const [post, setPost] = useState<DiaryPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!isSupabaseConfigured) {
          const stored = localStorage.getItem('btc_diary_posts');
          const list: DiaryPost[] = stored ? JSON.parse(stored) : INITIAL_DIARY_POSTS;
          const found = list.find((p) => p.slug === slug);
          setPost(found || null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('diary_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPost(data as DiaryPost);
      } catch (err: unknown) {
        console.warn('Diary detail fetch error, trying local fallback:', err);
        const stored = localStorage.getItem('btc_diary_posts');
        const list: DiaryPost[] = stored ? JSON.parse(stored) : INITIAL_DIARY_POSTS;
        const found = list.find((p) => p.slug === slug);
        setPost(found || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return { post, loading, error };
}

