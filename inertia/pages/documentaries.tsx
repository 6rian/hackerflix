import { TaxonomyTemplate } from '@/app/components/templates/TaxonomyTemplate';
import { documentaries } from '@/app/data/mock_data';

export default function Documentaries() {
  return (
    <TaxonomyTemplate
      title="DOCUMENTARIES"
      description={`Explore ${documentaries.length} documentaries in the HackerFlix catalog`}
      media={documentaries}
    />
  );
}
