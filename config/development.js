require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  redis_url: process.env.REDIS_URL,
  tmdb: {
    access_token: process.env.TMDB_ACCESS_TOKEN,
    api_url: 'https://api.themoviedb.org/3/',
  },
};
