import { createClient } from 'redis';
import config from 'config';

const redisClient = createClient({
  host: config.get('redis.host'),
  port: config.get('redis.port'),
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
