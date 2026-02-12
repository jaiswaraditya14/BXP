import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import './Home.css';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [books, setBooks] = useState([]);
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
        fetchFeaturedBooks();
    }, []);

    const fetchBooks = async (category = 'All') => {
        try {
            setLoading(true);
            const url = category === 'All'
                ? `${API_URL}/books`
                : `${API_URL}/books?category=${category}`;
            const response = await axios.get(url);
            setBooks(response.data.data);
            setFilteredBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeaturedBooks = async () => {
        try {
            const response = await axios.get(`${API_URL}/books?featured=true&limit=3`);
            setFeaturedBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching featured books:', error);
        }
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        fetchBooks(category);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term)
        );
        setFilteredBooks(filtered);
    };

    return (
        <div className="home-wrapper">
            <div className="blob-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <section className="hero-modern container">
                <div className="hero-content fade-in">
                    <span className="hero-tag">✨ Most Trusted Student Platform</span>
                    <h1 className="hero-title">
                        Upgrade Your Library <br />
                        With <span className="gradient-text">BookExchange</span>
                    </h1>
                    <p className="hero-subtitle">
                        Exchange books with fellow students effortlessly. Save money,
                        share knowledge, and help the community grow.
                    </p>
                    <div className="hero-actions">
                        <Link to={isAuthenticated ? "/add-book" : "/register"} className="btn btn-primary">
                            {isAuthenticated ? "List a Book" : "Get Started Now"}
                        </Link>
                        <a href="#catalog" className="btn btn-glass">Browse Catalog</a>
                    </div>
                </div>
                <div className="hero-visual fade-in">
                    <div className="visual-card floating">
                        <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" alt="Books" />
                        <div className="visual-badge">
                            <span>📚 500+ New Arrivals</span>
                        </div>
                    </div>
                </div>
            </section>

            {featuredBooks.length > 0 && (
                <section className="featured-section container fade-in">
                    <div className="section-header-centered">
                        <span className="section-subtitle">Editor's Choice</span>
                        <h2 className="section-title">Trending Books</h2>
                    </div>
                    <div className="featured-grid">
                        {featuredBooks.map(book => (
                            <BookCard key={book._id} book={book} showActions={true} />
                        ))}
                    </div>
                </section>
            )}

            <section id="catalog" className="catalog-modern container">
                <div className="catalog-header">
                    <div className="catalog-titles">
                        <h2 className="section-title">Explore Catalog</h2>
                        <div className="category-pills">
                            {['All', 'Engineering', 'Medical', 'Business', 'Arts', 'Science', 'Others'].map(cat => (
                                <button
                                    key={cat}
                                    className={`pill ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="search-box-modern">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by title, author..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-modern"></div>
                        <p>Loading your next favorite read...</p>
                    </div>
                ) : (
                    <div className="books-grid-attractive">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <BookCard
                                    key={book._id}
                                    book={book}
                                    showActions={true}
                                />
                            ))
                        ) : (
                            <div className="empty-state-card">
                                <h3>No books found</h3>
                                <p>Try searching for something else or add a new book!</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
