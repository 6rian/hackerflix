import config from 'config';

export default class TMDB {
  constructor() {
    try {
      this.ACCESS_TOKEN = config.get('tmdb.access_token');
    } catch (e) {
      throw new Error('Missing TMDB Access Token');
    }
  }

  #request() {
    console.log('private!');
  }
}
