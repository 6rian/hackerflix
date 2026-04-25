import { Navigation } from '@/app/components/global/Navigation';
import { Footer } from '@/app/components/global/Footer';
import { MediaListCard } from '@/app/components/global/MediaListCard';
import type { MediaItem } from '@/app/types/media';

interface TaxonomyTemplateProps {
  title: string;
  description: string;
  media: MediaItem[];
}

export function TaxonomyTemplate({ title, description, media }: TaxonomyTemplateProps) {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <main className="relative pt-24 pb-16 md:pt-30 lg:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-hf-mono mb-4 text-4xl font-bold tracking-tight text-[var(--deep-purple)] drop-shadow-[0_0_20px_rgba(0,255,170,0.6)] sm:text-5xl dark:text-[var(--neon-cyan)]">
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {/* Media Grid */}
          {media.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {media.map((item) => (
                <MediaListCard key={item.id} media={item} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="font-hf-mono text-muted-foreground mb-2 text-2xl">NO_CONTENT_FOUND</p>
              <p className="text-muted-foreground text-sm">No media available in this category</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
