/* server.js */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for single page navigation (if needed later)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Server initialized on port ${PORT}`);
    console.log(`🌍 Access at: http://localhost:${PORT}`);
    console.log(`=========================================`);
});