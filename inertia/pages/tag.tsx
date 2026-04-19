import { usePage } from '@inertiajs/react';
import { TaxonomyTemplate } from '@/app/components/templates/TaxonomyTemplate';
import type { MediaItem } from '@/app/types/media';

export default function TagPage() {
  const { tag, media } = usePage<{ tag: string; media: MediaItem[] }>().props;
  const displayTag = tag ? decodeURIComponent(tag) : 'Unknown';
  return (
    <TaxonomyTemplate
      title={displayTag.toUpperCase()}
      description={`${media.length} titles tagged with "${displayTag}"`}
      media={media}
    />
  );
}
