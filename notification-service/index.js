require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Notification = require('./models/Notification');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Notification Service connected to MongoDB'))
    .catch(err => console.error('❌ DB Error:', err));

// --- ROUTES ---

// 0. Root Route (To test if server is alive in browser)
app.get('/', (req, res) => {
    res.send('🚀 Notification Service is API Ready and Running!');
});

// 1. Send & Save Notification
app.post('/send', async (req, res) => {
    try {
        const { userId, message, type } = req.body;

        // Save to Database
        const newNotification = new Notification({ userId, message, type });
        await newNotification.save();

        console.log(`🔔 Notification saved for User ${userId}`);

        res.status(201).json({
            success: true,
            message: "Notification sent and saved!",
            data: newNotification
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Get Notifications for a specific User (For the Android Inbox)
app.get('/user/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete a specific notification by ID
app.delete('/delete/:id', async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Notification deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Server Setup
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`🚀 Notification Service running on port ${PORT}`);
});