const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Array,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;