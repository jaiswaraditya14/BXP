import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBooks: 0,
        requestsSent: 0,
        requestsReceived: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [booksRes, sentRes, receivedRes] = await Promise.all([
                axios.get(`${API_URL}/books/mybooks`),
                axios.get(`${API_URL}/exchanges/sent`),
                axios.get(`${API_URL}/exchanges/received`)
            ]);

            setStats({
                totalBooks: booksRes.data.data.length,
                requestsSent: sentRes.data.data.length,
                requestsReceived: receivedRes.data.data.length
            });

            // Combine some recent stuff to show as activity
            const combined = [
                ...sentRes.data.data.map(r => ({ ...r, type: 'sent' })),
                ...receivedRes.data.data.map(r => ({ ...r, type: 'received' }))
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

            setRecentActivity(combined);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-state"><div className="spinner-modern"></div></div>;

    return (
        <div className="dashboard-wrapper container fade-in">
            <header className="dashboard-header">
                <div className="welcome-box">
                    <h1>Hello, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span> 👋</h1>
                    <p>Manage your books and requests from your student command center.</p>
                </div>
                <div className="header-actions">
                    <Link to="/add-book" className="btn btn-primary">Add New Book</Link>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card-modern">
                    <div className="stat-icon-box blue">📚</div>
                    <div className="stat-info">
                        <h3>{stats.totalBooks}</h3>
                        <p>Books Listed</p>
                    </div>
                </div>
                <div className="stat-card-modern">
                    <div className="stat-icon-box pink">📤</div>
                    <div className="stat-info">
                        <h3>{stats.requestsSent}</h3>
                        <p>Requests Sent</p>
                    </div>
                </div>
                <div className="stat-card-modern">
                    <div className="stat-icon-box orange">📥</div>
                    <div className="stat-info">
                        <h3>{stats.requestsReceived}</h3>
                        <p>Requests Received</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid">
                <section className="activity-section">
                    <div className="section-header-inline">
                        <h2>Recent Activity</h2>
                        <Link to="/requests" className="view-all">View All Requests</Link>
                    </div>
                    <div className="activity-list">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, idx) => (
                                <div key={idx} className="activity-item">
                                    <div className={`status-dot ${activity.status.toLowerCase()}`}></div>
                                    <div className="activity-content">
                                        <p>
                                            <strong>{activity.type === 'sent' ? 'You' : activity.requester?.name}</strong> requested
                                            <strong> "{activity.book?.title}"</strong>
                                        </p>
                                        <span className="activity-time">{new Date(activity.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`status-badge ${activity.status.toLowerCase()}`}>{activity.status}</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-activity">
                                <p>No recent activity. Start by browsing the catalog!</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="quick-links">
                    <h2>Quick Links</h2>
                    <div className="links-grid">
                        <Link to="/profile" className="link-card">
                            <span className="link-icon">👤</span>
                            <span>My Profile</span>
                        </Link>
                        <Link to="/my-books" className="link-card">
                            <span className="link-icon">📖</span>
                            <span>My Inventory</span>
                        </Link>
                        <Link to="/" className="link-card">
                            <span className="link-icon">🔍</span>
                            <span>Browse Books</span>
                        </Link>
                        <Link to="/requests" className="link-card">
                            <span className="link-icon">📬</span>
                            <span>All Requests</span>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
