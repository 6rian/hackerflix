const GRID_CLASS = 'results-grid__grid';
const CARD_CLASS = 'results-grid__card';

const grid = document.querySelector(`.${GRID_CLASS}`);
const card = document.querySelector(`.${CARD_CLASS}`);

// Populate the results grid
grid.removeChild(card);
results.forEach(flik => {
  const flikCard = document.createElement('div');
  flikCard.className = CARD_CLASS;

  const poster = document.createElement('div');
  poster.classList.add(`results-grid__card-poster`);
  poster.style.backgroundImage = `url(${flik.poster})`;
  flikCard.appendChild(poster);

  const headline = document.createElement('div');
  headline.classList.add(`results-grid__card-headline`);
  headline.textContent = flik.title;
  flikCard.appendChild(headline);

  grid.appendChild(flikCard);
});
