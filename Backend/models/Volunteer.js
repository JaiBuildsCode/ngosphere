const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, default: 'Volunteer' },
    availability: { type: String, default: 'Any' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);
