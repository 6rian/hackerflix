import { fetchFlicks } from '../services/api';

const GRID_WRAPPER_CLASS = 'results-grid';
const GRID_ERROR_CLASS = 'results-grid__error';
const GRID_ERROR_STATE_CLASS = 'results-grid--error';
const GRID_CLASS = 'results-grid__grid';
const CARD_CLASS = 'results-grid__card';
const CARD_POSTER_CLASS = 'results-grid__card-poster';
const CARD_HEADLINE_CLASS = 'results-grid__card-headline';
const LOAD_MORE_BUTTON_CLASS = 'results-grid__load-more-button';
const PAGE_SIZE = 10;

const renderCard = (flick) => {
  const grid = document.querySelector(`.${GRID_CLASS}`);
  const card = document.createElement('a');
  card.className = CARD_CLASS;
  card.href = `/flick/${flick.slug}`;
  card.title = flick.title;
  card.target = '_blank';

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
  if (button) {
    button.addEventListener('click', () => renderBatch(PAGE_SIZE));
  }
};

const showError = (message) => {
  const error = document.querySelector(`.${GRID_ERROR_CLASS}`);
  error.innerText = message;
  const container = document.querySelector(`.${GRID_WRAPPER_CLASS}`);
  container.classList.add(GRID_ERROR_STATE_CLASS);
};

export default async () => {
  try {
    window.flicks = await fetchFlicks();
    window.rendered = [];

    if (!window.flicks.length) {
      showError('We could not find any flicks matching your search.');
    } else {
      renderBatch(PAGE_SIZE);
      bindLoadMoreButton();
    }
  } catch (e) {
    console.error('Major Failure: Could not load flicks: ', e);
  }
};
