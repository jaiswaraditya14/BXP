const Book = require('../models/Book');

// @desc    Get all available books
// @route   GET /api/books
// @access  Public
const getAllBooks = async (req, res) => {
    try {
        const { category, featured, limit } = req.query;
        let query = { available: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        let booksQuery = Book.find(query).populate('owner', 'name email');

        if (limit) {
            booksQuery = booksQuery.limit(parseInt(limit));
        }

        const books = await booksQuery.sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching books',
            error: error.message
        });
    }
};

// @desc    Search books by title
// @route   GET /api/books/search?title=
// @access  Public
const searchBooks = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search term'
            });
        }

        const books = await Book.find({
            title: { $regex: title, $options: 'i' },
            available: true
        })
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching books',
            error: error.message
        });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('owner', 'name email phone');

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching book',
            error: error.message
        });
    }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
    try {
        const { title, author, price, condition, image } = req.body;

        const book = await Book.create({
            title,
            author,
            price,
            condition,
            image: image || 'default-book.jpg',
            owner: req.user._id
        });

        const populatedBook = await Book.findById(book._id)
            .populate('owner', 'name email phone');

        res.status(201).json({
            success: true,
            message: 'Book added successfully',
            data: populatedBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding book',
            error: error.message
        });
    }
};

// @desc    Get user's own books
// @route   GET /api/books/my-books
// @access  Private
const getMyBooks = async (req, res) => {
    try {
        const books = await Book.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your books',
            error: error.message
        });
    }
};

// @desc    Delete a book (only owner can delete)
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Check if user is the owner
        if (book.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own books'
            });
        }

        await Book.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting book',
            error: error.message
        });
    }
};

module.exports = {
    getAllBooks,
    searchBooks,
    getBook,
    addBook,
    getMyBooks,
    deleteBook
};
