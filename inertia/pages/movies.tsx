import { usePage } from '@inertiajs/react';
import { TaxonomyTemplate } from '@/app/components/templates/TaxonomyTemplate';
import type { MediaItem } from '@/app/types/media';

export default function Movies() {
  const { media } = usePage<{ media: MediaItem[] }>().props;
  return (
    <TaxonomyTemplate
      title="MOVIES"
      description={`Explore ${media.length} movies in the HackerFlix catalog`}
      media={media}
    />
  );
}
