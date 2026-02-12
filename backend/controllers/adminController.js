const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Delete any book (admin)
// @route   DELETE /api/admin/books/:id
// @access  Private/Admin
const deleteAnyBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        await Book.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Book deleted by admin'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting book',
            error: error.message
        });
    }
};

// @desc    Get all books (admin view)
// @route   GET /api/admin/books
// @access  Private/Admin
const getAllBooksAdmin = async (req, res) => {
    try {
        const books = await Book.find()
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching books',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    deleteAnyBook,
    getAllBooksAdmin
};
