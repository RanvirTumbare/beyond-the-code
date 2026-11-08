import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { GalleryItem } from '@/lib/types';
import { INITIAL_GALLERY_ITEMS } from '@/lib/mockData';

export function useGallery(includeDrafts = false) {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_gallery_items');
        let list: GalleryItem[] = stored ? JSON.parse(stored) : INITIAL_GALLERY_ITEMS;
        if (!includeDrafts) {
          list = list.filter((i) => i.status === 'published');
        }
        setItems(list);
        setLoading(false);
        return;
      }

      let query = supabase.from('gallery_items').select('*').order('sort_order', { ascending: true });
      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setItems(data as GalleryItem[]);
    } catch (err: unknown) {
      console.warn('Failed to load gallery items from Supabase, using mock fallback:', err);
      const stored = localStorage.getItem('btc_gallery_items');
      let list: GalleryItem[] = stored ? JSON.parse(stored) : INITIAL_GALLERY_ITEMS;
      if (!includeDrafts) {
        list = list.filter((i) => i.status === 'published');
      }
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, [includeDrafts]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const saveItem = async (
    itemData: Partial<GalleryItem>,
    itemId?: string
  ): Promise<{ success: boolean; data?: GalleryItem; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_gallery_items');
        let list: GalleryItem[] = stored ? JSON.parse(stored) : INITIAL_GALLERY_ITEMS;

        if (itemId) {
          list = list.map((i) =>
            i.id === itemId ? ({ ...i, ...itemData, updated_at: new Date().toISOString() } as GalleryItem) : i
          );
        } else {
          const newItem: GalleryItem = {
            id: `g-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            caption: itemData.caption || 'Untitled photo',
            album: itemData.album || 'General',
            category: itemData.category || 'Personal',
            event_name: itemData.event_name || '',
            event_date: itemData.event_date || new Date().toISOString().split('T')[0],
            media_url: itemData.media_url || '',
            media_type: itemData.media_type || 'image',
            video_embed_url: itemData.video_embed_url || null,
            sort_order: itemData.sort_order ?? list.length + 1,
            status: itemData.status || 'published',
          };
          list.push(newItem);
        }

        localStorage.setItem('btc_gallery_items', JSON.stringify(list));
        setItems(includeDrafts ? list : list.filter((i) => i.status === 'published'));
        return { success: true };
      }

      if (itemId) {
        const { data, error } = await supabase
          .from('gallery_items')
          .update(itemData)
          .eq('id', itemId)
          .select()
          .single();
        if (error) throw error;
        setItems((prev) => prev.map((i) => (i.id === itemId ? (data as GalleryItem) : i)));
        return { success: true, data: data as GalleryItem };
      } else {
        const { data, error } = await supabase.from('gallery_items').insert([itemData]).select().single();
        if (error) throw error;
        setItems((prev) => [...prev, data as GalleryItem]);
        return { success: true, data: data as GalleryItem };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save gallery item';
      return { success: false, error: msg };
    }
  };

  const deleteItem = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_gallery_items');
        let list: GalleryItem[] = stored ? JSON.parse(stored) : INITIAL_GALLERY_ITEMS;
        list = list.filter((i) => i.id !== id);
        localStorage.setItem('btc_gallery_items', JSON.stringify(list));
        setItems(includeDrafts ? list : list.filter((i) => i.status === 'published'));
        return { success: true };
      }

      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete gallery item';
      return { success: false, error: msg };
    }
  };

  return { items, loading, error, saveItem, deleteItem, refresh: fetchGallery };
}
