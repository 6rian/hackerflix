import './css/main.scss';

import { bindNavButtons } from './components/nav';
import { bindRibbon } from './components/ribbon';

import IndexPage from './pages/index-page';

const initPage = (view) => {
  if (view === 'index') {
    IndexPage();
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