import { Client } from 'redis-om';
import config from 'config';

const client = new Client();

(async () => {
  try {
    await client.open(config.get('redis_url'));
  } catch (e) {
    console.error('Could not connect to redis:', e);
  }
})();

export default client;
