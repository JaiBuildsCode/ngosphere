const mongoose = require('mongoose');

const NGOSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String },
    founder: { type: String, required: true },
    established: { type: String },
    phone: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, // Prevents duplicate NGO registrations
        lowercase: true,
        trim: true
    },
    website: { type: String },
    
    // FUNDRAISING FIELDS
    raised: { type: Number, default: 0 },
    goal: { type: Number, default: 100000 }, 
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], // Locks down allowed status values
        default: 'Pending' 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.models.NGO || mongoose.model('NGO', NGOSchema);