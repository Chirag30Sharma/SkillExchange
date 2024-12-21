const express = require('express');
const router = express.Router();
const Chat = require('../schemas/chat');

router.post('/messages', async (req, res) => {
    const { sender, receiver, message } = req.body;

    try {
        let chat = await Chat.findOneAndUpdate(
            {
                $or: [
                    { sender, receiver },
                    { sender: receiver, receiver: sender },
                ],
            },
            {
                sender,
                receiver,
                $push: { messages: `${sender}$${message}` },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!chat) {
            chat = new Chat({ sender, receiver, messages: [`${sender}$${message}`] });
            await chat.save();
        }

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/messages/:sender/:receiver', async (req, res) => {
    const { sender, receiver } = req.params;

    try {
        const chat = await Chat.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        });

        if (!chat) {
            return res.status(200).json([]);
        }

        res.status(200).json(chat.messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;