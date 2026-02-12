import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Requests.css';

const API_URL = 'http://localhost:5000/api';

const Requests = () => {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('received');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const [sent, received] = await Promise.all([
                axios.get(`${API_URL}/exchanges/sent`),
                axios.get(`${API_URL}/exchanges/received`)
            ]);
            setSentRequests(sent.data.data);
            setReceivedRequests(received.data.data);
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to load requests' });
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await axios.put(`${API_URL}/exchanges/${requestId}/accept`);
            setMessage({ type: 'success', text: 'Request accepted!' });
            fetchRequests();
        } catch (error) {
            setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to accept' });
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.put(`${API_URL}/exchanges/${requestId}/reject`);
            setMessage({ type: 'success', text: 'Request rejected' });
            fetchRequests();
        } catch (error) {
            setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to reject' });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Pending': 'badge-pending',
            'Accepted': 'badge-accepted',
            'Rejected': 'badge-rejected'
        };
        return badges[status] || 'badge-pending';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading requests...</p>
            </div>
        );
    }

    return (
        <div className="requests-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">📨 Book Requests</h1>
                    <p className="page-subtitle">Manage your book exchange requests</p>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type} fade-in`}>{message.text}</div>
                )}

                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
                        onClick={() => setActiveTab('received')}
                    >
                        📥 Received ({receivedRequests.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        📤 Sent ({sentRequests.length})
                    </button>
                </div>

                <div className="requests-list">
                    {activeTab === 'received' ? (
                        receivedRequests.length > 0 ? (
                            receivedRequests.map((request) => (
                                <div key={request._id} className="request-card fade-in">
                                    <div className="request-book">
                                        <div className="book-icon">📚</div>
                                        <div className="book-details">
                                            <h3>{request.book?.title}</h3>
                                            <p>by {request.book?.author}</p>
                                        </div>
                                    </div>
                                    <div className="request-info">
                                        <div className="requester">
                                            <span className="label">Requested by:</span>
                                            <span className="value">{request.requester?.name}</span>
                                            <span className="email">{request.requester?.email}</span>
                                        </div>
                                        <span className={`badge ${getStatusBadge(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    {request.status === 'Pending' && (
                                        <div className="request-actions">
                                            <button className="btn btn-success btn-sm" onClick={() => handleAccept(request._id)}>
                                                ✓ Accept
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(request._id)}>
                                                ✗ Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">📥</div>
                                <h3 className="empty-state-title">No received requests</h3>
                                <p className="empty-state-text">When someone requests your books, you'll see them here.</p>
                            </div>
                        )
                    ) : (
                        sentRequests.length > 0 ? (
                            sentRequests.map((request) => (
                                <div key={request._id} className="request-card fade-in">
                                    <div className="request-book">
                                        <div className="book-icon">📚</div>
                                        <div className="book-details">
                                            <h3>{request.book?.title}</h3>
                                            <p>by {request.book?.author}</p>
                                        </div>
                                    </div>
                                    <div className="request-info">
                                        <div className="requester">
                                            <span className="label">Owner:</span>
                                            <span className="value">{request.owner?.name}</span>
                                            <span className="email">{request.owner?.email}</span>
                                        </div>
                                        <span className={`badge ${getStatusBadge(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">📤</div>
                                <h3 className="empty-state-title">No sent requests</h3>
                                <p className="empty-state-text">Request books from the homepage to start exchanging!</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Requests;
