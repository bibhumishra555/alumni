const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: String,
        required: true,
        enum: ['UG', 'PG']
    },
    department: {
        type: String,
        required: true
    },
    regNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passingYear: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);