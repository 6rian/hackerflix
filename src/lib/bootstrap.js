import logger from './logger';
import { runListETL } from '../etls/tmdb/list';
import { runGoogleSheetETL } from '../etls/googlesheet';

export const bootstrap = async () => {
  logger.info('Starting Bootstrap');

  // STEP 1: Extract data from TMDB and load into Cache
  const listETL = await runListETL();

  // STEP 2: Extract data from Google Sheet and load into Cache
  const googleSheetETL = await runGoogleSheetETL();

  logger.info('Bootstrap Complete');

  if (!listETL || !googleSheetETL) {
    return false;
  }

  return true;
};
