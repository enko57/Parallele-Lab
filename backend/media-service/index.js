require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// DB Connection
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mediatracker',
  port: 5432,
});

// Init DB
const initDB = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_entries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        score VARCHAR(10) DEFAULT '-',
        progress VARCHAR(50) DEFAULT '0',
        poster_url TEXT
      );
    `);
    console.log("Database initialized.");
    client.release();
  } catch (err) {
    console.error("DB Initialization error:", err);
  }
};
initDB();

app.get('/api/media/health', (req, res) => {
    res.json({ status: 'Media Service is healthy' });
});

// CRUD Endpoints
app.get('/api/media', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media_entries ORDER BY id DESC');
    // Map snake_case back to camelCase for the React frontend
    const mapped = result.rows.map(row => ({
      ...row,
      posterUrl: row.poster_url
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/media', async (req, res) => {
  const { title, type, status, score, progress, posterUrl } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO media_entries (title, type, status, score, progress, poster_url) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, type, status, score, progress, posterUrl]
    );
    const row = result.rows[0];
    res.status(201).json({ ...row, posterUrl: row.poster_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/media/:id', async (req, res) => {
  const { id } = req.params;
  const { status, score, progress } = req.body;
  try {
    const result = await pool.query(
      `UPDATE media_entries SET status = $1, score = $2, progress = $3 WHERE id = $4 RETURNING *`,
      [status, score, progress, id]
    );
    const row = result.rows[0];
    res.json({ ...row, posterUrl: row.poster_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/media/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM media_entries WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Media Service listening on port ${port}`);
});
