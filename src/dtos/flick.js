export const getFlickDTO = (flick) => ({
  title: flick.title,
  slug: flick.slug,
  mediaType: flick.mediaType,
  tmdbMediaType: flick.tmdbMediaType,
  tmdbId: flick.tmdbId,
  overview: flick.overview,
  rating: flick.rating,
  posterPath: flick.posterPath,
  backdropPath: flick.backdropPath,
  releaseDate: flick.releaseDate,
  homepage: flick.homepage,
  runtime: flick.runtime,
  tagline: flick.tagline,
  firstAirDate: flick.firstAirDate,
  lastAirDate: flick.lastAirDate,
  episodeRunTime: flick.episodeRunTime,
  numberOfEpisodes: flick.numberOfEpisodes,
  numberOfSeasons: flick.numberOfSeasons,
  backdropImages: flick.backdropImages,
  posterImages: flick.posterImages,
  tmdbKeywords: flick.tmdbKeywords,
  cast: flick.cast ? flick.cast.map(JSON.parse) : null,
  crew: flick.crew ? flick.crew.map(JSON.parse) : null,
  videos: flick.videos ? flick.videos.map(JSON.parse) : null,
});

export const getFlicksResponseDTO = (flicks) => ({
  data: flicks.map(getFlickDTO),
  count: flicks.length,
});

export const getFlickResponseDTO = (flick) => ({
  data: getFlickDTO(flick),
});
