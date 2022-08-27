import { Client } from 'redis-om';
import config from 'config';

const client = new Client();

(async () => {
  await client.open();
})();

export default client;
