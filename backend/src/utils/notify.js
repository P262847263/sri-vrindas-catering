const twilioSid = process.env.TWILIO_SID;
const twilioAuth = process.env.TWILIO_AUTH;
const twilioFrom = process.env.TWILIO_FROM; // e.g. whatsapp:+123456789

let client = null;
if (twilioSid && twilioAuth) {
  try { client = require('twilio')(twilioSid, twilioAuth); } catch(e) { console.warn('twilio lib not installed or failed to init', e.message); }
}

async function sendWhatsApp(to, message) {
  if (!to) return;
  if (client && twilioFrom) {
    try {
      const res = await client.messages.create({ body: message, from: twilioFrom, to });
      console.log('WhatsApp sent', res.sid);
      return res;
    } catch (e) {
      console.error('Failed to send WhatsApp', e && e.message ? e.message : e);
    }
  } else {
    console.log('[notify] whatsapp fallback to log: to=', to, 'msg=', message);
  }
}

// Optional email notification using nodemailer if SMTP config provided
let mailer = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    const nodemailer = require('nodemailer');
    mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  } catch (e) {
    console.warn('nodemailer not available or failed to init', e.message);
  }
}

async function sendEmail(to, subject, text) {
  if (!to) return;
  if (mailer) {
    try {
      const res = await mailer.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text });
      console.log('Email sent', res && res.messageId);
      return res;
    } catch (e) {
      console.error('Failed to send email', e && e.message ? e.message : e);
    }
  } else {
    console.log('[notify] email fallback to log: to=', to, 'subject=', subject, 'text=', text);
  }
}

module.exports = { sendWhatsApp, sendEmail };
