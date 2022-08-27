import logger from './logger';
import { isDevelopment } from './utils';

export default (error, req, res, next) => {
  logger.error(error.message || error);

  if (isDevelopment()) {
    console.error(error);
  }

  res.status(error.status || 500).json({
    message: error.message || 'Unexpected Server Error',
  });
};
