import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book, showActions = false, onDelete, onRequest, isOwner = false }) => {
    const defaultImg = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";

    return (
        <div className="attractive-card fade-in">
            <div className="card-media">
                <img
                    src={book.image && book.image !== 'default-book.jpg' ? book.image : defaultImg}
                    alt={book.title}
                    onError={(e) => { e.target.src = defaultImg; }}
                />
                <div className="card-condition-badge">
                    {book.condition}
                </div>
                <div className="card-category-tag">
                    {book.category}
                </div>
            </div>
            <div className="card-info">
                <div className="info-top">
                    <span className="info-author">By {book.author}</span>
                    <span className="info-price">₹{book.price}</span>
                </div>
                <h3 className="info-title">{book.title}</h3>

                <div className="card-footer">
                    {isOwner ? (
                        <button className="btn-action delete" onClick={() => onDelete(book._id)}>
                            Delete Listing
                        </button>
                    ) : (
                        <div className="action-row">
                            <button className="btn-action request" onClick={() => onRequest && onRequest(book)}>
                                Send Request
                            </button>
                            <Link to={`/book/${book._id}`} className="view-link">Details</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
