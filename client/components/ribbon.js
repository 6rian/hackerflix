/**
 * Show color ribbon on scroll past header
 */
export const bindRibbon = () => {
  window.onscroll = () => {
    const ribbon = document.querySelector('.ribbon');
    const RIBBON_START = 85;
    if (
      document.body.scrolTop >= RIBBON_START ||
      document.documentElement.scrollTop >= RIBBON_START
    ) {
      ribbon.classList.add('sticky');
    } else {
      ribbon.classList.remove('sticky');
    }
  };
};
