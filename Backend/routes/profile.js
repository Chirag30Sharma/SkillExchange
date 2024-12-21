const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

router.post('/updateProfile', async (req, res) => {
    const { email, skills, certificate, work } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (skills) {
            user.skills = skills;
        }

        if (certificate) {
            user.certificate = certificate;
        }

        if (work) {
            user.work = work;
        }

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/getUser/:email', async (req, res) => {
    const email = req.params.email

    try {
        const data = await User.findOne({ email })

        if (!data) {
            return res.status(404).json({ error: 'User doesnt exist' })
        }

        res.status(200).json({ data })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/sendConnection', async (req, res) => {
    try {
        const { senderEmail, receiverEmail } = req.body;

        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'One or both users not found' });
        }

        if (receiver.madeConnection.includes(sender.email)) {
            return res.status(400).json({ message: 'Users are already connected' });
        }
        if (receiver.pendingConnection.includes(sender.email)) {
            return res.status(400).json({ message: 'Connection request already sent' });
        }

        receiver.pendingConnection.push(sender.email);
        await receiver.save();

        res.json({ message: 'Connection request sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/acceptConnection', async (req, res) => {
    try {
        const { senderEmail, receiverEmail } = req.body;

        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'One or both users not found' });
        }

        if (!receiver.pendingConnection.includes(sender.email)) {
            return res.status(400).json({ message: 'No pending connection request from this user' });
        }

        sender.madeConnection.push(receiver.email);

        receiver.pendingConnection = receiver.pendingConnection.filter(email => email !== sender.email);
        receiver.madeConnection.push(sender.email);

        await sender.save();
        await receiver.save();

        res.json({ message: 'Connection request accepted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;