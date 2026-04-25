import { usePage } from '@inertiajs/react';
import { TaxonomyTemplate } from '@/app/components/templates/TaxonomyTemplate';
import type { MediaItem } from '@/app/types/media';

export default function Documentaries() {
  const { media } = usePage<{ media: MediaItem[] }>().props;

  return (
    <TaxonomyTemplate
      title="DOCUMENTARIES"
      description={`Explore ${media.length} documentaries in the HackerFlix catalog`}
      media={media}
    />
  );
}
