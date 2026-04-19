import { TaxonomyTemplate } from '@/app/components/templates/TaxonomyTemplate';
import { shows } from '@/app/data/mock_data';

export default function TVShows() {
  return (
    <TaxonomyTemplate
      title="TV_SHOWS"
      description={`Explore ${shows.length} TV shows in the HackerFlix catalog`}
      media={shows}
    />
  );
}
