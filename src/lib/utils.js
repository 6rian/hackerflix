import { MEDIA_TYPES } from './constants';

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' ? true : false;
};

export const isValidMediaType = (type) => {
  return Object.values(MEDIA_TYPES).includes(type);
};
