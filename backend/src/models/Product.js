const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0.0,
    },
    stock: {
        type: Number,
        required: [true, 'Please add a stock quantity'],
        default: 0,
    },
    imageUrl: {
        type: String, // Path to local uploaded file
        required: [true, 'Please add an image'],
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
