const express = require('express');
const router = express.Router();
const Event = require('../schemas/event');

router.post('/create', async (req, res) => {
    const { name, category, desc, location, time } = req.body;

    try {
        const newEvent = new Event({ name, category, desc, location, time });
        await newEvent.save();
        res.status(200).json({ message: 'Event created successfully', event: newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/filter', async (req, res) => {
    const { category } = req.body;
    try {
        let events;
        if (category) {
            events = await Event.find({ category });
        } else {
            events = await Event.find();
        }
        if (events == "") {
            res.status(404).json({ error: "No events with that category found" });
        } else {
            res.status(200).json({ events });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;