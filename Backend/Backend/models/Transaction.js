const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    // Using String allows for real Atlas IDs and custom platform identifiers
    ngoId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true,
        unique: true // Prevents duplicate entry for the same payment
    },
    status: {
        type: String,
        default: 'success'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Exporting with a check to prevent model overwrite errors during development
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);