import { Entity, Schema } from 'redis-om';

class Flick extends Entity {}

const flickSchema = new Schema(Flick, {
  title: { type: 'string' },
  mediaType: { type: 'string' },
  tmdbId: { type: 'string' },
});

export default flickSchema;
