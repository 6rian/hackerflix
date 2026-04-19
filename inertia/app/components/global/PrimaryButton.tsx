import { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-hf-mono flex items-center justify-center gap-3 rounded-lg bg-[var(--deep-purple)] px-6 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[var(--deep-purple)]/80 hover:shadow-[0_0_35px_rgba(0,255,170,0.7)] sm:px-8 sm:py-4 ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
