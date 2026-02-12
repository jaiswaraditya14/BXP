const express = require('express');
const router = express.Router();
const {
    requestBook,
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest
} = require('../controllers/exchangeController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/request/:bookId', requestBook);
router.get('/sent', getSentRequests);
router.get('/received', getReceivedRequests);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);

module.exports = router;
