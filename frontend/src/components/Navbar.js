import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`modern-nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-box">
                <Link to="/" className="nav-brand">
                    <span className="brand-logo">📚</span>
                    <span className="brand-name">Book<span className="highlight">Exchange</span></span>
                </Link>

                <div className="nav-items">
                    <Link to="/" className="nav-link">Explore</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/my-books" className="nav-link">My Inventory</Link>
                            <Link to="/requests" className="nav-link">Requests</Link>
                            <div className="user-dropdown">
                                <Link to="/profile" className="nav-user-profile">
                                    <div className="nav-avatar">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
                                </Link>
                                <button onClick={handleLogout} className="logout-mini">Logout</button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-group">
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
