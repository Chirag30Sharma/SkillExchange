const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;