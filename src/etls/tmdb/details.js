import TMDB from '../../services/tmdb';
import { updateFlick } from '../../services/cache';

const extract = async (tmdbId, tmdbMediaType) => {
  const tmdb = new TMDB();
  let response;

  if (tmdbMediaType === TMDB.MEDIA_TYPES.MOVIE) {
    response = await tmdb.getMovie(tmdbId);
  } else if (tmdbMediaType === TMDB.MEDIA_TYPES.TV) {
    response = await tmdb.getShow(tmdbId);
  }

  return response;
};

const getImageFilePath = (image) => {
  return image.file_path;
};

const getKeywordName = (keyword) => {
  return keyword.name;
};

const transform = (data, type) => {
  const transformed = {
    tmdbId: data.id,
    tmdbMediaType: type,
    hasAllDetails: true,
    overview: data.overview,
    rating: data.vote_average,
    tagline: data.tagline,
    posterImages: data.images.posters ? data.images.posters.map(getImageFilePath) : null,
    backdropImages: data.images.backdrops ? data.images.backdrops.map(getImageFilePath) : null,
    logoImages: data.images.logos ? data.images.logos.map(getImageFilePath) : null,
    videos: data.videos.results ? data.videos.results.map(JSON.stringify) : null,
  };

  if (type === TMDB.MEDIA_TYPES.MOVIE) {
    transformed.title = data.title;
    transformed.imdbId = data.imdb_id;
    transformed.releaseDate = new Date(data.release_date);
    transformed.runtime = data.runtime;
    transformed.cast = data.credits.cast.map(JSON.stringify);
    transformed.crew = data.credits.crew.map(JSON.stringify);
    transformed.tmdbKeywords = data.keywords.keywords.map(getKeywordName);
  } else if (type === TMDB.MEDIA_TYPES.TV) {
    transformed.title = data.name;
    transformed.firstAirDate = new Date(data.first_air_date);
    transformed.lastAirDate = new Date(data.last_air_date);
    transformed.episodeRunTime = data.episode_run_time.length ? data.episode_run_time[0] : null;
    transformed.numberOfEpisodes = data.number_of_episodes;
    transformed.numberOfSeasons = data.number_of_seasons;
    transformed.cast = data.aggregate_credits.cast.map(JSON.stringify);
    transformed.crew = data.aggregate_credits.crew.map(JSON.stringify);
    transformed.tmdbKeywords = data.keywords.results.map(getKeywordName);
  }

  return transformed;
};

const load = async (flickJson) => {
  return await updateFlick(flickJson);
};

export const runDetailsETL = async (tmdbId, tmdbMediaType) => {
  try {
    const detailsResponse = await extract(tmdbId, tmdbMediaType);
    console.log(detailsResponse);
    const transformed = transform(detailsResponse, tmdbMediaType);
    console.log(transformed);
    return await load(transformed);
  } catch (e) {
    throw new Error(`Failed fetching details for ${tmdbMediaType}-${tmdbId}: ${e.message}`);
  }
};
