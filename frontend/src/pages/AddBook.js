import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddBook.css';

const API_URL = 'http://localhost:5000/api';

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        condition: 'Good',
        category: 'Others',
        image: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.post(`${API_URL}/books`, {
                ...formData,
                price: parseFloat(formData.price)
            });

            setMessage({ type: 'success', text: 'Book added successfully!' });

            setTimeout(() => {
                navigate('/my-books');
            }, 1500);
        } catch (error) {
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Failed to add book'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-book-page">
            <div className="container">
                <div className="add-book-card fade-in">
                    <div className="card-header">
                        <div className="header-icon">📖</div>
                        <h1>Add New Book</h1>
                        <p>Share your book with fellow students</p>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="add-book-form">
                        <div className="form-group">
                            <label className="form-label">Book Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder="Enter book title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Author Name *</label>
                            <input
                                type="text"
                                name="author"
                                className="form-input"
                                placeholder="Enter author name"
                                value={formData.author}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="form-input"
                                    placeholder="Enter price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="1"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Condition *</label>
                                <select
                                    name="condition"
                                    className="form-select"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="New">New</option>
                                    <option value="Like New">Like New</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="Others">Others</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Medical">Medical</option>
                                    <option value="Business">Business</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Science">Science</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Image URL (Optional)</label>
                            <input
                                type="url"
                                name="image"
                                className="form-input"
                                placeholder="Enter image URL (e.g., https://example.com/book.jpg)"
                                value={formData.image}
                                onChange={handleChange}
                            />
                            <small className="form-hint">
                                You can use any image URL or leave blank for default image
                            </small>
                        </div>

                        {formData.image && (
                            <div className="image-preview">
                                <img src={formData.image} alt="Book preview" />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Adding Book...' : '➕ Add Book'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
