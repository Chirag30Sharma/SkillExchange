const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.get('/all', async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/find', async (req, res) => {
    const { skills, university } = req.body;
    try {
        const filters = {};

        if (skills) {
            filters.skills = { $in: skills.split(',') };
        }

        if (university) {
            filters.university = university;
        }
        const users = await User.find(filters, {});

        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;