const GRID_CLASS = 'results-grid__grid';
const CARD_CLASS = 'results-grid__card';

const grid = document.querySelector(`.${GRID_CLASS}`);
const card = document.querySelector(`.${CARD_CLASS}`);

// Populate the results grid
grid.removeChild(card);
results.forEach(flik => {
  const flikCard = document.createElement('div');
  flikCard.className = CARD_CLASS;
  flikCard.textContent = flik.title;
  grid.appendChild(flikCard);
});
