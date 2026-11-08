import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#585F5A]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#777F79] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white text-[#202520] placeholder-[#9CA39E] text-sm border rounded-editorial py-2.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#43866A] focus:border-transparent ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-rose-400 focus:ring-rose-500'
                : 'border-[#E8ECE9] hover:border-[#D5DDD8]'
            } disabled:bg-[#F7F8F7] disabled:text-[#9CA39E] disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#777F79] pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#777F79] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

