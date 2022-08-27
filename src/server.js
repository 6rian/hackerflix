import express from 'express';
import morgan from 'morgan';
import logger from './lib/logger';

const app = express();
const port = 3000;

const httpLogFormat = ':method :url :status :res[content-length] - :response-time ms';
const httpLogger = morgan(httpLogFormat, { stream: logger.stream });

// Start HTTP request logging
app.use(httpLogger);

app.get('/', (req, res, next) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log('listening to port', port);
});
