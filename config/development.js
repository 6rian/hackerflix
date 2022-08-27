require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  tmdb: {
    access_token: process.env.TMDB_ACCESS_TOKEN,
    api_url: 'https://api.themoviedb.org/3/',
  },
};
