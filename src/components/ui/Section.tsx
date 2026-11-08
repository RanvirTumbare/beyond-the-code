import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  containerSize?: 'default' | 'narrow' | 'wide' | 'full';
  background?: 'white' | 'secondary';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  size = 'md',
  containerSize = 'default',
  background = 'white',
  className = '',
  id,
  ...props
}) => {
  const sizeStyles = {
    sm: 'py-10 md:py-14',
    md: 'py-14 md:py-20',
    lg: 'py-20 md:py-28',
    xl: 'py-24 md:py-36',
  };

  const containerWidths = {
    narrow: 'max-w-reading',
    default: 'max-w-editorial',
    wide: 'max-w-6xl',
    full: 'max-w-none',
  };

  const bgStyles = {
    white: 'bg-white',
    secondary: 'bg-[#F7F8F7]',
  };

  return (
    <section
      id={id}
      className={`w-full ${bgStyles[background]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <div className={`mx-auto px-4 sm:px-6 md:px-8 ${containerWidths[containerSize]}`}>
        {children}
      </div>
    </section>
  );
};

