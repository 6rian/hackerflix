/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

const MoviesController = () => import('#controllers/movies_controller');
const TvShowsController = () => import('#controllers/tv_shows_controller');
const TagsController = () => import('#controllers/tags_controller');

router.on('/').renderInertia('home');
router.on('/about').renderInertia('about');
router.on('/documentaries').renderInertia('documentaries');
router.on('/search').renderInertia('search');
router.on('/profile').renderInertia('profile');

router.get('/movies', [MoviesController, 'index']);
router.get('/tvshows', [TvShowsController, 'index']);
router.get('/media/:id', async ({ params, inertia }) =>
  inertia.render('media_details', { id: params.id })
);
router.get('/tag/:tag', [TagsController, 'show']);
