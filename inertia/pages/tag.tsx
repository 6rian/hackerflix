import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { TaxonomyTemplate } from '@/app/components/templates/TaxonomyTemplate';
import { shows, movies, documentaries, MediaItem } from '@/app/data/mock_data';

export default function TagPage() {
  const { tag } = usePage<{ tag: string }>().props;

  const allMedia: MediaItem[] = useMemo(() => {
    return [...movies, ...shows, ...documentaries];
  }, []);

  const filteredMedia = useMemo(() => {
    if (!tag) return [];
    const decodedTag = decodeURIComponent(tag);
    return allMedia.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())
    );
  }, [tag, allMedia]);

  const displayTag = tag ? decodeURIComponent(tag) : 'Unknown';

  return (
    <TaxonomyTemplate
      title={displayTag.toUpperCase()}
      description={`${filteredMedia.length} titles tagged with "${displayTag}"`}
      media={filteredMedia}
    />
  );
}
