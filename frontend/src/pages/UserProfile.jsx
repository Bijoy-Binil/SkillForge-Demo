import { useState, useEffect } from 'react';
import { UserCircleIcon, EnvelopeIcon, IdentificationIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import authService from '../api/authService';
import './UserProfile.css'; // Import the CSS file

export default function UserProfile() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', profile_image: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        profile_image: user.profile_image || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.updateProfile(form);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="user-profile-loading">
        <IdentificationIcon className="user-profile-spinner" />
        <div className="user-profile-loading-text">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        {form.profile_image ? (
          <img src={form.profile_image} alt="Profile" className="user-profile-image" />
        ) : (
          <UserCircleIcon className="user-profile-icon" />
        )}
        <div>
          <div className="user-profile-name">{user.first_name} {user.last_name}</div>
          <div className="user-profile-email">
            <EnvelopeIcon className="user-profile-email-icon" /> {user.email}
          </div>
          <div className="user-profile-role">
            {user.is_superuser ? 'Superuser' : user.is_staff ? 'Admin' : 'User'}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="user-profile-form">
        <div className="user-profile-form-group">
          <label className="user-profile-label">First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="user-profile-input"
            required
          />
        </div>
        <div className="user-profile-form-group">
          <label className="user-profile-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="user-profile-input"
            required
          />
        </div>
        <div className="user-profile-form-group">
          <label className="user-profile-label">Profile Image URL</label>
          <input
            type="text"
            name="profile_image"
            value={form.profile_image}
            onChange={handleChange}
            className="user-profile-input"
            placeholder="https://..."
          />
        </div>
        <button
          type="submit"
          className="user-profile-button"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {success && (
          <div className="user-profile-success">
            <CheckCircleIcon className="user-profile-success-icon" /> {success}
          </div>
        )}
        {error && (
          <div className="user-profile-error">{error}</div>
        )}
      </form>
    </div>
  );
}
