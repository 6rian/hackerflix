import { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Navigation } from '@/app/components/global/Navigation';
import { Footer } from '@/app/components/global/Footer';
import { MediaCard } from '@/app/components/global/MediaCard';
import { shows, movies, documentaries } from '@/app/data/mock_data';
import { ChevronRight } from 'lucide-react';

export default function UserProfile() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      // Redirect to home if not logged in
      router.visit('/');
    } else {
      setUsername(storedUsername);
    }
  }, []);

  if (!username) {
    return null;
  }

  // Mock user data - mix of shows, movies, and documentaries
  const recentlyViewed = [
    shows[0],
    movies[0],
    documentaries[0],
    shows[1],
    movies[1],
    documentaries[1],
    shows[2],
    movies[2],
    documentaries[2],
    shows[3],
  ];

  const favorites = [
    movies[0],
    shows[0],
    movies[1],
    shows[1],
    documentaries[0],
    movies[2],
    shows[2],
    documentaries[1],
    movies[3],
    shows[3],
  ];

  const watchList = [
    shows[2],
    movies[3],
    documentaries[2],
    shows[4],
    movies[4],
    documentaries[0],
    shows[5],
    movies[5],
    shows[0],
    movies[1],
  ];

  const seen = [
    movies[2],
    shows[1],
    documentaries[1],
    movies[0],
    shows[0],
    documentaries[2],
    movies[1],
    shows[2],
    movies[5],
    shows[4],
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <main className="relative pt-24 pb-16 md:pt-30 lg:pt-36">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-16">
            <div className="mb-8 flex items-center gap-6">
              {/* Avatar */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--deep-purple)] to-[var(--primary)] shadow-[0_0_40px_rgba(109,40,217,0.5)]">
                <span className="font-hf-mono text-4xl font-bold text-white">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User Info */}
              <div>
                <h1 className="font-hf-mono mb-2 text-4xl font-bold text-[var(--deep-purple)] drop-shadow-[0_0_20px_rgba(0,255,170,0.6)] dark:text-[var(--neon-cyan)]">
                  {username}
                </h1>
                <p className="text-muted-foreground">
                  Member since{' '}
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-card border-border rounded-xl border p-4 transition-all duration-300 hover:border-[var(--electric-green)]/40">
                <p className="text-muted-foreground mb-1 text-sm">Recently Viewed</p>
                <p className="font-hf-mono text-2xl font-bold text-[var(--neon-cyan)]">
                  {recentlyViewed.length}
                </p>
              </div>
              <div className="bg-card border-border rounded-xl border p-4 transition-all duration-300 hover:border-[var(--electric-green)]/40">
                <p className="text-muted-foreground mb-1 text-sm">Favorites</p>
                <p className="font-hf-mono text-2xl font-bold text-[var(--neon-cyan)]">
                  {favorites.length}
                </p>
              </div>
              <div className="bg-card border-border rounded-xl border p-4 transition-all duration-300 hover:border-[var(--electric-green)]/40">
                <p className="text-muted-foreground mb-1 text-sm">Watch List</p>
                <p className="font-hf-mono text-2xl font-bold text-[var(--neon-cyan)]">
                  {watchList.length}
                </p>
              </div>
              <div className="bg-card border-border rounded-xl border p-4 transition-all duration-300 hover:border-[var(--electric-green)]/40">
                <p className="text-muted-foreground mb-1 text-sm">Seen</p>
                <p className="font-hf-mono text-2xl font-bold text-[var(--neon-cyan)]">
                  {seen.length}
                </p>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-hf-mono text-2xl font-bold text-[var(--deep-purple)] dark:text-white">
                RECENTLY_VIEWED
              </h2>
              <Link
                href="/profile"
                className="group text-muted-foreground flex items-center gap-2 text-sm transition-all duration-300 hover:text-[var(--neon-cyan)]"
              >
                <span className="font-hf-mono">VIEW_ALL</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="-mx-4 overflow-x-auto px-4 pb-4">
              <div className="flex min-w-max gap-4">
                {recentlyViewed.map((item, index) => (
                  <div key={`recent-${item.id}-${index}`} className="w-[180px] flex-shrink-0">
                    <MediaCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Favorites */}
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-hf-mono text-2xl font-bold text-[var(--deep-purple)] dark:text-white">
                FAVORITES
              </h2>
              <Link
                href="/profile"
                className="group text-muted-foreground flex items-center gap-2 text-sm transition-all duration-300 hover:text-[var(--neon-cyan)]"
              >
                <span className="font-hf-mono">VIEW_ALL</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="-mx-4 overflow-x-auto px-4 pb-4">
              <div className="flex min-w-max gap-4">
                {favorites.map((item, index) => (
                  <div key={`favorite-${item.id}-${index}`} className="w-[180px] flex-shrink-0">
                    <MediaCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Watch List */}
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-hf-mono text-2xl font-bold text-[var(--deep-purple)] dark:text-white">
                WATCH_LIST
              </h2>
              <Link
                href="/profile"
                className="group text-muted-foreground flex items-center gap-2 text-sm transition-all duration-300 hover:text-[var(--neon-cyan)]"
              >
                <span className="font-hf-mono">VIEW_ALL</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="-mx-4 overflow-x-auto px-4 pb-4">
              <div className="flex min-w-max gap-4">
                {watchList.map((item, index) => (
                  <div key={`watchlist-${item.id}-${index}`} className="w-[180px] flex-shrink-0">
                    <MediaCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seen */}
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-hf-mono text-2xl font-bold text-[var(--deep-purple)] dark:text-white">
                SEEN
              </h2>
              <Link
                href="/profile"
                className="group text-muted-foreground flex items-center gap-2 text-sm transition-all duration-300 hover:text-[var(--neon-cyan)]"
              >
                <span className="font-hf-mono">VIEW_ALL</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="-mx-4 overflow-x-auto px-4 pb-4">
              <div className="flex min-w-max gap-4">
                {seen.map((item, index) => (
                  <div key={`seen-${item.id}-${index}`} className="w-[180px] flex-shrink-0">
                    <MediaCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
