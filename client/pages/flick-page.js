import Glide from '@glidejs/glide';

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
  new Glide('.details-section__posters', options).mount();
};

export default async () => {
  initPosters();
};
