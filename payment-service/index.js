require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Payment = require('./models/Payment');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Payment Service connected to MongoDB'))
    .catch(err => console.error('❌ Payment Service DB Error:', err));

// --- ROUTES ---

// Process a Payment
app.post('/process', async (req, res) => {
    try {
        const { orderId, amount, paymentMethod } = req.body;

        // In a real app, you would integrate Stripe/PayPal here
        // For now, we simulate a successful transaction
        const newPayment = new Payment({
            orderId,
            amount,
            paymentMethod,
            status: 'completed',
            transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });

        await newPayment.save();
        res.status(201).json({ 
            success: true, 
            message: "Payment processed successfully!", 
            transaction: newPayment 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get Payment History for an Order
app.get('/status/:orderId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        if (!payment) return res.status(404).json({ message: "Payment record not found" });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`🚀 Payment Service running on port ${PORT}`);
});