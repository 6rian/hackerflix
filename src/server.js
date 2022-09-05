require('dotenv').config();
const sassMiddleware = require('node-sass-middleware');
import express from 'express';
import config from 'config';
import morgan from 'morgan';
import path from 'path';
import logger from './lib/logger';
import routes from './routes';
import errorHandler from './lib/error.handler';
import { bootstrap } from './lib/bootstrap';

(async () => {
  // Run the bootstrap to preload data for homepage from TMDB
  const bootstrapResult = await bootstrap();
  if (!bootstrapResult) {
    const bootstrapFailure =
      'A major failure occurred during the bootstrap process. Cannot start the application.';
    logger.error(bootstrapFailure);
    throw new Error(bootstrapFailure);
  }

  const app = express();
  const port = config.get('port');

  const httpLogFormat = ':method :url :status :res[content-length] - :response-time ms';
  const httpLogger = morgan(httpLogFormat, { stream: logger.stream });
  app.use(httpLogger);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // Temporary
  app.use(
    sassMiddleware({
      src: path.join(__dirname, 'views'),
      dest: path.join(__dirname, 'views'),
      indentedSyntax: false, // use .scss
      debug: true,
      // outputStyle: 'compressed',
      sourceMap: true,
    })
  );

  app.use('/', routes);

  app.use(errorHandler);

  logger.info('Starting Application');
  app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
  });
})();
