const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/routes: Returns predefined routes with nested stops and city metadata.
router.get('/', (req, res) => {
  db.all('SELECT * FROM routes', [], (err, routes) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all(`
      SELECT rs.*, c.name, c.country, c.lat, c.lng, c.cost_index 
      FROM route_stops rs
      JOIN cities c ON rs.city_id = c.id
      ORDER BY rs.route_id, rs.order_index
    `, [], (err, routeStops) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const routesWithStops = routes.map(route => {
        return {
          ...route,
          stops: routeStops.filter(rs => rs.route_id === route.id)
        };
      });
      
      res.json(routesWithStops);
    });
  });
});

module.exports = router;
