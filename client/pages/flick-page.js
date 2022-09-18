import Glide from '@glidejs/glide';

const GLOBAL_GLIDE_OPTIONS = {
  type: 'slider',
  rewind: 'true',
  startAt: 0,
  perTouch: 1,
  keyboard: false,
  bound: true,
};

const initTopCast = () => {
  const options = {
    ...GLOBAL_GLIDE_OPTIONS,
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
    ...GLOBAL_GLIDE_OPTIONS,
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
