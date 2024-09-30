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

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email from .env
        pass: process.env.EMAIL_PASS  // Password from .env
    }
});

// POST route to handle email sending
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Mail options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address (your email)
        to: 'odondimeshack1@gmail.com', // Recipient email
        subject: `Message from ${name} (${email})`, // Include sender's name and email
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // Plain text version
        html: `<h3>Message from ${name} (${email})</h3><p>${message}</p>` // HTML version for formatting
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Error sending email.');
        }
        res.status(200).send('Email sent successfully: ' + info.response);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
