import TMDB from '../services/tmdb';
import config from 'config';

// TODO: move these to TMDB class?
const TMDB_MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
};

const transformListResponse = (item) => {
  const transformed = {
    hasAllDetails: false,
    tmdbId: item.id,
    mediaType: item.media_type,
    overview: item.overview,
    rating: item.vote_average,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
  };

  if (item.media_type === TMDB_MEDIA_TYPES.MOVIE) {
    transformed.title = item.title;
    transformed.releaseDate = item.release_date;
  } else if (item.media_type === TMDB_MEDIA_TYPES.TV) {
    transformed.title = item.name;
    transformed.firstAirDate = item.first_air_date;
  }

  return transformed;
};

export const bootstrap = async () => {
  const tmdb = new TMDB();
  const list = await tmdb.getList(config.get('tmdb.list_id'));
  console.log(list);
  const transformed = list.items.map(transformListResponse);
  console.log(transformed);

  // NEXT
  // store date fields as new Date(item.release_date)
  // store each in Redis by creating a Flick();
};
