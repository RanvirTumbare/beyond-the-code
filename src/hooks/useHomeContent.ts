import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { HomeContent, ExploreCard } from '@/lib/types';
import { INITIAL_HOME_CONTENT, INITIAL_EXPLORE_CARDS } from '@/lib/mockData';

export function useHomeContent() {
  const [content, setContent] = useState<HomeContent>(INITIAL_HOME_CONTENT);
  const [exploreCards, setExploreCards] = useState<ExploreCard[]>(INITIAL_EXPLORE_CARDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const storedContent = localStorage.getItem('btc_home_content');
        const storedCards = localStorage.getItem('btc_explore_cards');
        if (storedContent) setContent(JSON.parse(storedContent));
        if (storedCards) setExploreCards(JSON.parse(storedCards));
        setLoading(false);
        return;
      }

      // Fetch home_content
      const { data: homeData, error: homeError } = await supabase
        .from('home_content')
        .select('*')
        .limit(1)
        .single();

      if (homeError && homeError.code !== 'PGRST116') {
        throw homeError;
      }
      if (homeData) {
        setContent(homeData as HomeContent);
      }

      // Fetch explore_cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('explore_cards')
        .select('*')
        .order('sort_order', { ascending: true });

      if (cardsError) throw cardsError;
      if (cardsData && cardsData.length > 0) {
        setExploreCards(cardsData as ExploreCard[]);
      }
    } catch (err: unknown) {
      console.warn('Failed to load home data from Supabase, using mock fallback:', err);
      const storedContent = localStorage.getItem('btc_home_content');
      const storedCards = localStorage.getItem('btc_explore_cards');
      setContent(storedContent ? JSON.parse(storedContent) : INITIAL_HOME_CONTENT);
      setExploreCards(storedCards ? JSON.parse(storedCards) : INITIAL_EXPLORE_CARDS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const updateHomeContent = async (updates: Partial<HomeContent>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const updated = { ...content, ...updates, updated_at: new Date().toISOString() };
        setContent(updated);
        localStorage.setItem('btc_home_content', JSON.stringify(updated));
        return { success: true };
      }

      const { data, error } = await supabase
        .from('home_content')
        .update(updates)
        .eq('id', content.id)
        .select()
        .single();

      if (error) throw error;
      setContent(data as HomeContent);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update homepage content';
      return { success: false, error: msg };
    }
  };

  const updateExploreCard = async (
    cardId: string,
    updates: Partial<ExploreCard>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const updated = exploreCards.map((c) =>
          c.id === cardId ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
        );
        setExploreCards(updated);
        localStorage.setItem('btc_explore_cards', JSON.stringify(updated));
        return { success: true };
      }

      const { data, error } = await supabase
        .from('explore_cards')
        .update(updates)
        .eq('id', cardId)
        .select()
        .single();

      if (error) throw error;
      setExploreCards((prev) => prev.map((c) => (c.id === cardId ? (data as ExploreCard) : c)));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update card';
      return { success: false, error: msg };
    }
  };

  const reorderExploreCards = async (newCards: ExploreCard[]) => {
    try {
      const ordered = newCards.map((c, idx) => ({ ...c, sort_order: idx + 1 }));
      setExploreCards(ordered);

      if (!isSupabaseConfigured) {
        localStorage.setItem('btc_explore_cards', JSON.stringify(ordered));
        return { success: true };
      }

      // Upsert order in DB
      for (const card of ordered) {
        await supabase.from('explore_cards').update({ sort_order: card.sort_order }).eq('id', card.id);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reorder cards';
      return { success: false, error: msg };
    }
  };

  return {
    content,
    exploreCards,
    loading,
    error,
    updateHomeContent,
    updateExploreCard,
    reorderExploreCards,
    refresh: fetchHomeData,
  };
}
