import { usePage } from '@inertiajs/react';
import { TaxonomyTemplate } from '@/app/components/templates/TaxonomyTemplate';
import type { MediaItem } from '@/app/types/media';

export default function TvShows() {
  const { media } = usePage<{ media: MediaItem[] }>().props;
  return (
    <TaxonomyTemplate
      title="TV_SHOWS"
      description={`Explore ${media.length} shows in the HackerFlix catalog`}
      media={media}
    />
  );
}
