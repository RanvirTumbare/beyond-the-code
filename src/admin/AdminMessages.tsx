import React, { useState } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  ExternalLink,
  Reply,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { useMessages } from '@/hooks/useMessages';
import { useToast } from '@/contexts/ToastContext';
import { ContactMessage } from '@/lib/types';

export const AdminMessages: React.FC = () => {
  const { messages, loading, markAsRead, deleteMessage } = useMessages();
  const { success, error: toastError } = useToast();

  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.is_read) {
      await markAsRead(msg.id, true);
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await markAsRead(msg.id, !msg.is_read);
    if (res.success) {
      success(msg.is_read ? 'Marked as unread.' : 'Marked as read.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    const res = await deleteMessage(messageToDelete.id);
    if (res.success) {
      success('Message deleted.');
      if (activeMessage?.id === messageToDelete.id) {
        setActiveMessage(null);
      }
    } else {
      toastError('Failed to delete message.');
    }
    setMessageToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#43866A]">
          Contact Inquiries
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202520]">
          Contact & Messages
        </h1>
        <p className="text-xs sm:text-sm text-[#777F79] mt-1">
          Review visitor inquiries and contact requests sent from the public Contact page.
        </p>
      </div>

      {/* Messages List Card */}
      <div className="bg-white border border-[#E8ECE9] rounded-editorial shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-[#E8ECE9] bg-[#F7F8F7]/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#585F5A] uppercase tracking-wider">
            All Messages ({messages.length})
          </span>
          <span className="text-[#43866A] font-medium">
            {messages.filter((m) => !m.is_read).length} Unread
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-16 text-[#777F79]">
            <Mail className="w-8 h-8 text-[#9CA39E] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#202520]">Your inbox is empty</p>
            <p className="text-xs mt-1">
              New submissions through the contact page will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8ECE9]">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => handleOpenMessage(m)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                  !m.is_read
                    ? 'bg-[#EBF3EF]/20 hover:bg-[#EBF3EF]/40 font-medium'
                    : 'bg-white hover:bg-[#F7F8F7]/60'
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {!m.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#43866A] flex-shrink-0" />
                    )}
                    <h3 className="text-xs sm:text-sm font-semibold text-[#202520] truncate">
                      {m.name}
                    </h3>
                    <span className="text-[11px] text-[#777F79] font-normal truncate">
                      &lt;{m.email}&gt;
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#202520] font-medium truncate">
                    {m.subject}
                  </p>

                  <p className="text-xs text-[#777F79] line-clamp-2 leading-relaxed">
                    {m.message}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between gap-3 text-right">
                  <span className="text-[11px] text-[#9CA39E] font-mono whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(m, e)}
                      title={m.is_read ? 'Mark as unread' : 'Mark as read'}
                      className="p-1 text-[#777F79] hover:text-[#202520] rounded hover:bg-[#EFF2F0]"
                    >
                      {m.is_read ? (
                        <Mail className="w-3.5 h-3.5" />
                      ) : (
                        <MailOpen className="w-3.5 h-3.5 text-[#43866A]" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMessageToDelete(m);
                      }}
                      title="Delete message"
                      className="p-1 text-[#777F79] hover:text-rose-600 rounded hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      <Modal
        isOpen={Boolean(activeMessage)}
        onClose={() => setActiveMessage(null)}
        title={activeMessage?.subject}
        subtitle={`From: ${activeMessage?.name} <${activeMessage?.email}>`}
        maxWidth="lg"
        footer={
          activeMessage && (
            <div className="w-full flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveMessage(null)}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMessageToDelete(activeMessage)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <a
                  href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                    activeMessage.subject
                  )}`}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<Reply className="w-3.5 h-3.5" />}
                  >
                    Reply via Email
                  </Button>
                </a>
              </div>
            </div>
          )
        }
      >
        {activeMessage && (
          <div className="space-y-4">
            <div className="p-3 bg-[#F7F8F7] border border-[#E8ECE9] rounded-editorial flex items-center justify-between text-xs text-[#777F79]">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#43866A]" />
                {new Date(activeMessage.created_at).toLocaleString()}
              </span>
              <span>Direct Website Submission</span>
            </div>

            <div className="text-sm text-[#202520] whitespace-pre-wrap leading-relaxed p-2">
              {activeMessage.message}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(messageToDelete)}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to permanently delete this message?"
      />
    </div>
  );
};

