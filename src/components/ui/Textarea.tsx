import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full bg-white text-[#202520] placeholder-[#9CA39E] text-sm border rounded-editorial p-3.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#43866A] focus:border-transparent ${
            error
              ? 'border-rose-400 focus:ring-rose-500'
              : 'border-[#E8ECE9] hover:border-[#D5DDD8]'
          } disabled:bg-[#F7F8F7] disabled:text-[#9CA39E] disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#777F79] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

