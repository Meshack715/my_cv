const nodemailer = require('nodemailer');
require('dotenv').config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ message: 'Environment variables for email credentials are not set.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    logger: true,
    debug: true
  });

  const mailOptions = {
    from: `MESHACK_CV <${process.env.EMAIL_USER}>`,
    to: 'odondimeshack1@gmail.com',
    subject: `Message from ${name} (${email}): ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<h3>Message from ${name} (${email}): ${subject}</h3><p>${message}</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully', info: info.response });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}
