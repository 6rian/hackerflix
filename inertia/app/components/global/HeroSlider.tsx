import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Tag } from '@/app/components/global/Tag';
import { HeroBackground } from '@/app/components/global/HeroBackground';
import { PrimaryButton } from '@/app/components/global/PrimaryButton';
import { MediaItem } from '@/app/data/mock_data';

interface HeroSliderProps {
  items: MediaItem[];
}

export function HeroSlider({ items }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const currentItem = items[currentIndex];

  return (
    <HeroBackground backgroundImage={currentItem.image} className="mt-16 sm:mt-20 sm:h-[80vh]">
      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {currentItem.tags.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>

          {/* Title */}
          <h2 className="font-hf-mono text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {currentItem.title}
          </h2>

          {/* Description */}
          <p className="text-foreground/90 line-clamp-3 max-w-xl text-base sm:text-lg">
            {currentItem.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
            <PrimaryButton>
              <Play className="h-5 w-5 fill-current" />
              WATCH NOW
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Bottom Center */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 sm:bottom-8">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="bg-background/20 border-foreground/20 rounded-full border p-2 backdrop-blur-sm transition-all duration-300 hover:border-[var(--electric-green)]/50 hover:bg-[var(--deep-purple)]/20 hover:shadow-[0_0_15px_rgba(16,255,170,0.4)]"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-[var(--deep-purple)] shadow-[var(--deep-purple)]/50 shadow-lg'
                  : 'bg-foreground/20 hover:bg-foreground/40 w-4'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="bg-background/20 border-foreground/20 rounded-full border p-2 backdrop-blur-sm transition-all duration-300 hover:border-[var(--electric-green)]/50 hover:bg-[var(--deep-purple)]/20 hover:shadow-[0_0_15px_rgba(16,255,170,0.4)]"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </HeroBackground>
  );
}
