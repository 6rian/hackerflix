import flickSchema from '../schemas/flick';
import redis from '../redis';

const Flick = redis.fetchRepository(flickSchema);

(async () => {
  await Flick.createIndex();
})();

export default Flick;
