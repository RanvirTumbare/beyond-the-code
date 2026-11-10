import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centering Wrapper: min-h-full ensures proper top/bottom clearance on small viewports */}
      <div className="flex min-h-full items-center justify-center p-1 sm:p-2">
        <div
          className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white border border-[#E8ECE9] rounded-editorial shadow-modal z-10 overflow-hidden my-auto max-h-[85vh] flex flex-col animate-fade-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed / shrink-0 so it is NEVER cut off */}
          {(title || showCloseButton) && (
            <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-[#E8ECE9] bg-[#F7F8F7]">
              <div className="pr-2">
                {title && (
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#202520]">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-[#777F79] mt-0.5">{subtitle}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-1 rounded-full text-[#777F79] hover:text-[#202520] hover:bg-white transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content Body - flex-1 min-h-0 and scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
