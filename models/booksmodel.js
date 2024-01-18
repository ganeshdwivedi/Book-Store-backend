const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    thumbnail: { type: String, required: true },
    type: { type: String, required: true },
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;