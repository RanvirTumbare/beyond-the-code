import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg: string) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg: string) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-editorial border shadow-modal transition-all duration-300 animate-fade-up ${
              t.type === 'success'
                ? 'bg-white border-[#D1DFD8] text-[#202520]'
                : t.type === 'error'
                ? 'bg-white border-rose-200 text-[#202520]'
                : 'bg-white border-[#E8ECE9] text-[#202520]'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-[#43866A]" />
              )}
              {t.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              {t.type === 'info' && (
                <Info className="w-4 h-4 text-sky-600" />
              )}
            </div>
            <p className="text-xs font-medium flex-1 text-[#202520] leading-snug">
              {t.message}
            </p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[#777F79] hover:text-[#202520] p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

