export interface MediaTag {
  name: string;
  slug: string;
}

export interface MediaItem {
  id: number;
  slug: string;
  mediaType: 'movie' | 'tv';
  title: string;
  type: 'movie' | 'show' | 'documentary';
  year: string;
  rating: number;
  description: string;
  image: string;
  backdrop?: string;
  tags: MediaTag[];
  genres: MediaTag[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  image: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  image: string;
}

export interface MediaDetails extends MediaItem {
  synopsis: string;
  runtime?: string; // For movies/documentaries
  seasons?: number; // For shows
  episodes?: number; // For shows
  status: string;
  budget?: string;
  revenue?: string;
  originalLanguage: string;
  cast: CastMember[];
  crew: CrewMember[];
  videos: { id: number; title: string; type: string; thumbnail: string; url: string }[];
  backdrops: string[];
  posters: string[];
  relatedIds?: number[];
}
