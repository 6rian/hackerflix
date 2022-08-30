import config from 'config';
import { google } from 'googleapis';

const sheets = google.sheets('v4');

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const init = async () => {
  const authClient = await await auth.getClient();
  google.options({
    auth: authClient,
  });
};

export const fetchSheet = async () => {
  try {
    await init();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.get('gcp.sheet_id'),
      range: config.get('gcp.data_range'),
    });

    if (response && response.data && response.data.values) {
      return response.data.values;
    }
  } catch (e) {
    console.error(e);
    throw new Error(`Failed fetching Google Sheet: ${e.message}`);
  }
};
