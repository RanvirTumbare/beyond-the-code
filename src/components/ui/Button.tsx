import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: editorial restraint, focus ring, subtle transition
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-editorial transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#43866A] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-base px-6 py-2.5 gap-2.5 h-12',
    };

    const variantStyles = {
      primary:
        'bg-[#202520] text-white hover:bg-[#141814] active:bg-[#000000] shadow-sm',
      secondary:
        'bg-[#F7F8F7] text-[#202520] border border-[#E8ECE9] hover:bg-[#EFF2F0] hover:border-[#D5DDD8]',
      outline:
        'bg-transparent text-[#202520] border border-[#E8ECE9] hover:border-[#43866A] hover:text-[#43866A] hover:bg-[#F4F8F5]',
      text:
        'bg-transparent text-[#202520] hover:text-[#43866A] hover:bg-[#F4F8F5] px-2.5',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
