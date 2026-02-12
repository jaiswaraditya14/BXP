const express = require('express');
const router = express.Router();
const {
    getAllBooks,
    searchBooks,
    getBook,
    addBook,
    getMyBooks,
    deleteBook
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBook);

// Protected routes
router.post('/', protect, addBook);
router.get('/user/my-books', protect, getMyBooks);
router.delete('/:id', protect, deleteBook);

module.exports = router;
