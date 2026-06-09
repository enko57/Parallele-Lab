require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get('/api/media/health', (req, res) => {
    res.json({ status: 'Media Service is healthy' });
});

app.listen(port, () => {
    console.log(`Media Service listening on port ${port}`);
});
