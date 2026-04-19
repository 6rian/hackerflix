import { TaxonomyTemplate } from '@/app/components/templates/TaxonomyTemplate';
import { movies } from '@/app/data/mock_data';

export default function Movies() {
  return (
    <TaxonomyTemplate
      title="MOVIES"
      description={`Explore ${movies.length} movies in the HackerFlix catalog`}
      media={movies}
    />
  );
}
