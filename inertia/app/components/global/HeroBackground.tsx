import { ReactNode } from 'react';

interface HeroBackgroundProps {
  backgroundImage: string;
  children: ReactNode;
  className?: string;
}

export function HeroBackground({ backgroundImage, children, className = '' }: HeroBackgroundProps) {
  return (
    <div className={`relative h-[70vh] overflow-hidden ${className}`}>
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="" className="h-full w-full object-cover" />
        {/* Consistent gradient overlays for light/dark mode visibility */}
        <div className="from-background/60 via-background/40 dark:from-background dark:via-background/70 absolute inset-0 bg-gradient-to-r to-transparent dark:to-transparent" />
        <div className="from-background/80 dark:from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent dark:via-transparent dark:to-transparent" />
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
