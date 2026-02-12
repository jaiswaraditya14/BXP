import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyBooks.css';

const API_URL = 'http://localhost:5000/api';

const MyBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchMyBooks();
    }, []);

    const fetchMyBooks = async () => {
        try {
            const response = await axios.get(`${API_URL}/books/user/my-books`);
            setBooks(response.data.data);
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to load your books' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/books/${bookId}`);
            setBooks(books.filter(book => book._id !== bookId));
            setMessage({ type: 'success', text: 'Book deleted successfully' });
        } catch (error) {
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Failed to delete book'
            });
        }
    };

    const getConditionClass = (condition) => {
        const classes = {
            'New': 'badge-new',
            'Like New': 'badge-new',
            'Good': 'badge-good',
            'Fair': 'badge-fair',
            'Poor': 'badge-fair'
        };
        return classes[condition] || 'badge-fair';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your books...</p>
            </div>
        );
    }

    return (
        <div className="my-books-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">📖 My Books</h1>
                        <p className="page-subtitle">Manage your listed books</p>
                    </div>
                    <Link to="/add-book" className="btn btn-primary">
                        ➕ Add New Book
                    </Link>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type} fade-in`}>
                        {message.text}
                    </div>
                )}

                {books.length > 0 ? (
                    <div className="my-books-grid">
                        {books.map((book) => (
                            <div key={book._id} className="my-book-card fade-in">
                                <div className="book-image">
                                    {book.image && book.image !== 'default-book.jpg' ? (
                                        <img src={book.image} alt={book.title} />
                                    ) : (
                                        <div className="book-placeholder">📚</div>
                                    )}
                                    <span className={`badge ${getConditionClass(book.condition)}`}>
                                        {book.condition}
                                    </span>
                                    <span className={`availability-badge ${book.available ? 'available' : 'unavailable'}`}>
                                        {book.available ? '✓ Available' : '✗ Exchanged'}
                                    </span>
                                </div>

                                <div className="book-info">
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">by {book.author}</p>
                                    <p className="book-price">₹{book.price}</p>

                                    <div className="book-actions">
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(book._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📚</div>
                        <h3 className="empty-state-title">No books listed yet</h3>
                        <p className="empty-state-text">
                            Start sharing books with your fellow students!
                        </p>
                        <Link to="/add-book" className="btn btn-primary">
                            ➕ Add Your First Book
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBooks;
