import { usePage } from '@inertiajs/react';
import { Navigation } from '@/app/components/global/Navigation';
import { HeroSlider } from '@/app/components/global/HeroSlider';
import { MediaCard } from '@/app/components/global/MediaCard';
import { Footer } from '@/app/components/global/Footer';
import { documentaries } from '@/app/data/mock_data';
import type { MediaItem } from '@/app/types/media';

export default function Home() {
  const { featuredContent, movies, shows } = usePage<{
    featuredContent: MediaItem[];
    movies: MediaItem[];
    shows: MediaItem[];
  }>().props;

  return (
    <div className="bg-background text-foreground relative min-h-screen">
      {/* Background Texture */}
      <div className="bg-noise pointer-events-none fixed inset-0 opacity-[0.015] mix-blend-overlay" />

      <Navigation />

      {/* Hero Section */}
      <HeroSlider items={featuredContent} />

      {/* Content Sections */}
      <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-12 sm:space-y-16 sm:px-6 sm:py-16 lg:px-8">
        {/* Shows Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-hf-mono text-2xl font-bold tracking-tight sm:text-3xl">TV SHOWS</h2>
            <button className="font-hf-mono text-sm font-medium text-[var(--deep-purple)] transition-colors duration-200 hover:text-[var(--primary)]">
              VIEW ALL →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {shows.map((show) => (
              <MediaCard key={show.id} item={show} />
            ))}
          </div>
        </section>

        {/* Movies Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-hf-mono text-2xl font-bold tracking-tight sm:text-3xl">MOVIES</h2>
            <button className="font-hf-mono text-sm font-medium text-[var(--deep-purple)] transition-colors duration-200 hover:text-[var(--primary)]">
              VIEW ALL →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
              <MediaCard key={movie.id} item={movie} />
            ))}
          </div>
        </section>

        {/* Documentaries Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-hf-mono text-2xl font-bold tracking-tight sm:text-3xl">
              DOCUMENTARIES
            </h2>
            <button className="font-hf-mono text-sm font-medium text-[var(--deep-purple)] transition-colors duration-200 hover:text-[var(--primary)]">
              VIEW ALL →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {documentaries.map((doc) => (
              <MediaCard key={doc.id} item={doc} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
