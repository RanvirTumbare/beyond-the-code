import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { JourneyEvent } from '@/lib/types';
import { INITIAL_JOURNEY_EVENTS } from '@/lib/mockData';

export function useJourney(includeDrafts = false) {
  const [events, setEvents] = useState<JourneyEvent[]>(INITIAL_JOURNEY_EVENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_journey_events');
        let list: JourneyEvent[] = stored ? JSON.parse(stored) : INITIAL_JOURNEY_EVENTS;
        if (!includeDrafts) {
          list = list.filter((e) => e.status === 'published');
        }
        setEvents(list);
        setLoading(false);
        return;
      }

      let query = supabase.from('journey_events').select('*').order('event_date', { ascending: false });
      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setEvents(data as JourneyEvent[]);
    } catch (err: unknown) {
      console.warn('Failed to load journey events from Supabase, using mock fallback:', err);
      const stored = localStorage.getItem('btc_journey_events');
      let list: JourneyEvent[] = stored ? JSON.parse(stored) : INITIAL_JOURNEY_EVENTS;
      if (!includeDrafts) {
        list = list.filter((e) => e.status === 'published');
      }
      setEvents(list);
    } finally {
      setLoading(false);
    }
  }, [includeDrafts]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const saveEvent = async (
    eventData: Partial<JourneyEvent>,
    eventId?: string
  ): Promise<{ success: boolean; data?: JourneyEvent; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_journey_events');
        let list: JourneyEvent[] = stored ? JSON.parse(stored) : INITIAL_JOURNEY_EVENTS;

        if (eventId) {
          list = list.map((e) =>
            e.id === eventId
              ? ({ ...e, ...eventData, updated_at: new Date().toISOString() } as JourneyEvent)
              : e
          );
        } else {
          const newE: JourneyEvent = {
            id: `je-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            title: eventData.title || 'Untitled Event',
            event_date: eventData.event_date || new Date().toISOString().split('T')[0],
            type: eventData.type || 'Milestone',
            summary: eventData.summary || '',
            content: eventData.content || '',
            cover_image_url: eventData.cover_image_url || null,
            media: eventData.media || [],
            tags: eventData.tags || [],
            featured: eventData.featured ?? false,
            status: eventData.status || 'published',
            project_id: eventData.project_id || null,
          };
          list.unshift(newE);
        }

        localStorage.setItem('btc_journey_events', JSON.stringify(list));
        setEvents(includeDrafts ? list : list.filter((e) => e.status === 'published'));
        return { success: true };
      }

      if (eventId) {
        const { data, error } = await supabase
          .from('journey_events')
          .update(eventData)
          .eq('id', eventId)
          .select()
          .single();
        if (error) throw error;
        setEvents((prev) => prev.map((e) => (e.id === eventId ? (data as JourneyEvent) : e)));
        return { success: true, data: data as JourneyEvent };
      } else {
        const { data, error } = await supabase.from('journey_events').insert([eventData]).select().single();
        if (error) throw error;
        setEvents((prev) => [data as JourneyEvent, ...prev]);
        return { success: true, data: data as JourneyEvent };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save journey event';
      return { success: false, error: msg };
    }
  };

  const deleteEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_journey_events');
        let list: JourneyEvent[] = stored ? JSON.parse(stored) : INITIAL_JOURNEY_EVENTS;
        list = list.filter((e) => e.id !== id);
        localStorage.setItem('btc_journey_events', JSON.stringify(list));
        setEvents(includeDrafts ? list : list.filter((e) => e.status === 'published'));
        return { success: true };
      }

      const { error } = await supabase.from('journey_events').delete().eq('id', id);
      if (error) throw error;
      setEvents((prev) => prev.filter((e) => e.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete journey event';
      return { success: false, error: msg };
    }
  };

  return { events, loading, error, saveEvent, deleteEvent, refresh: fetchEvents };
}
