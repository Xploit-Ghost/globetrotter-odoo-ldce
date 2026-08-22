const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const tripsRoutes = require('./routes/trips');
const stopsRoutes = require('./routes/stops');
const activitiesRoutes = require('./routes/activities');
const citiesRoutes = require('./routes/cities');
const db = require('./database');

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/stops', stopsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/cities', citiesRoutes);

app.get('/api/routes', (req, res) => { 
  db.all('SELECT * FROM routes', [], (err, rows) => { 
    if(err) return res.status(500).json({error: err.message}); 
    res.json(rows); 
  }); 
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Globe Trotter API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
