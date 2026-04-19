/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

router.on('/').renderInertia('home');
router.on('/about').renderInertia('about');
router.on('/movies').renderInertia('movies');
router.on('/tvshows').renderInertia('tv_shows');
router.on('/documentaries').renderInertia('documentaries');
router.on('/search').renderInertia('search');
router.on('/profile').renderInertia('profile');
router.get('/media/:id', async ({ params, inertia }) =>
  inertia.render('media_details', { id: params.id })
);
router.get('/tag/:tag', async ({ params, inertia }) => inertia.render('tag', { tag: params.tag }));
