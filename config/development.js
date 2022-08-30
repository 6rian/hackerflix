require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  redis_url: process.env.REDIS_URL,
  tmdb: {
    access_token: process.env.TMDB_ACCESS_TOKEN,
    api_url: 'https://api.themoviedb.org/3/',
    list_id: '8214827',
  },
  gcp: {
    sheet_id: process.env.GOOGLE_SHEET_ID,
    data_range: process.env.GOOGLE_SHEET_DATA_RANGE,
  },
};
