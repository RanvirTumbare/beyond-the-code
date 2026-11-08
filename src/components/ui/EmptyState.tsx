import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No items found',
  message = 'There are no entries to display at the moment.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[#F7F8F7]/70 border border-dashed border-[#D5DDD8] rounded-editorial my-6 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="font-serif text-lg font-semibold text-[#202520] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#777F79] max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
