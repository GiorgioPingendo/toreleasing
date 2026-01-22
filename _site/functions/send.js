const { google } = require('googleapis');
require('dotenv').config();
const querystring = require('querystring');

function parsePrivateKey(key) {
  if (!key) throw new Error('GOOGLE_PRIVATE_KEY is not set');

  // Se contiene già newline reali, usala così
  if (key.includes('\n') && !key.includes('\\n')) {
    return key;
  }
  // Altrimenti converti \n letterali in newline reali
  return key.replace(/\\n/g, '\n');
}

async function appendToSheet(data) {
  const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const now = new Date();
  const dataFormattata = now.toLocaleString('it-IT', { timeZone: 'Europe/Rome' });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Foglio1!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[dataFormattata, data.name, data.surname, data.phone, data.email, data.citta, data.provincia]],
    },
  });
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = querystring.parse(event.body);
  const { name, surname, phone, email, citta, provincia } = formData;

  try {
    await appendToSheet({ name, surname, phone, email, citta, provincia });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Lead saved' })
    };
  } catch (error) {
    const keyPreview = process.env.GOOGLE_PRIVATE_KEY
      ? `starts with: ${process.env.GOOGLE_PRIVATE_KEY.substring(0, 50)}...`
      : 'NOT SET';
    console.error('Error:', error);
    console.error('Key info:', keyPreview);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error saving lead',
        error: error.toString(),
        keyInfo: keyPreview
      })
    };
  }
};
