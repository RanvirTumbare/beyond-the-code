import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'rect';
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-[#EFF2F0] animate-pulse';

  const variantClasses = {
    text: 'h-4 w-full rounded',
    title: 'h-7 w-2/3 rounded-md',
    avatar: 'w-12 h-12 rounded-full',
    card: 'h-64 w-full rounded-editorial border border-[#E8ECE9]',
    rect: 'w-full h-32 rounded-editorial',
  };

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white border border-[#E8ECE9] rounded-editorial p-6 space-y-4">
    <Skeleton variant="rect" height="180px" />
    <Skeleton variant="title" width="60%" />
    <Skeleton variant="text" width="90%" />
    <Skeleton variant="text" width="75%" />
    <div className="flex gap-2 pt-2">
      <Skeleton width="60px" height="24px" className="rounded-full" />
      <Skeleton width="80px" height="24px" className="rounded-full" />
    </div>
  </div>
);

