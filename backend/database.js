const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    // Initialize schema
    initSchema();
  }
});

function initSchema() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    // Trips table
    db.run(`
      CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT,
        trip_name TEXT,
        start_date TEXT,
        end_date TEXT,
        total_budget REAL DEFAULT 0,
        currency TEXT DEFAULT 'INR',
        description TEXT,
        travel_cost REAL DEFAULT 0,
        stay_cost REAL DEFAULT 0,
        food_cost REAL DEFAULT 0
      )
    `);

    // Expenses table
    db.run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER,
        name TEXT,
        category TEXT,
        amount REAL,
        FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    // Cities table
    db.run(`
      CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        country TEXT,
        lat REAL,
        lng REAL,
        cost_index INTEGER
      )
    `);

    // Routes table
    db.run(`
      CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT
      )
    `);

    // Route stops table
    db.run(`
      CREATE TABLE IF NOT EXISTS route_stops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER,
        city_id INTEGER,
        order_index INTEGER,
        suggested_days INTEGER,
        FOREIGN KEY(route_id) REFERENCES routes(id),
        FOREIGN KEY(city_id) REFERENCES cities(id)
      )
    `);

    // Stops table
    db.run(`
      CREATE TABLE IF NOT EXISTS stops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER,
        city_id INTEGER,
        city_name TEXT,
        day_number INTEGER,
        arrival_date TEXT,
        departure_date TEXT,
        FOREIGN KEY(trip_id) REFERENCES trips(id),
        FOREIGN KEY(city_id) REFERENCES cities(id)
      )
    `);

    // Activities table
    db.run(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stop_id INTEGER,
        city_id INTEGER,
        name TEXT,
        category TEXT,
        cost REAL,
        duration_hours REAL,
        FOREIGN KEY(stop_id) REFERENCES stops(id),
        FOREIGN KEY(city_id) REFERENCES cities(id)
      )
    `);

    console.log('Database schema initialized.');

    // Seed data
    db.get('SELECT COUNT(*) AS count FROM cities', (err, row) => {
      if (err) {
        console.error('Error checking cities count', err);
      } else if (row.count === 0) {
        seedDatabase();
      }
    });
  });
}

function seedDatabase() {
  console.log('Seeding database...');
  
  db.serialize(() => {
    const insertCity = db.prepare('INSERT INTO cities (name, country, lat, lng, cost_index) VALUES (?, ?, ?, ?, ?)');
    
    const citiesData = [
      ['Delhi', 'India', 28.6139, 77.2090, 2],
      ['Jaipur', 'India', 26.9124, 75.7873, 1],
      ['Agra', 'India', 27.1767, 78.0081, 1],
      ['Udaipur', 'India', 24.5854, 73.7125, 2],
      ['Paris', 'France', 48.8566, 2.3522, 4],
      ['Amsterdam', 'Netherlands', 52.3676, 4.9041, 4],
      ['Berlin', 'Germany', 52.5200, 13.4050, 3],
      ['Rome', 'Italy', 41.9028, 12.4964, 3],
      ['Barcelona', 'Spain', 41.3874, 2.1686, 3],
      ['Tokyo', 'Japan', 35.6762, 139.6503, 4],
      ['Kyoto', 'Japan', 35.0116, 135.7681, 3],
      ['Osaka', 'Japan', 34.6937, 135.5023, 3],
      ['Bangkok', 'Thailand', 13.7563, 100.5018, 2],
      ['Chiang Mai', 'Thailand', 18.7883, 98.9853, 1],
      ['Phuket', 'Thailand', 7.8804, 98.3923, 2],
      ['New York', 'USA', 40.7128, -74.0060, 5],
      ['Washington DC', 'USA', 38.9072, -77.0369, 4],
      ['Boston', 'USA', 42.3601, -71.0589, 4]
    ];
    
    citiesData.forEach(city => {
      insertCity.run(city);
    });
    insertCity.finalize();

    const insertRoute = db.prepare('INSERT INTO routes (id, name, description) VALUES (?, ?, ?)');
    const routesData = [
      [1, 'Golden Triangle India', 'Explore the rich heritage of Delhi, Agra, and Jaipur.'],
      [2, 'Euro Summer', 'A classic European adventure through Paris, Amsterdam, Berlin, Rome, and Barcelona.'],
      [3, 'Japan Highlights', 'Experience the contrast of modern Tokyo and traditional Kyoto.'],
      [4, 'Thailand Island & City', 'From bustling Bangkok to the peaceful mountains of Chiang Mai.'],
      [5, 'US East Coast', 'A journey through history and culture in New York, Washington DC, and Boston.']
    ];
    routesData.forEach(route => {
      insertRoute.run(route);
    });
    insertRoute.finalize();

    const insertRouteStop = db.prepare('INSERT INTO route_stops (route_id, city_id, order_index, suggested_days) VALUES (?, ?, ?, ?)');
    const routeStopsData = [
      // Golden Triangle India
      [1, 1, 1, 2], // Delhi
      [1, 3, 2, 1], // Agra
      [1, 2, 3, 2], // Jaipur
      // Euro Summer
      [2, 5, 1, 3], // Paris
      [2, 6, 2, 2], // Amsterdam
      [2, 7, 3, 3], // Berlin
      [2, 8, 4, 3], // Rome
      [2, 9, 5, 3], // Barcelona
      // Japan Highlights
      [3, 10, 1, 4], // Tokyo
      [3, 11, 2, 3], // Kyoto
      [3, 12, 3, 2], // Osaka
      // Thailand Island & City
      [4, 13, 1, 3], // Bangkok
      [4, 14, 2, 3], // Chiang Mai
      [4, 15, 3, 4], // Phuket
      // US East Coast
      [5, 16, 1, 4], // New York
      [5, 17, 2, 2], // Washington DC
      [5, 18, 3, 2]  // Boston
    ];
    routeStopsData.forEach(rs => {
      insertRouteStop.run(rs);
    });
    insertRouteStop.finalize();
    
    console.log('Database seeded successfully.');
  });
}

module.exports = db;
