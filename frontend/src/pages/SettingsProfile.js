import React, { useState, useRef } from 'react';
import { Camera, Mail, Shield, Bell, Globe, DollarSign, Trash2, LogOut, Check, Image as ImageIcon, Video, X } from 'lucide-react';
import './SettingsProfile.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SettingsProfile = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);

  // Avatar state
  const [avatar, setAvatar] = useState(localStorage.getItem('avatarUrl') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem('avatarUrl', reader.result);
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setAvatar(dataUrl);
      localStorage.setItem('avatarUrl', dataUrl);
      stopCamera();
      setShowAvatarModal(false);
    }
  };

  const closeAvatarModal = () => {
    stopCamera();
    setShowAvatarModal(false);
  };

  const confirmDeleteAccount = () => {
    if (deleteConfirm === 'DELETE') {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="container settings-workspace">
      <div className="settings-header">
        <h1 className="gradient-text">{t('settingsProfile')}</h1>
        <p>{t('manageAccount')}</p>
      </div>

      <div className="settings-grid">
        {/* Profile Card */}
        <div className="profile-card glass-panel">
          <div className="profile-hero">
            <div className="avatar-container">
              <div className="avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
              <button className="avatar-edit-overlay" onClick={() => setShowAvatarModal(true)}>
                <Camera size={20} />
              </button>
            </div>
            <div className="tier-badge">Pro Explorer</div>
          </div>
          <div className="profile-details">
            <h2>{localStorage.getItem('userEmail') || 'Traveler'}</h2>
            <div className="metadata-chips">
              <span className="chip"><Shield size={14}/> Verified</span>
              <span className="chip"><Mail size={14}/> Subscribed</span>
            </div>
          </div>
          <button className="btn btn-secondary w-100" style={{ marginTop: '24px' }} onClick={handleLogout}>
            <LogOut size={16}/> {t('logout')}
          </button>
        </div>

        {/* Settings Sections */}
        <div className="settings-sections">
          
          <div className="settings-group glass-panel">
            <h3><Globe size={18}/> {t('preferences')}</h3>
            <div className="setting-tile">
              <div className="setting-info">
                <label>{t('displayCurrency')}</label>
                <span>Select your default global currency</span>
              </div>
              <select className="form-input" style={{ width: 'auto' }} value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            
            <div className="setting-tile">
              <div className="setting-info">
                <label>{t('language')}</label>
                <span>Application interface language</span>
              </div>
              <select className="form-input" style={{ width: 'auto' }} value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="English">English</option>
                <option value="French">Français</option>
                <option value="Spanish">Español</option>
                <option value="German">Deutsch</option>
                <option value="Hindi">हिन्दी</option>
                <option value="Japanese">日本語</option>
              </select>
            </div>
          </div>

          <div className="settings-group glass-panel">
            <h3><Bell size={18}/> {t('notifications')}</h3>
            <div className="setting-tile">
              <div className="setting-info">
                <label>{t('pushNotifications')}</label>
                <span>Trip reminders and budget alerts</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="settings-group glass-panel danger-zone">
            <h3 className="text-danger"><Trash2 size={18}/> {t('dangerZone')}</h3>
            <div className="setting-tile">
              <div className="setting-info">
                <label className="text-danger">{t('deleteAccount')}</label>
                <span>Permanently remove your account and all trips</span>
              </div>
              <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>{t('deleteAccount')}</button>
            </div>
          </div>

        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass-panel" style={{ maxWidth: '400px', padding: '32px' }}>
            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Update Profile Photo</h3>
              <button onClick={closeAvatarModal} className="btn-icon" style={{ color: 'white' }}><X size={20}/></button>
            </div>
            
            {!showCamera ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button className="btn btn-primary w-100" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <ImageIcon size={18}/> Upload from Gallery
                </button>
                <button className="btn btn-secondary w-100" onClick={startCamera} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <Video size={18}/> Take Photo
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', background: 'black' }}></video>
                <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={stopCamera}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={capturePhoto}>Capture</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass-panel" style={{ maxWidth: '500px', padding: '32px' }}>
            <h2 className="text-danger" style={{ marginBottom: '16px' }}><Trash2 size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> {t('deleteAccount')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              This action cannot be undone. All your trips, itineraries, and saved budgets will be permanently removed.
            </p>
            <p style={{ marginBottom: '16px', fontWeight: 600 }}>Type "DELETE" to confirm:</p>
            <input 
              type="text" 
              className="form-input" 
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              style={{ marginBottom: '24px' }}
            />
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}>Cancel</button>
              <button className="btn btn-danger" disabled={deleteConfirm !== 'DELETE'} onClick={confirmDeleteAccount}>Yes, Delete My Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsProfile;
