import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import HomeDashboard from './pages/HomeDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SettingsProfile from './pages/SettingsProfile';
import TripDetails from './pages/TripDetails';
import EstimateExplore from './pages/EstimateExplore';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { TripsProvider } from './context/TripsContext';
import './index.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <TripsProvider>
        <LanguageProvider>
          <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <HomeDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-trips" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/explore" 
                element={
                  <PrivateRoute>
                    <Explore />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/estimate" 
                element={
                  <PrivateRoute>
                    <EstimateExplore />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <SettingsProfile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/trips/:id" 
                element={
                  <PrivateRoute>
                    <TripDetails />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
        </LanguageProvider>
      </TripsProvider>
    </ThemeProvider>
  );
}

export default App;
