import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'neutral' | 'draft' | 'published' | 'in-progress' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    neutral:
      'bg-[#F7F8F7] text-[#202520] border border-[#E8ECE9]',
    green:
      'bg-[#EBF3EF] text-[#43866A] border border-[#D1DFD8]',
    published:
      'bg-[#EBF3EF] text-[#2E6B52] border border-[#C5DDD2]',
    draft:
      'bg-[#F5F5F5] text-[#777F79] border border-[#E0E0E0]',
    'in-progress':
      'bg-amber-50 text-amber-800 border border-amber-200/70',
    outline:
      'bg-transparent text-[#585F5A] border border-[#E8ECE9]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-wide transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {variant === 'in-progress' && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
      {children}
    </span>
  );
};
