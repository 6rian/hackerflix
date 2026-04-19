import { Play, Star } from 'lucide-react';
import { MediaItem } from '@/app/data/mock_data';
import { Link } from '@inertiajs/react';
import { Tag } from '@/app/components/global/Tag';

interface MediaCardProps {
  item: MediaItem;
}

export function MediaCard({ item }: MediaCardProps) {
  return (
    <Link href={`/media/${item.id}`}>
      <div className="group bg-card border-border relative flex h-full flex-col overflow-hidden rounded-xl border text-base transition-all duration-300 hover:scale-105 hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_40px_rgba(0,255,170,0.4)]">
        {/* Image */}
        <div className="relative aspect-[2/3] flex-shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Hover Overlay with Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button className="rounded-full bg-[var(--deep-purple)] p-4 transition-all duration-300 hover:bg-[var(--primary)] hover:shadow-[0_0_35px_rgba(0,255,170,0.7)]">
              <Play className="h-6 w-6 fill-current text-white" />
            </button>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-[var(--electric-green)] text-[var(--electric-green)]" />
            <span className="font-hf-mono text-xs font-bold text-white">{item.rating}</span>
          </div>

          {/* Tags - Visible on Hover at Bottom of Image */}
          <div className="absolute right-0 bottom-0 left-0 translate-y-2 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex flex-wrap gap-1.5">
              {item.tags.slice(0, 3).map((tag, index) => (
                <Tag key={index} tag={tag} size="sm" variant="overlay" />
              ))}
            </div>
          </div>
        </div>

        {/* Content - Fixed Height */}
        <div className="flex min-h-[5rem] flex-1 flex-col justify-between p-4">
          <h3 className="font-hf-mono neon-link-group mb-2 line-clamp-2 text-sm leading-snug font-bold">
            {item.title}
          </h3>
          <div className="font-hf-mono text-muted-foreground flex items-center gap-2 text-xs">
            <span>{item.year}</span>
            <span>•</span>
            <span className="uppercase">{item.type}</span>
          </div>
        </div>

        {/* Glow effect */}
        <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-xl ring-2 ring-[var(--deep-purple)]/50 blur-sm" />
        </div>
      </div>
    </Link>
  );
}
