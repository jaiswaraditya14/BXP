import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="clean-footer">
            <div className="container footer-grid">
                <div className="footer-left">
                    <span className="footer-logo">BookExchange</span>
                    <p>Building a sustainable student community through book sharing.</p>
                </div>
                <div className="footer-right">
                    <p>© {new Date().getFullYear()} Student Portal. Built with care.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
