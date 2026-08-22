import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  English: {
    dashboard: 'Dashboard',
    estimateExplore: 'Estimate & Explore',
    settingsProfile: 'Settings & Profile',
    logout: 'Logout',
    signUp: 'Sign Up',
    login: 'Login',
    preferences: 'Preferences',
    displayCurrency: 'Display Currency',
    language: 'Language',
    notifications: 'Notifications',
    pushNotifications: 'Push Notifications',
    dangerZone: 'Danger Zone',
    deleteAccount: 'Delete Account',
    manageAccount: 'Manage your account preferences and global settings.',
    wanderlustGreeting: 'Wanderlust calls,',
    planNewTrip: 'Plan New Trip',
    annualBudget: 'Annual Budget',
    goal: 'Goal',
    spent: 'Spent',
    tripsLeft: 'trips left',
    overBudget: 'Over budget',
    recentTrips: 'Recent Trips',
    curatedDestinations: 'Curated Destinations',
    viewAll: 'View all',
    yourTrips: 'Your Trips',
    myJourneys: 'My Journeys',
    upcoming: 'Upcoming',
    completed: 'Completed',
    past: 'Past',
    exploreCities: 'Explore Cities'
  },
  Spanish: {
    dashboard: 'Tablero',
    estimateExplore: 'Estimar y Explorar',
    settingsProfile: 'Ajustes y Perfil',
    logout: 'Cerrar Sesión',
    signUp: 'Registrarse',
    login: 'Iniciar Sesión',
    preferences: 'Preferencias',
    displayCurrency: 'Moneda',
    language: 'Idioma',
    notifications: 'Notificaciones',
    pushNotifications: 'Notificaciones Push',
    dangerZone: 'Zona de Peligro',
    deleteAccount: 'Borrar Cuenta',
    manageAccount: 'Administra tus preferencias.',
    wanderlustGreeting: 'La pasión por viajar llama,',
    planNewTrip: 'Planear Nuevo Viaje',
    annualBudget: 'Presupuesto Anual',
    goal: 'Objetivo',
    spent: 'Gastado',
    tripsLeft: 'viajes restantes',
    overBudget: 'Sobre presupuesto',
    recentTrips: 'Viajes Recientes',
    curatedDestinations: 'Destinos Seleccionados',
    viewAll: 'Ver todo',
    yourTrips: 'Tus Viajes',
    myJourneys: 'Mis Viajes',
    upcoming: 'Próximo',
    completed: 'Completado',
    past: 'Pasado',
    exploreCities: 'Explorar Ciudades'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
