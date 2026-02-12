import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateProfile(formData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } else {
            setMessage({ type: 'danger', text: result.message });
        }
        setLoading(false);
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card fade-in">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="profile-name">{user?.name}</h1>
                        <span className={`profile-role badge ${user?.role === 'admin' ? 'badge-accepted' : 'badge-pending'}`}>
                            {user?.role === 'admin' ? '👑 Admin' : '🎓 Student'}
                        </span>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    {!isEditing ? (
                        <div className="profile-info">
                            <div className="info-item">
                                <span className="info-icon">📧</span>
                                <div className="info-content">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{user?.email}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-icon">📱</span>
                                <div className="info-content">
                                    <span className="info-label">Phone</span>
                                    <span className="info-value">{user?.phone}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-icon">👤</span>
                                <div className="info-content">
                                    <span className="info-label">Name</span>
                                    <span className="info-value">{user?.name}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditing(true)}
                            >
                                ✏️ Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label className="form-label">Email (cannot be changed)</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={user?.email}
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : '💾 Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
