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
    manageAccount: 'Manage your account preferences and global settings.'
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
    manageAccount: 'Administra tus preferencias de cuenta y ajustes globales.'
  },
  French: {
    dashboard: 'Tableau de bord',
    estimateExplore: 'Estimer & Explorer',
    settingsProfile: 'Paramètres et Profil',
    logout: 'Déconnexion',
    signUp: 'S\'inscrire',
    login: 'Connexion',
    preferences: 'Préférences',
    displayCurrency: 'Devise d\'affichage',
    language: 'Langue',
    notifications: 'Notifications',
    pushNotifications: 'Notifications Push',
    dangerZone: 'Zone de Danger',
    deleteAccount: 'Supprimer le Compte',
    manageAccount: 'Gérez les préférences de votre compte.'
  },
  German: {
    dashboard: 'Armaturenbrett',
    estimateExplore: 'Schätzen & Erkunden',
    settingsProfile: 'Einstellungen & Profil',
    logout: 'Abmelden',
    signUp: 'Registrieren',
    login: 'Anmelden',
    preferences: 'Präferenzen',
    displayCurrency: 'Währung',
    language: 'Sprache',
    notifications: 'Benachrichtigungen',
    pushNotifications: 'Push-Benachrichtigungen',
    dangerZone: 'Gefahrenzone',
    deleteAccount: 'Konto löschen',
    manageAccount: 'Verwalten Sie Ihre Kontoeinstellungen.'
  },
  Hindi: {
    dashboard: 'डैशबोर्ड',
    estimateExplore: 'अनुमान और अन्वेषण',
    settingsProfile: 'सेटिंग्स और प्रोफाइल',
    logout: 'लॉग आउट',
    signUp: 'साइन अप',
    login: 'लॉग इन',
    preferences: 'प्राथमिकताएं',
    displayCurrency: 'मुद्रा',
    language: 'भाषा',
    notifications: 'सूचनाएं',
    pushNotifications: 'पुश सूचनाएं',
    dangerZone: 'खतरे का क्षेत्र',
    deleteAccount: 'खाता हटाएं',
    manageAccount: 'अपनी खाता प्राथमिकताएं प्रबंधित करें।'
  },
  Japanese: {
    dashboard: 'ダッシュボード',
    estimateExplore: '見積もりと探索',
    settingsProfile: '設定とプロフィール',
    logout: 'ログアウト',
    signUp: 'サインアップ',
    login: 'ログイン',
    preferences: '設定',
    displayCurrency: '表示通貨',
    language: '言語',
    notifications: '通知',
    pushNotifications: 'プッシュ通知',
    dangerZone: '危険地帯',
    deleteAccount: 'アカウントを削除',
    manageAccount: 'アカウント設定を管理します。'
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
