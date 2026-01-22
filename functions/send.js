const sgMail = require('@sendgrid/mail');
const { google } = require('googleapis');
var x = require('dotenv').config();
const querystring = require('querystring');

// Configura Google Sheets
async function appendToSheet(data) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: ['giorgio.seregni@gmail.com', 'tore_free@hotmail.com'],
    from: email,
    subject: `Contatto da prestitoin.it - ${name} ${surname}`,
    text: `Nome: ${name}\nCognome: ${surname}\nTelefono: ${phone}\nEmail: ${email}\nCittà: ${citta}\nProvincia: ${provincia}`
  };

  try {
    // Prima salva il lead su Google Sheets
    await appendToSheet({ name, surname, phone, email, citta, provincia });

    // Poi invia l'email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent and lead saved' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing request', error: error.toString() })
    };
  }
};
