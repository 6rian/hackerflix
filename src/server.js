require('dotenv').config();
import express from 'express';
import config from 'config';
import morgan from 'morgan';
import logger from './lib/logger';
import devRoutes from './routes/dev';
import errorHandler from './lib/error.handler';

const app = express();
const port = config.get('port');

const httpLogFormat = ':method :url :status :res[content-length] - :response-time ms';
const httpLogger = morgan(httpLogFormat, { stream: logger.stream });

// Start HTTP request logging
app.use(httpLogger);

app.get('/', (req, res, next) => {
  res.send('Hello, World!');
});

app.use('/dev', devRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log('listening to port', port);
});
