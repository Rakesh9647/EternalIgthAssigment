const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)   