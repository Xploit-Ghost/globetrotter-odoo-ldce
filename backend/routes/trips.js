const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Dummy middleware to not touch auth
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    req.userEmail = req.headers['user_email'] || 'test@test.com'; // fallback for testing without auth
    return next(); 
  }
  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) {
      req.userEmail = req.headers['user_email'] || 'test@test.com';
      return next();
    }
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};

// POST /api/trips
router.post('/', verifyToken, (req, res) => {
  const { user_email, trip_name, start_date, end_date, total_budget, description, currency } = req.body;
  const email = user_email || req.userEmail;
  const query = `INSERT INTO trips (user_email, trip_name, start_date, end_date, total_budget, description, currency) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
                 
  db.run(query, [email, trip_name, start_date, end_date, total_budget || 0, description, currency || 'INR'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

// GET /api/trips/:user_email
router.get('/:user_email', (req, res) => {
  const email = req.params.user_email;
  db.all(`
    SELECT t.*, 
           COUNT(DISTINCT s.id) as stop_count,
           SUM(a.cost) as cost_count
    FROM trips t
    LEFT JOIN stops s ON t.id = s.trip_id
    LEFT JOIN activities a ON s.id = a.stop_id
    WHERE t.user_email = ?
    GROUP BY t.id
  `, [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/trips/:tripId/details
router.get('/:tripId/details', (req, res) => {
  const tripId = req.params.tripId;
  db.get('SELECT * FROM trips WHERE id = ?', [tripId], (err, trip) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    db.all('SELECT * FROM stops WHERE trip_id = ? ORDER BY day_number, arrival_date ASC', [tripId], (err, stops) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (stops.length === 0) {
        trip.stops = [];
        return res.json(trip);
      }
      
      const stopIds = stops.map(s => s.id);
      const placeholders = stopIds.map(() => '?').join(',');
      
      db.all(`SELECT * FROM activities WHERE stop_id IN (${placeholders})`, stopIds, (err, activities) => {
        if (err) return res.status(500).json({ error: err.message });
        
        stops.forEach(stop => {
          stop.activities = activities.filter(a => a.stop_id === stop.id);
        });
        
        trip.stops = stops;
        db.all('SELECT * FROM expenses WHERE trip_id = ?', [tripId], (err, expenses) => {
          if (err) return res.status(500).json({ error: err.message });
          trip.expenses = expenses || [];
          res.json(trip);
        });
      });
    });
  });
});

// DELETE /api/trips/:tripId
router.delete('/:tripId', (req, res) => {
  db.run('DELETE FROM trips WHERE id = ?', [req.params.tripId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted successfully' });
  });
});

// PUT /api/trips/:tripId/budget-update
router.put('/:tripId/budget-update', (req, res) => {
  const { travel_cost, stay_cost, food_cost } = req.body;
  const tripId = req.params.tripId;
  db.run(
    'UPDATE trips SET travel_cost = ?, stay_cost = ?, food_cost = ? WHERE id = ?',
    [travel_cost || 0, stay_cost || 0, food_cost || 0, tripId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Budget updated successfully' });
    }
  );
});

// PUT /api/trips/:tripId/total-budget
router.put('/:tripId/total-budget', (req, res) => {
  const { total_budget } = req.body;
  const tripId = req.params.tripId;
  db.run(
    'UPDATE trips SET total_budget = ? WHERE id = ?',
    [total_budget || 0, tripId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Total budget updated successfully' });
    }
  );
});

// POST /api/trips/:tripId/expenses
router.post('/:tripId/expenses', (req, res) => {
  const { name, category, amount } = req.body;
  const tripId = req.params.tripId;
  db.run(
    'INSERT INTO expenses (trip_id, name, category, amount) VALUES (?, ?, ?, ?)',
    [tripId, name, category, amount || 0],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, trip_id: tripId, name, category, amount });
    }
  );
});

// DELETE /api/trips/:tripId/expenses/:expenseId
router.delete('/:tripId/expenses/:expenseId', (req, res) => {
  db.run('DELETE FROM expenses WHERE id = ? AND trip_id = ?', [req.params.expenseId, req.params.tripId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense deleted successfully' });
  });
});

// POST /api/trips/:tripId/stops
router.post('/:tripId/stops', (req, res) => {
  const { city_id, city_name, day_number, arrival_date, departure_date } = req.body;
  const tripId = req.params.tripId;
  
  const query = `INSERT INTO stops (trip_id, city_id, city_name, day_number, arrival_date, departure_date) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
                 
  db.run(query, [tripId, city_id, city_name, day_number, arrival_date, departure_date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      id: this.lastID, trip_id: tripId, city_id, city_name, day_number, arrival_date, departure_date 
    });
  });
});

// A. GET /api/trips/:tripId/expense-forecast
router.get('/:tripId/expense-forecast', (req, res) => {
  const tripId = req.params.tripId;
  db.get('SELECT * FROM trips WHERE id = ?', [tripId], (err, trip) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    let totalDays = 1;
    if (trip.start_date && trip.end_date) {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      if (diffDays > 0 && !isNaN(diffDays)) totalDays = diffDays;
    }

    const idealDailyBurn = trip.total_budget / totalDays;

    db.all(`
      SELECT s.day_number, s.arrival_date, SUM(a.cost) as daily_cost 
      FROM stops s
      LEFT JOIN activities a ON s.id = a.stop_id
      WHERE s.trip_id = ?
      GROUP BY s.day_number, s.arrival_date
      ORDER BY s.day_number ASC, s.arrival_date ASC
    `, [tripId], (err, days) => {
      if (err) return res.status(500).json({ error: err.message });

      let cumulativeSpend = 0;
      const forecast = [];
      const riskDays = [];

      days.forEach((day, index) => {
        const dayIndex = index + 1;
        const dailySpend = day.daily_cost || 0;
        cumulativeSpend += dailySpend;
        const idealCumulative = idealDailyBurn * dayIndex;

        let pace = 'on_track';
        if (cumulativeSpend < idealCumulative * 0.9) pace = 'ahead';
        else if (cumulativeSpend > idealCumulative * 1.1) pace = 'over_budget';

        forecast.push({
          day_number: day.day_number,
          date: day.arrival_date,
          dailySpend,
          cumulativeSpend,
          idealCumulative,
          pace
        });

        if (pace === 'over_budget') riskDays.push(day.day_number || day.arrival_date);
      });

      const projectedFinalSpend = cumulativeSpend; // Or extrapolate if they are halfway
      const projectedOutcome = projectedFinalSpend > trip.total_budget ? 'over' : 'under';

      res.json({
        tripId,
        totalBudget: trip.total_budget,
        totalDays,
        idealDailyBurn,
        forecast,
        projectedFinalSpend,
        projectedOutcome,
        riskDays
      });
    });
  });
});

// B. POST /api/trips/:tripId/budget-analysis
router.post('/:tripId/budget-analysis', (req, res) => {
  const tripId = req.params.tripId;
  const { totalBudget, currency } = req.body;
  
  db.get('SELECT * FROM trips WHERE id = ?', [tripId], (err, trip) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const finalBudget = totalBudget !== undefined ? totalBudget : trip.total_budget;
    let totalDays = 1;
    if (trip.start_date && trip.end_date) {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      if (diffDays > 0 && !isNaN(diffDays)) totalDays = diffDays;
    }
    const fairShare = finalBudget / totalDays;

    db.all(`
      SELECT s.day_number, s.arrival_date, a.category, a.cost 
      FROM stops s
      JOIN activities a ON s.id = a.stop_id
      WHERE s.trip_id = ?
    `, [tripId], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });

      const catBreakdown = { stay: 0, activities: 0, transport: 0, food: 0, other: 0 };
      const dailyMap = {};
      let estimatedTotal = 0;

      items.forEach(item => {
        const cat = item.category ? item.category.toLowerCase() : 'other';
        const cost = item.cost || 0;
        
        if (catBreakdown[cat] !== undefined) catBreakdown[cat] += cost;
        else catBreakdown.other += cost;
        
        estimatedTotal += cost;

        const dayKey = item.day_number || item.arrival_date || 'Day_1';
        if (!dailyMap[dayKey]) dailyMap[dayKey] = 0;
        dailyMap[dayKey] += cost;
      });

      const remaining = finalBudget - estimatedTotal;
      const status = remaining >= 0 ? 'under_budget' : 'over_budget';
      
      const categoryBreakdown = Object.keys(catBreakdown).map(k => ({
        category: k,
        total: catBreakdown[k],
        percentage: estimatedTotal > 0 ? (catBreakdown[k] / estimatedTotal * 100).toFixed(2) : 0
      }));

      const dailyBreakdown = [];
      const suggestions = [];

      Object.keys(dailyMap).forEach(dayKey => {
        const estimatedSpend = dailyMap[dayKey];
        const dayStatus = estimatedSpend > fairShare ? 'over' : 'under';
        dailyBreakdown.push({
          day: dayKey,
          estimatedSpend,
          fairShare,
          status: dayStatus
        });

        if (estimatedSpend > fairShare * 1.2) {
          suggestions.push(`Trim paid activities on ${dayKey} as it exceeds the fair share by > 20%.`);
        }
      });

      if (remaining > 0) {
        suggestions.push(`You have ${remaining} ${currency || trip.currency} remaining. Consider adding more activities!`);
      }

      res.json({
        tripId,
        totalBudget: finalBudget,
        estimatedTotal,
        remaining,
        status,
        categoryBreakdown,
        dailyBreakdown,
        suggestions
      });
    });
  });
});

// C. GET /api/trips/:tripId/travel-estimates
router.get('/:tripId/travel-estimates', (req, res) => {
  const tripId = req.params.tripId;
  db.all(`
    SELECT s.id, s.city_id, s.city_name, c.lat, c.lng 
    FROM stops s
    JOIN cities c ON s.city_id = c.id
    WHERE s.trip_id = ?
    ORDER BY COALESCE(s.day_number, s.arrival_date) ASC, s.id ASC
  `, [tripId], (err, stops) => {
    if (err) return res.status(500).json({ error: err.message });
    if (stops.length < 2) {
      return res.json({ tripId, legs: [], totalDistanceKm: 0, totalTravelHours: 0 });
    }

    const legs = [];
    let totalDistanceKm = 0;
    let totalTravelHours = 0;

    for (let i = 0; i < stops.length - 1; i++) {
      const fromCity = stops[i];
      const toCity = stops[i+1];
      
      const R = 6371; 
      const dLat = (toCity.lat - fromCity.lat) * Math.PI / 180;
      const dLon = (toCity.lng - fromCity.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(fromCity.lat * Math.PI / 180) * Math.cos(toCity.lat * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distanceKm = Math.round(R * c);

      let recommendedMode = 'car';
      if (distanceKm > 800) recommendedMode = 'flight';
      else if (distanceKm > 300) recommendedMode = 'train';

      const estimates = {
        car: Math.max(0.5, (distanceKm / 50).toFixed(1)),
        train: Math.max(0.5, (distanceKm / 60).toFixed(1)),
        flight: ((distanceKm / 500) + 1.5).toFixed(1)
      };

      legs.push({
        fromCity: fromCity.city_name,
        toCity: toCity.city_name,
        distanceKm,
        recommendedMode,
        estimates,
        warning: recommendedMode === 'flight' ? 'Book flights early' : null
      });

      totalDistanceKm += distanceKm;
      totalTravelHours += parseFloat(estimates[recommendedMode]);
    }

    res.json({ tripId, legs, totalDistanceKm, totalTravelHours });
  });
});

// D. GET /api/trips/:tripId/public
router.get('/:tripId/public', (req, res) => {
  const tripId = req.params.tripId;
  db.get('SELECT id, trip_name, start_date, end_date, description, total_budget, currency FROM trips WHERE id = ?', [tripId], (err, trip) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    db.all('SELECT * FROM stops WHERE trip_id = ? ORDER BY day_number, arrival_date ASC', [tripId], (err, stops) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const stopIds = stops.map(s => s.id);
      if (stopIds.length === 0) {
        trip.stops = [];
        return res.json(trip);
      }
      
      const placeholders = stopIds.map(() => '?').join(',');
      db.all(`SELECT * FROM activities WHERE stop_id IN (${placeholders})`, stopIds, (err, activities) => {
        if (err) return res.status(500).json({ error: err.message });
        
        stops.forEach(stop => {
          stop.activities = activities.filter(a => a.stop_id === stop.id);
        });
        
        trip.stops = stops;
        res.json(trip);
      });
    });
  });
});

module.exports = router;
