const renderBackdropUrl = (path) => {
  return path
    ? `https://www.themoviedb.org/t/p/original${path}`
    : `https://images.unsplash.com/photo-1496942299866-9e7ab403e614?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80`;
};

const renderPosterUrl = (path) => {
  return path ? `https://image.tmdb.org/t/p/w400${path}` : `https://dummyimage.com/400x660/fff/aaa`;
};

const renderDate = (datestring) => {
  const date = new Date(datestring);
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return Intl.DateTimeFormat('en-US', options).format(date);
};

const renderYear = (datestring) => {
  const date = new Date(datestring);
  return date.getFullYear();
};

const renderRuntime = (runtime) => {
  if (!runtime || isNaN(runtime)) {
    return 'Unknown';
  }

  const hours = Math.floor(runtime / 60);
  const mins = runtime % 60;
  if (hours) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export default {
  renderBackdropUrl,
  renderDate,
  renderPosterUrl,
  renderRuntime,
  renderYear,
};
