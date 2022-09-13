import Glide from '@glidejs/glide';

const initTopCast = () => {
  const options = {
    type: 'slider',
    rewind: true,
    startAt: 0,
    perView: 5,
    breakpoints: {
      768: {
        perView: 3,
      },
      500: {
        perView: 2,
      },
    },
  };
  new Glide('.glide--topcast', options).mount();
};

const initPosters = () => {
  const options = {
    type: 'slider',
    rewind: true,
    startAt: 0,
    perView: 3,
    breakpoints: {
      768: {
        perView: 2,
      },
      500: {
        perView: 1,
      },
    },
  };
  new Glide('.glide--posters', options).mount();
};

export default async () => {
  try {
    initTopCast();
  } catch (e) {
    console.log('Could not initialize top cast slider');
  }

  try {
    initPosters();
  } catch (e) {
    console.log('Could not initialize posters slider');
  }
};
