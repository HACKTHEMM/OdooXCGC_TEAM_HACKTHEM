import express from 'express';
import db from './config/db.js';

const app = express();

app.use(express.json());

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err.stack);
  } else {
    console.log('📦 Connected to PostgreSQL');
  }
});

// Test route
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.send(`✅ Backend Live! Time: ${result.rows[0].now}`);
  } catch (err) {
    res.status(500).send('❌ Database query error');
  }
});

export default app;
