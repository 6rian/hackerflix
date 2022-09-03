import logger from '../lib/logger';
import { fetchSheet } from '../services/google';
import { updateFlick } from "../services/cache";

const extract = async () => {
  return await fetchSheet();
};

const validate = (row) => {
  // TODO: validate required fields - everything except tags are required.

  // Skip header row
  if (row[0] === '0:tmdb_id') {
    return false;
  }

  return true;
};

const transform = (row) => {
  return {
    tmdbId: row[0],
    tmdbMediaType: row[1],
    mediaType: row[2],
    slug: row[4],
  };
};

const load = async (flick) => {
  updateFlick(flick);
}

export const runGoogleSheetETL = async () => {
  try {
    const sheet = await extract();
    const transformed = sheet.filter((row) => validate(row)).map(transform);
    transformed.forEach(load);
  } catch (e) {
    logger.error(`Failure during Google Sheet ETL: ${e.message}`);
  }
};
