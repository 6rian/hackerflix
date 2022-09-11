import './css/main.scss';

import { bindNavButtons } from './components/nav';
import { bindRibbon } from './components/ribbon';

import IndexPage from './pages/index-page';
import FlickPage from './pages/flick-page';

const initPage = (view) => {
  if (view === 'index') {
    IndexPage();
  } else if (view === 'flick') {
    FlickPage();
  }
};

const init = (view = '') => {
  // Initialize global functionality
  window.onload = () => {
    bindNavButtons();
    bindRibbon();
  };

  // Initialize page/view specific functionality
  initPage(view);
};

window.client = {
  init,
};