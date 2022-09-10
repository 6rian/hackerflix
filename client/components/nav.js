/**
 * Bind nav menu controls to page elements
 */
export const bindNavButtons = () => {
  const navOpenButton = document.querySelector('.open-nav-button');
  navOpenButton.addEventListener('click', function () {
    document.getElementById('nav-menu').style.height = '100%';
  });

  const navCloseButton = document.querySelector('.nav-menu__close');
  navCloseButton.addEventListener('click', function () {
    document.getElementById('nav-menu').style.height = '0%';
  });
};
