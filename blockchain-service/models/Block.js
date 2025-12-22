const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    data: { type: Object, required: true }, // Stores transaction/order info
    prevHash: { type: String, required: true }, // Links to the previous block
    hash: { type: String, required: true }      // Unique fingerprint of this block
});

module.exports = mongoose.model('Block', BlockSchema);