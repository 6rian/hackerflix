import logger from './logger';
import { updateFlick } from '../services/cache';
import { fetchSheet } from '../services/google';
import { runListETL } from '../etls/tmdb/list';

const logError = (step, message) => {
  logger.error(`Bootstrap Failure on Step: ${step} :: ${message}`);
};

const validateSheetRow = (row) => {
  // TODO: validate required fields - everything except tags are required.

  // Skip header row
  if (row[0] === '0:tmdb_id') {
    return false;
  }

  return true;
};

const transformSheetRow = (row) => {
  return {
    tmdbId: row[0],
    tmdbMediaType: row[1],
    mediaType: row[2],
    slug: row[4],
  };
};

export const bootstrap = async () => {
  // STEP 1: Extract data from TMDB and load into Cache
  runListETL();

  // STEP 2: Extract data from Google Sheet and load into Cache
  try {
    const sheet = await fetchSheet();
    const transformed = sheet.filter((row) => validateSheetRow(row)).map(transformSheetRow);
    transformed.map(updateFlick);
  } catch (e) {
    logError('Google Sheet ETL', e.message);
  }
};
