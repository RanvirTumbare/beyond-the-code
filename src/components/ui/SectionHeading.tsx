import React from 'react';

export interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  serif?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  title,
  subtitle,
  align = 'left',
  className = '',
  serif = true,
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col mb-10 md:mb-14 ${alignClasses[align]} ${className}`}>
      {label && (
        <span className="text-xs font-semibold tracking-wider text-[#43866A] uppercase mb-2">
          {label}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl text-[#202520] tracking-tight leading-snug ${
          serif ? 'font-serif font-semibold' : 'font-sans font-bold'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-[#777F79] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="w-12 h-0.5 bg-[#43866A]/30 mt-4 rounded-full" />
    </div>
  );
};

