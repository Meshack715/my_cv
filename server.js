// Import required packages
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Make sure your .env file is configured

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Environment variables EMAIL_USER or EMAIL_PASS are not set.');
    process.exit(1);
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

// POST route to handle email sending
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    // Mail options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address (your email)
        to: process.env.EMAIL_USER, // Change this to the recipient email if needed
        subject: `Message from ${name} (${email})`, // Include sender's name and email
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // Plain text version
        html: `<h3>Message from ${name} (${email})</h3><p>${message}</p>` // HTML version for formatting
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.status(200).send('Email sent successfully: ' + info.response);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
