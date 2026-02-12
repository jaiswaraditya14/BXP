import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const API_URL = 'http://localhost:5000/api';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, booksRes] = await Promise.all([
                axios.get(`${API_URL}/admin/users`),
                axios.get(`${API_URL}/admin/books`)
            ]);
            setUsers(usersRes.data.data);
            setBooks(booksRes.data.data);
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            await axios.delete(`${API_URL}/admin/books/${bookId}`);
            setBooks(books.filter(book => book._id !== bookId));
            setMessage({ type: 'success', text: 'Book deleted successfully' });
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to delete book' });
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading admin panel...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">👑 Admin Dashboard</h1>
                    <p className="page-subtitle">Manage users and books</p>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type} fade-in`}>{message.text}</div>
                )}

                <div className="admin-stats">
                    <div className="stat-card">
                        <span className="stat-icon">👥</span>
                        <div className="stat-info">
                            <span className="stat-value">{users.length}</span>
                            <span className="stat-label">Students</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">📚</span>
                        <div className="stat-info">
                            <span className="stat-value">{books.length}</span>
                            <span className="stat-label">Books</span>
                        </div>
                    </div>
                </div>

                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users ({users.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
                        onClick={() => setActiveTab('books')}
                    >
                        📚 Books ({books.length})
                    </button>
                </div>

                {activeTab === 'users' ? (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Price</th>
                                    <th>Owner</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book._id}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>₹{book.price}</td>
                                        <td>{book.owner?.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteBook(book._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
