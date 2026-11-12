import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ContactMessage } from '@/lib/types';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  return fallback;
}

export function useMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_messages');
        setMessages(stored ? JSON.parse(stored) : []);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMessages(data as ContactMessage[]);
    } catch (err: unknown) {
      console.warn('Failed to fetch contact messages:', err);
      const stored = localStorage.getItem('btc_messages');
      setMessages(stored ? JSON.parse(stored) : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_messages');
        const list: ContactMessage[] = stored ? JSON.parse(stored) : [];
        const newMsg: ContactMessage = {
          id: `msg-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: messageData.name.trim(),
          email: messageData.email.trim(),
          subject: messageData.subject.trim(),
          message: messageData.message.trim(),
          is_read: false,
        };
        list.unshift(newMsg);
        localStorage.setItem('btc_messages', JSON.stringify(list));
        return { success: true };
      }

      const { error } = await supabase.from('contact_messages').insert([
        {
          name: messageData.name.trim(),
          email: messageData.email.trim(),
          subject: messageData.subject.trim(),
          message: messageData.message.trim(),
        },
      ]);

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const raw = extractErrorMessage(err, 'Failed to deliver message');
      const friendly =
        raw.includes('row-level security') || raw.includes('check constraint')
          ? 'Please make sure your message is 5–4000 characters and all fields are valid.'
          : raw;
      return { success: false, error: friendly };
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_messages');
        let list: ContactMessage[] = stored ? JSON.parse(stored) : [];
        list = list.map((m) => (m.id === id ? { ...m, is_read: isRead } : m));
        localStorage.setItem('btc_messages', JSON.stringify(list));
        setMessages(list);
        return { success: true };
      }

      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: isRead })
        .eq('id', id);

      if (error) throw error;
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: isRead } : m)));
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: extractErrorMessage(err, 'Failed to update message status') };
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('btc_messages');
        let list: ContactMessage[] = stored ? JSON.parse(stored) : [];
        list = list.filter((m) => m.id !== id);
        localStorage.setItem('btc_messages', JSON.stringify(list));
        setMessages(list);
        return { success: true };
      }

      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setMessages((prev) => prev.filter((m) => m.id !== id));
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: extractErrorMessage(err, 'Failed to delete message') };
    }
  };

  return {
    messages,
    unreadCount: messages.filter((m) => !m.is_read).length,
    loading,
    error,
    sendMessage,
    markAsRead,
    deleteMessage,
    refresh: fetchMessages,
  };
}

