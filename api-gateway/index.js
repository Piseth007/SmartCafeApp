require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// --- GATEWAY ROUTING (The "Wrappers") ---

// Health check
app.get('/', (req, res) => res.send('🚀 Smart Cafe API Gateway is Online'));

// Forwarding requests to individual "Components"
app.use('/auth', proxy('http://localhost:5001'));
app.use('/orders', proxy('http://localhost:5002'));
app.use('/payments', proxy('http://localhost:5003'));
app.use('/blockchain', proxy('http://localhost:5004')); // This handles /blockchain/mineBlock automatically
app.use('/notifications', proxy('http://localhost:5005'));
app.use('/ai', proxy('http://localhost:8001')); // Don't forget your Python AI service!

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ API Gateway running on port ${PORT}`);
});