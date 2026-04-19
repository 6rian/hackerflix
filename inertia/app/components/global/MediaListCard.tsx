import { Link } from '@inertiajs/react';
import { MediaItem } from '@/app/data/mock_data';
import { Calendar, Star } from 'lucide-react';
import { Tag } from '@/app/components/global/Tag';

interface MediaListCardProps {
  media: MediaItem;
}

export function MediaListCard({ media }: MediaListCardProps) {
  return (
    <Link
      href={`/media/${media.id}`}
      className="group bg-card border-border flex flex-col gap-4 rounded-xl border p-4 transition-all duration-300 hover:border-[var(--electric-green)]/40 hover:shadow-[0_0_40px_rgba(0,255,170,0.25)] sm:flex-row"
    >
      {/* Image */}
      <div className="relative h-64 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-auto sm:w-48">
        <img
          src={media.image}
          alt={media.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Type Tag */}
        <div className="absolute top-3 left-3">
          <span className="font-hf-mono rounded bg-[var(--deep-purple)] px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
            {media.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          {/* Title */}
          <h3 className="font-hf-mono mb-2 text-xl font-bold text-[var(--deep-purple)] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,255,170,0.8)] dark:text-[var(--neon-cyan)]">
            {media.title}
          </h3>

          {/* Meta Info */}
          <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{media.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[var(--electric-green)] text-[var(--electric-green)]" />
              <span className="font-medium">{media.rating}</span>
            </div>
          </div>

          {/* Synopsis/Description */}
          <p className="text-foreground/80 mb-4 line-clamp-3 text-sm leading-relaxed">
            {media.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {media.tags.slice(0, 4).map((tag, index) => (
              <Tag key={index} tag={tag} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
