const express = require('express');
const router = express.Router();
const { getAllUsers, deleteAnyBook, getAllBooksAdmin } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require admin access
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/books', getAllBooksAdmin);
router.delete('/books/:id', deleteAnyBook);

module.exports = router;
