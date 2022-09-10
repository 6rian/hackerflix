const GRID_CLASS = 'results-grid__grid';
const CARD_CLASS = 'results-grid__card';
const CARD_POSTER_CLASS = 'results-grid__card-poster';
const CARD_HEADLINE_CLASS = 'results-grid__card-headline';
const LOAD_MORE_BUTTON_CLASS = 'results-grid__load-more-button';
const PAGE_SIZE = 10;

const fetchFlicks = async () => {
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

const renderCard = (flick) => {
  const grid = document.querySelector(`.${GRID_CLASS}`);
  const card = document.createElement('a');
  card.className = CARD_CLASS;
  card.href = `/flick/${flick.slug}`;
  card.title = flick.title;

  const poster = document.createElement('div');
  poster.classList.add(CARD_POSTER_CLASS);
  poster.style.backgroundImage = flick.posterPath
    ? `url(https://image.tmdb.org/t/p/w500${flick.posterPath})`
    : `url(https://dummyimage.com/400x660/fff/aaa)`;
  card.appendChild(poster);

  const headline = document.createElement('div');
  headline.classList.add(CARD_HEADLINE_CLASS);
  headline.textContent = flick.title;
  card.appendChild(headline);

  grid.appendChild(card);
};

const renderBatch = (size = 10) => {
  let current = 0;

  while (current < size) {
    const flick = window.flicks.shift();
    if (!flick) {
      // There are no more flicks to render
      const loadMoreButton = document.querySelector(`.${LOAD_MORE_BUTTON_CLASS}`);
      loadMoreButton.remove();
      break;
    }

    renderCard(flick);
    window.rendered.push(flick);
    current++;
  }
};

const bindLoadMoreButton = () => {
  const button = document.querySelector(`.${LOAD_MORE_BUTTON_CLASS}`);
  button.addEventListener('click', () => renderBatch(PAGE_SIZE));
}

export default async () => {
  try {
    window.flicks = await fetchFlicks();
    window.rendered = [];
    renderBatch(PAGE_SIZE);
    bindLoadMoreButton();
  } catch (e) {
    console.error('Major Failure: Could not load flicks: ', e);
  }
};