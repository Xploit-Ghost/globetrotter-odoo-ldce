const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /api/stops/:stopId/activities
router.post('/:stopId/activities', (req, res) => {
  const { name, category, cost, duration_hours } = req.body;
  const stopId = req.params.stopId;
  
  db.get('SELECT city_id FROM stops WHERE id = ?', [stopId], (err, stop) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!stop) return res.status(404).json({ error: 'Stop not found' });

    const query = `INSERT INTO activities (stop_id, city_id, name, category, cost, duration_hours) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
                   
    db.run(query, [stopId, stop.city_id, name, category, cost, duration_hours], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        id: this.lastID, stop_id: stopId, city_id: stop.city_id, name, category, cost, duration_hours 
      });
    });
  });
});

module.exports = router;
