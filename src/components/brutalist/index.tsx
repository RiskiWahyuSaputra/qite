'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'blue' | 'coral' | 'white' | 'black';
  size?: 'sm' | 'md' | 'lg';
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({
  children,
  className,
  variant = 'yellow',
  size = 'md',
  ...props
}) => {
  const variantStyles = {
    yellow: 'bg-[#F4FF3F] text-[#171717] hover:bg-[#ebf72a]',
    blue: 'bg-[#3454FF] text-white hover:bg-[#2542e6]',
    coral: 'bg-[#FF6B5E] text-white hover:bg-[#f0584a]',
    white: 'bg-white text-[#171717] hover:bg-neutral-100',
    black: 'bg-[#171717] text-white hover:bg-neutral-800',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base font-black',
  };

  return (
    <button
      className={cn(
        'brutal-btn uppercase tracking-wider select-none flex items-center justify-center gap-2',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const BrutalCard: React.FC<React.HTMLAttributes<HTMLDivElement> & { variant?: 'white' | 'yellow' | 'blue' | 'coral' }> = ({
  children,
  className,
  variant = 'white',
  ...props
}) => {
  const bgStyles = {
    white: 'bg-white',
    yellow: 'bg-[#F4FF3F]',
    blue: 'bg-[#3454FF] text-white',
    coral: 'bg-[#FF6B5E] text-white',
  };

  return (
    <div
      className={cn(
        'brutal-card p-5',
        bgStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const BrutalBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'yellow' | 'blue' | 'coral' | 'black' | 'white';
  className?: string;
}> = ({ children, variant = 'yellow', className }) => {
  const styles = {
    yellow: 'bg-[#F4FF3F] text-[#171717]',
    blue: 'bg-[#3454FF] text-white',
    coral: 'bg-[#FF6B5E] text-white',
    black: 'bg-[#171717] text-white',
    white: 'bg-white text-[#171717]',
  };

  return (
    <span className={cn('brutal-badge', styles[variant], className)}>
      {children}
    </span>
  );
};
