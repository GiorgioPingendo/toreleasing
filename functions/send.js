const sgMail = require('@sendgrid/mail');
var x = require('dotenv').config();
const querystring = require('querystring');
exports.handler = async (event, context) => {

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = querystring.parse(event.body);
  const {name, phone , email, residenza } = formData;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);


  const msg = {
    to: ['giorgio.seregni@gmail.com', 'tore_free@hotmail.com'],
    from: email,
    subject: `contatto da prestitoin.it `,
    text: `Nome: ${name}\nTelefono: ${phone}\nEmail: ${email}\nResidenza: ${residenza}`
  };
  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email', error: error.toString() })
    };
  }
};