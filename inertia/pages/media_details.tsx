import { router, usePage } from '@inertiajs/react';
import {
  Play,
  Star,
  Clock,
  Calendar,
  DollarSign,
  Globe,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Check,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { MediaCard } from '@/app/components/global/MediaCard';
import { Navigation } from '@/app/components/global/Navigation';
import { Footer } from '@/app/components/global/Footer';
import { Tag } from '@/app/components/global/Tag';
import { HeroBackground } from '@/app/components/global/HeroBackground';
import { PrimaryButton } from '@/app/components/global/PrimaryButton';
import type { MediaDetails } from '@/app/types/media';

export default function MediaDetailsPage() {
  const { media } = usePage<{ media: MediaDetails | null }>().props;
  const [activeTab, setActiveTab] = useState<'backdrops' | 'posters' | 'videos'>('backdrops');
  const castScrollRef = useRef<HTMLDivElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInQueue, setIsInQueue] = useState(false);
  const [isSeen, setIsSeen] = useState(false);

  if (!media) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-mono text-3xl font-bold text-[var(--deep-purple)]">404</h1>
          <p className="text-muted-foreground mb-6">Media not found</p>
          <button
            onClick={() => router.visit('/')}
            className="rounded-lg bg-[var(--deep-purple)] px-6 py-3 font-mono text-white transition-all duration-300 hover:bg-[var(--primary)]"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const scrollCast = (direction: 'left' | 'right') => {
    if (castScrollRef.current) {
      const scrollAmount = 300;
      castScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Background Texture */}
      <div className="bg-noise pointer-events-none fixed inset-0 opacity-[0.015] mix-blend-overlay" />

      <Navigation />

      {/* Hero Section */}
      <HeroBackground backgroundImage={media.backdrop || media.image}>
        {/* Hero Content */}
        <div className="relative mx-auto flex h-full max-w-[1400px] items-end px-4 pb-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-hf-mono mb-4 text-4xl font-bold drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
              {media.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm sm:text-base">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--deep-purple)]/20 bg-[var(--deep-purple)]/90 px-3 py-1.5 backdrop-blur-sm dark:border-transparent dark:bg-black/50">
                <Star className="h-4 w-4 fill-[var(--electric-green)] text-[var(--electric-green)]" />
                <span className="font-hf-mono font-bold text-white">{media.rating}</span>
              </div>
              <span className="font-hf-mono text-muted-foreground">{media.year}</span>
              {media.runtime && (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-hf-mono">{media.runtime}</span>
                </div>
              )}
              {media.seasons && (
                <span className="font-hf-mono text-muted-foreground">
                  {media.seasons} Season{media.seasons > 1 ? 's' : ''} • {media.episodes} Episodes
                </span>
              )}
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {media.tags.map((tag, index) => (
                <Tag key={index} name={tag.name} slug={tag.slug} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton>
                <Play className="h-5 w-5 fill-current" />
                PLAY NOW
              </PrimaryButton>

              <button
                className={`rounded-lg p-4 transition-all duration-300 ${
                  isFavorite
                    ? 'bg-[var(--electric-green)] text-black shadow-[0_0_25px_rgba(0,255,170,0.6)] hover:shadow-[0_0_35px_rgba(0,255,170,0.8)]'
                    : 'bg-card/50 border-border border backdrop-blur-sm hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_20px_rgba(0,255,170,0.3)]'
                }`}
                aria-label="Add to favorites"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                className={`rounded-lg p-4 transition-all duration-300 ${
                  isInQueue
                    ? 'bg-[var(--electric-green)] text-black shadow-[0_0_25px_rgba(0,255,170,0.6)] hover:shadow-[0_0_35px_rgba(0,255,170,0.8)]'
                    : 'bg-card/50 border-border border backdrop-blur-sm hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_20px_rgba(0,255,170,0.3)]'
                }`}
                aria-label="Add to queue"
                onClick={() => setIsInQueue(!isInQueue)}
              >
                <Plus className="h-5 w-5" />
              </button>

              <button
                className={`rounded-lg p-4 transition-all duration-300 ${
                  isSeen
                    ? 'bg-[var(--electric-green)] text-black shadow-[0_0_25px_rgba(0,255,170,0.6)] hover:shadow-[0_0_35px_rgba(0,255,170,0.8)]'
                    : 'bg-card/50 border-border border backdrop-blur-sm hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_20px_rgba(0,255,170,0.3)]'
                }`}
                aria-label="Mark as seen"
                onClick={() => setIsSeen(!isSeen)}
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </HeroBackground>

      {/* Main Content */}
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-12 lg:col-span-2">
            {/* Synopsis */}
            <section>
              <h2 className="font-hf-mono mb-4 text-2xl font-bold">SYNOPSIS</h2>
              <p className="text-muted-foreground leading-relaxed">{media.synopsis}</p>
            </section>

            {/* Cast & Crew */}
            {(media.cast.length > 0 || media.crew.length > 0) && (
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-hf-mono text-2xl font-bold">CAST & CREW</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollCast('left')}
                      className="bg-card border-border rounded-lg border p-2 transition-all duration-300 hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_20px_rgba(0,255,170,0.3)]"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => scrollCast('right')}
                      className="bg-card border-border rounded-lg border p-2 transition-all duration-300 hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_20px_rgba(0,255,170,0.3)]"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div
                  ref={castScrollRef}
                  className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {media.cast.map((member) => (
                    <div key={member.id} className="group w-32 flex-shrink-0">
                      <div className="border-border relative mb-3 aspect-square overflow-hidden rounded-xl border transition-all duration-300 group-hover:border-[var(--electric-green)]/40 group-hover:shadow-[0_0_20px_rgba(0,255,170,0.3)]">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="font-hf-mono mb-1 line-clamp-2 text-sm font-bold">
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {member.character}
                      </p>
                    </div>
                  ))}
                  {media.crew.map((member) => (
                    <div key={member.id} className="group w-32 flex-shrink-0">
                      <div className="border-border relative mb-3 aspect-square overflow-hidden rounded-xl border transition-all duration-300 group-hover:border-[var(--electric-green)]/40 group-hover:shadow-[0_0_20px_rgba(0,255,170,0.3)]">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="font-hf-mono mb-1 line-clamp-2 text-sm font-bold">
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 text-xs">{member.job}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Media Tabs */}
            {(media.backdrops.length > 0 ||
              media.posters.length > 0 ||
              media.videos.length > 0) && (
              <section>
                <h2 className="font-hf-mono mb-6 text-2xl font-bold">MEDIA</h2>

                {/* Tabs */}
                <div className="border-border mb-6 flex gap-4 border-b">
                  {(['backdrops', 'posters', 'videos'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`font-hf-mono relative px-1 pb-3 text-sm font-medium transition-all duration-300 ${
                        activeTab === tab
                          ? 'text-[var(--deep-purple)] dark:text-[var(--neon-cyan)]'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.toUpperCase()}
                      {activeTab === tab && (
                        <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-[var(--electric-green)]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {activeTab === 'backdrops' &&
                    media.backdrops.map((backdrop, index) => (
                      <div
                        key={index}
                        className="border-border group relative aspect-video cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_30px_rgba(0,255,170,0.4)]"
                      >
                        <img
                          src={backdrop}
                          alt={`Backdrop ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}

                  {activeTab === 'posters' &&
                    media.posters.map((poster, index) => (
                      <div
                        key={index}
                        className="border-border group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_30px_rgba(0,255,170,0.4)]"
                      >
                        <img
                          src={poster}
                          alt={`Poster ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}

                  {activeTab === 'videos' &&
                    media.videos.map((video) => (
                      <div
                        key={video.id}
                        className="border-border group relative aspect-video cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_30px_rgba(0,255,170,0.4)]"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Play className="h-12 w-12 fill-current text-white" />
                        </div>
                        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="font-hf-mono text-xs font-bold text-white">{video.title}</p>
                          <p className="text-xs text-gray-300">{video.type}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Meta Details */}
          <div className="space-y-6">
            <div className="bg-card border-border relative overflow-hidden rounded-xl border p-6">
              {/* Texture overlay */}
              <div
                className="bg-noise pointer-events-none absolute inset-0 opacity-[0.5]"
                style={{ mixBlendMode: 'color-burn' }}
              />
              {/* Purple tint overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.5]"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, var(--deep-purple), transparent 70%)',
                }}
              />
              {/* Grid pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.85] dark:opacity-[0.85]"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, rgba(138, 92, 246, 0.1) 0px, transparent 1px, transparent 2px, rgba(138, 92, 246, 0.1) 3px), repeating-linear-gradient(90deg, rgba(138, 92, 246, 0.1) 0px, transparent 1px, transparent 2px, rgba(138, 92, 246, 0.1) 3px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Content */}
              <div className="relative">
                <h3 className="font-hf-mono mb-8 text-lg font-bold">DETAILS</h3>

                <div className="space-y-6">
                  {media.status && (
                    <div className="border-border/50 border-b pb-6">
                      <div className="text-muted-foreground mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-hf-mono text-xs tracking-wider uppercase">
                          Status
                        </span>
                      </div>
                      <p className="font-hf-mono text-sm font-medium">{media.status}</p>
                    </div>
                  )}

                  {media.originalLanguage && (
                    <div className="border-border/50 border-b pb-6">
                      <div className="text-muted-foreground mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-hf-mono text-xs tracking-wider uppercase">
                          Language
                        </span>
                      </div>
                      <p className="font-hf-mono text-sm font-medium">{media.originalLanguage}</p>
                    </div>
                  )}

                  {media.budget && (
                    <div className="border-border/50 border-b pb-6">
                      <div className="text-muted-foreground mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-hf-mono text-xs tracking-wider uppercase">
                          Budget
                        </span>
                      </div>
                      <p className="font-hf-mono text-sm font-medium">{media.budget}</p>
                    </div>
                  )}

                  {media.revenue && (
                    <div className="border-border/50 border-b pb-6">
                      <div className="text-muted-foreground mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-hf-mono text-xs tracking-wider uppercase">
                          Revenue
                        </span>
                      </div>
                      <p className="font-hf-mono text-sm font-medium">{media.revenue}</p>
                    </div>
                  )}

                  {media.crew.filter((c) => c.job === 'Director').length > 0 && (
                    <div className="border-border/50 border-b pb-6">
                      <span className="font-hf-mono text-muted-foreground mb-3 block text-xs tracking-wider uppercase">
                        Director
                        {media.crew.filter((c) => c.job === 'Director').length > 1 ? 's' : ''}
                      </span>
                      <div className="space-y-2">
                        {media.crew
                          .filter((c) => c.job === 'Director')
                          .map((member) => (
                            <p key={member.id} className="font-hf-mono text-sm font-medium">
                              {member.name}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}

                  {media.crew.filter((c) => c.job === 'Writer' || c.job === 'Screenplay').length >
                    0 && (
                    <div className="border-border/50 border-b pb-6">
                      <span className="font-hf-mono text-muted-foreground mb-3 block text-xs tracking-wider uppercase">
                        Writer
                        {media.crew.filter((c) => c.job === 'Writer' || c.job === 'Screenplay')
                          .length > 1
                          ? 's'
                          : ''}
                      </span>
                      <div className="space-y-2">
                        {media.crew
                          .filter((c) => c.job === 'Writer' || c.job === 'Screenplay')
                          .map((member) => (
                            <p key={member.id} className="font-hf-mono text-sm font-medium">
                              {member.name}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}

                  {media.crew.filter((c) => c.job === 'Producer' || c.job === 'Creator').length >
                    0 && (
                    <div className="border-border/50 border-b pb-6">
                      <span className="font-hf-mono text-muted-foreground mb-3 block text-xs tracking-wider uppercase">
                        {media.crew.find((c) => c.job === 'Creator') ? 'Creator' : 'Producer'}
                        {media.crew.filter((c) => c.job === 'Producer' || c.job === 'Creator')
                          .length > 1
                          ? 's'
                          : ''}
                      </span>
                      <div className="space-y-2">
                        {media.crew
                          .filter((c) => c.job === 'Producer' || c.job === 'Creator')
                          .map((member) => (
                            <p key={member.id} className="font-hf-mono text-sm font-medium">
                              {member.name}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}

                  {media.tags.length > 0 && (
                    <div className="pt-2">
                      <span className="font-hf-mono text-muted-foreground mb-3 block text-xs tracking-wider uppercase">
                        Tags
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {media.tags.map((tag, index) => (
                          <Tag key={index} name={tag.name} slug={tag.slug} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        {(media.relatedIds ?? []).length > 0 && (
          <section className="mt-16">
            <h2 className="font-hf-mono mb-6 text-2xl font-bold">RELATED CONTENT</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {/* Related content requires backend support — reserved for future use */}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
