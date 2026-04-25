/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

const HomeController = () => import('#controllers/home_controller');
const MoviesController = () => import('#controllers/movies_controller');
const TvShowsController = () => import('#controllers/tv_shows_controller');
const DocumentariesController = () => import('#controllers/documentaries_controller');
const TagsController = () => import('#controllers/tags_controller');
const SearchController = () => import('#controllers/search_controller');

router.get('/', [HomeController, 'index']);
router.on('/about').renderInertia('about');
router.get('/documentaries', [DocumentariesController, 'index']);
router.get('/search', [SearchController, 'index']);
router.on('/profile').renderInertia('profile');

router.get('/movies', [MoviesController, 'index']);
router.get('/movies/:slug', [MoviesController, 'show']);
router.get('/tvshows', [TvShowsController, 'index']);
router.get('/shows/:slug', [TvShowsController, 'show']);
router.get('/tag/:slug', [TagsController, 'show']);
