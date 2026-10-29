const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    ngoId: {
        type: String,
        default: 'GLOBAL_PLATFORM_DONATION'
    },
    donorName: {
        type: String,
        default: 'Anonymous'
    },
    amount: {
        type: Number,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        unique: true,
        sparse: true
    },
    stripeSessionId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripePaymentIntentId: String,
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'success'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Exporting with a check to prevent model overwrite errors during development
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);