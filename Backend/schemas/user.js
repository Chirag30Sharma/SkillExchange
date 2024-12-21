const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    certificate: {
        type: [String],
        default: []
    },
    university: {
        type: String
    },
    degree: {
        type: String
    },
    work: {
        type: [String],
        default: []
    },
    yearOfGrad: {
        type: Number
    },
    madeConnection: {
        type: [String],
        default: []
    },
    pendingConnection: {
        type: [String],
        default: []
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;