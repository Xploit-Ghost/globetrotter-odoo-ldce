const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};

// Add an activity to a stop
router.post('/', verifyToken, (req, res) => {
  const { stop_id, title, category, cost, duration_hours } = req.body;
  
  // Verify user owns the trip that owns the stop
  db.get(`
    SELECT stops.id FROM stops 
    JOIN trips ON stops.trip_id = trips.id 
    WHERE stops.id = ? AND trips.user_id = ?
  `, [stop_id, req.userId], (err, stop) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!stop) return res.status(404).json({ error: 'Stop not found or unauthorized' });
    
    const query = `INSERT INTO activities (stop_id, title, category, cost, duration_hours) 
                   VALUES (?, ?, ?, ?, ?)`;
                   
    db.run(query, [stop_id, title, category, cost, duration_hours], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        id: this.lastID, 
        stop_id, 
        title, 
        category, 
        cost, 
        duration_hours 
      });
    });
  });
});

// Delete an activity
router.delete('/:id', verifyToken, (req, res) => {
  db.get(`
    SELECT activities.id FROM activities 
    JOIN stops ON activities.stop_id = stops.id
    JOIN trips ON stops.trip_id = trips.id 
    WHERE activities.id = ? AND trips.user_id = ?
  `, [req.params.id, req.userId], (err, activity) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!activity) return res.status(404).json({ error: 'Activity not found or unauthorized' });
    
    db.run('DELETE FROM activities WHERE id = ?', [req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Activity deleted successfully' });
    });
  });
});

module.exports = router;
