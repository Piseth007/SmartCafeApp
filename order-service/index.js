require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Order = require('./models/Order');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Order Service connected to MongoDB'))
    .catch(err => console.error(err));

// Create New Order
app.post('/create', async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        const newOrder = new Order({ userId, items, totalAmount });
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Order Service running on port ${PORT}`));