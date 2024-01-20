const sgMail = require('@sendgrid/mail');
var x = require('dotenv').config();
const querystring = require('querystring');

console.log( x);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = querystring.parse(event.body);


  console.log( formData )
  const params = JSON.parse(event.body);
  const { name, email, subject, message } = params;

  let response = {
    nameMessage: '',
    emailMessage: '',
    subjectMessage: '',
    messageMessage: ''
  };

  if (!name) {
    response.nameMessage = 'Empty name!';
  }
  if (!validateEmail(email)) {
    response.emailMessage = 'Invalid email!';
  }
  if (!subject) {
    response.subjectMessage = 'Empty subject!';
  }
  if (!message) {
    response.messageMessage = 'Empty message!';
  }

  if (response.nameMessage || response.emailMessage || response.subjectMessage || response.messageMessage) {
    return {
      statusCode: 400,
      body: JSON.stringify(response)
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'contact.azmind@gmail.com',
    from: email,
    subject: `${subject} (faby layout 3)`,
    text: `Message from: ${name}\n${message}`
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

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
