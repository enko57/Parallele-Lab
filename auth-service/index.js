require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/auth/health', (req, res) => {
    res.json({ status: 'Auth Service is healthy' });
});

app.listen(port, () => {
    console.log(`Auth Service listening on port ${port}`);
});
