const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    condition: {
        type: String,
        required: [true, 'Condition is required'],
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Engineering', 'Medical', 'Business', 'Arts', 'Science', 'Others'],
        default: 'Others'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: 'default-book.jpg'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
