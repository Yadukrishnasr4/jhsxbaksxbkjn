const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Path to the JSON file where messages will be stored
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Initialize messages.json if it doesn't exist
if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
}

// POST endpoint for contact form submission
app.post('/api/contact', (req, res) => {
    const { name, phone, email, message } = req.body;

    // Basic validation
    if (!name || !phone || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newMessage = {
        id: Date.now(),
        date: new Date().toISOString(),
        name,
        phone,
        email,
        message
    };

    try {
        // Read existing messages
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        const messages = JSON.parse(data);

        // Add the new message
        messages.push(newMessage);

        // Save back to file
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

        console.log(`New contact message received from ${name}`);
        res.status(200).json({ success: true, message: 'Message successfully sent.' });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
