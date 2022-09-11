export const fetchFlicks = async () => {
  let url;
  const API_ENDPOINT = '/api/flick';
  const mediaTypeFilter = window.viewLocals.mediaType || '';

  url = API_ENDPOINT;
  if (mediaTypeFilter) {
    url = `${API_ENDPOINT}?type=${mediaTypeFilter}`;
  }

  const data = await fetch(url);
  const { data: flicks } = await data.json();

  return flicks;
};

export const fetchFlick = async (slug) => {
  const url = `/api/flick/${slug}`;
  const response = await fetch(url);
  return await response.json();
};
