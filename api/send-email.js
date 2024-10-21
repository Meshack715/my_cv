const nodemailer = require('nodemailer');

// Load environment variables (Vercel automatically uses the .env.local file during development)
require('dotenv').config();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ message: 'Environment variables for email credentials are not set.' });
    }

    // Nodemailer transporter configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: true,  // Enable logging
        debug: true    // Show debug output
    });

    // Mail options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address (your email)
        to: 'davidngunzu511@gmail.com', // Recipient email
        subject: `Message from ${name} (${email})`, // Include sender's name and email
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // Plain text version
        html: `<h3>Message from ${name} (${email})</h3><p>${message}</p>` // HTML version for formatting
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email sent successfully', info: info.response });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}