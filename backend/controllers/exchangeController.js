const Exchange = require('../models/Exchange');
const Book = require('../models/Book');

// @desc    Request a book
// @route   POST /api/exchanges/request/:bookId
// @access  Private
const requestBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { message } = req.body;

        // Find the book
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Check if book is available
        if (!book.available) {
            return res.status(400).json({
                success: false,
                message: 'This book is not available for exchange'
            });
        }

        // Prevent requesting own book
        if (book.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot request your own book'
            });
        }

        // Check if already requested
        const existingRequest = await Exchange.findOne({
            book: bookId,
            requester: req.user._id,
            status: 'Pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending request for this book'
            });
        }

        // Create exchange request
        const exchange = await Exchange.create({
            book: bookId,
            requester: req.user._id,
            owner: book.owner,
            message: message || ''
        });

        const populatedExchange = await Exchange.findById(exchange._id)
            .populate('book', 'title author price condition image')
            .populate('requester', 'name email phone')
            .populate('owner', 'name email phone');

        res.status(201).json({
            success: true,
            message: 'Book request sent successfully',
            data: populatedExchange
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error requesting book',
            error: error.message
        });
    }
};

// @desc    Get sent requests (requests I made)
// @route   GET /api/exchanges/sent
// @access  Private
const getSentRequests = async (req, res) => {
    try {
        const requests = await Exchange.find({ requester: req.user._id })
            .populate('book', 'title author price condition image')
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching sent requests',
            error: error.message
        });
    }
};

// @desc    Get received requests (requests for my books)
// @route   GET /api/exchanges/received
// @access  Private
const getReceivedRequests = async (req, res) => {
    try {
        const requests = await Exchange.find({ owner: req.user._id })
            .populate('book', 'title author price condition image')
            .populate('requester', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching received requests',
            error: error.message
        });
    }
};

// @desc    Accept a book request
// @route   PUT /api/exchanges/:id/accept
// @access  Private
const acceptRequest = async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Check if user is the owner
        if (exchange.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the book owner can accept requests'
            });
        }

        // Check if already processed
        if (exchange.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'This request has already been processed'
            });
        }

        // Update status
        exchange.status = 'Accepted';
        await exchange.save();

        // Mark book as unavailable
        await Book.findByIdAndUpdate(exchange.book, { available: false });

        const populatedExchange = await Exchange.findById(exchange._id)
            .populate('book', 'title author price condition image')
            .populate('requester', 'name email phone')
            .populate('owner', 'name email phone');

        res.status(200).json({
            success: true,
            message: 'Request accepted successfully',
            data: populatedExchange
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error accepting request',
            error: error.message
        });
    }
};

// @desc    Reject a book request
// @route   PUT /api/exchanges/:id/reject
// @access  Private
const rejectRequest = async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Check if user is the owner
        if (exchange.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the book owner can reject requests'
            });
        }

        // Check if already processed
        if (exchange.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'This request has already been processed'
            });
        }

        // Update status
        exchange.status = 'Rejected';
        await exchange.save();

        const populatedExchange = await Exchange.findById(exchange._id)
            .populate('book', 'title author price condition image')
            .populate('requester', 'name email phone')
            .populate('owner', 'name email phone');

        res.status(200).json({
            success: true,
            message: 'Request rejected',
            data: populatedExchange
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting request',
            error: error.message
        });
    }
};

module.exports = {
    requestBook,
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest
};
