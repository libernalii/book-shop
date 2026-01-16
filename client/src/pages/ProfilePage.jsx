import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfilePage.scss';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [message, setMessage] = useState('');

  const handleSave = () => {
    // Тут можна додати API-запит для оновлення профілю
    setMessage('Зміни збережено!');
    setEditMode(false);
  };

  return (
    <div className="profile-page container">
      <div className="profile-card">
        <div className="avatar">
          {user?.fullName?.[0].toUpperCase() || 'U'}
        </div>

        <div className="profile-info">
          <h2>{user?.fullName}</h2>
          <p><strong>Email:</strong> {user?.email}</p>

          {editMode ? (
            <>
              <div className="input-group">
                <label>ПІБ:</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Телефон:</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Адреса:</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <button className="btn save-btn" onClick={handleSave}>Зберегти</button>
            </>
          ) : (
            <>
              <p><strong>Телефон:</strong> {user?.phone || '-'}</p>
              <p><strong>Адреса:</strong> {user?.address || '-'}</p>
              <button className="btn edit-btn" onClick={() => setEditMode(true)}>Редагувати</button>
            </>
          )}

          <button className="btn logout-btn" onClick={logout}>Вийти</button>
          {message && <p className="success-message">{message}</p>}
        </div>
        <Link to="/orders" className="profile-link">
        📦 Мої замовлення
      </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
