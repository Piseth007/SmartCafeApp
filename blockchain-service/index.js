require('dotenv').config();
const express = require('express');
const crypto = require('crypto'); // Built-in Node.js module
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB Connection using your .env URI
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Blockchain Service connected to Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Block Schema (The 'Object' we are decorating)
const BlockSchema = new mongoose.Schema({
    index: Number,
    timestamp: String,
    data: Object, // This holds the transaction (e.g., Order details)
    previousHash: String,
    hash: String
});
const Block = mongoose.model('Block', BlockSchema);

// SHA-256 Hashing Operation
const calculateHash = (index, previousHash, timestamp, data) => {
    return crypto.createHash('sha256')
        .update(index + previousHash + timestamp + JSON.stringify(data))
        .digest('hex');
};

// Route to add a secure transaction
app.post('/mineBlock', async (req, res) => {
    try {
        const lastBlock = await Block.findOne().sort({ index: -1 });
        const index = lastBlock ? lastBlock.index + 1 : 0;
        const previousHash = lastBlock ? lastBlock.hash : "0";
        const timestamp = new Date().toISOString();
        const data = req.body;
        
        // The Decorator behavior: wrapping data with a security hash
        const hash = calculateHash(index, previousHash, timestamp, data);

        const newBlock = new Block({ index, timestamp, data, previousHash, hash });
        await newBlock.save();

        res.json({ message: "Secure Block Added", block: newBlock });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
});
app.get('/blocks', async (req, res) => {
    const blocks = await Block.find().sort({ index: 1 });
    res.json(blocks);
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`🛡️ Blockchain Service active on Port ${PORT}`));