import config from 'config';
import fetch from 'node-fetch';
import logger from '../lib/logger';

export default class TMDB {
  constructor() {
    try {
      this.ACCESS_TOKEN = config.get('tmdb.access_token');
      this.API_URL = config.get('tmdb.api_url');
    } catch (e) {
      throw new Error('Missing TMDB Access Token');
    }
  }

  async #request(url) {
    logger.info(`TMDB: Requesting ${url}`);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this.ACCESS_TOKEN}`,
      },
    });
    return await response.json();
  }

  async getList(id) {
    return await this.#request(`${this.API_URL}list/${id}`);
  }

  async getMovie(id) {
    return await this.#request(`${this.API_URL}movie/${id}?&append_to_response=videos,images`);
  }

  async getShow(id) {
    return await this.#request(`${this.API_URL}tv/${id}?&append_to_response=videos,images`);
  }
}
