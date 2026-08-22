const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Register User
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const query = `INSERT INTO users (email, password_hash) VALUES (?, ?)`;
    db.run(query, [email, hash], function (err) {
      if (err) {
        console.error('Registration DB error:', err.message);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      
      const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ id: this.lastID, email, token });
    });
  } catch (err) {
    console.error('Registration server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login User
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
      if (err) {
        console.error('Login DB error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const isValid = bcrypt.compareSync(password, user.password_hash);
      if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ id: user.id, email: user.email, token });
    });
  } catch (err) {
    console.error('Login server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
