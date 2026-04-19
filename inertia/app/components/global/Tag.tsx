import { Link } from '@inertiajs/react';

interface TagProps {
  tag: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'overlay';
}

export function Tag({ tag, size = 'md', variant = 'default' }: TagProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  // Overlay variant: white text (for dark backgrounds like media card hover)
  // Default variant: deep purple text in light mode, light purple in dark mode
  const colorClasses =
    variant === 'overlay'
      ? 'bg-[var(--deep-purple)]/30 dark:bg-[var(--deep-purple)]/20 text-white dark:text-[#b8a4ff] border border-[var(--deep-purple)]/50 dark:border-[var(--deep-purple)]/30 hover:bg-[var(--deep-purple)]/40 dark:hover:bg-[var(--deep-purple)]/30 hover:border-[var(--deep-purple)]/70 dark:hover:border-[var(--deep-purple)]/50'
      : 'bg-[var(--deep-purple)]/20 dark:bg-[var(--deep-purple)]/20 text-[var(--deep-purple)] dark:text-[#b8a4ff] border border-[var(--deep-purple)]/40 dark:border-[var(--deep-purple)]/30 hover:bg-[var(--deep-purple)]/30 dark:hover:bg-[var(--deep-purple)]/30 hover:border-[var(--deep-purple)]/60 dark:hover:border-[var(--deep-purple)]/50';

  return (
    <Link
      href={`/tag/${encodeURIComponent(tag)}`}
      className={`font-hf-mono inline-block ${sizeClasses} ${colorClasses} rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(184,164,255,0.3)]`}
    >
      {tag}
    </Link>
  );
}
