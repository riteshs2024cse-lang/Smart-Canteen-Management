const mongoose = require('mongoose');

const bookingSettingsSchema = new mongoose.Schema({
    isBookingEnabled: {
        type: Boolean,
        default: true
    },
    closureMessage: {
        type: String,
        default: 'Pre-booking is currently closed. Please check back later.'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
bookingSettingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({ isBookingEnabled: true });
    }
    return settings;
};

bookingSettingsSchema.statics.updateSettings = async function(updates) {
    let settings = await this.getSettings();
    Object.assign(settings, updates);
    settings.lastUpdated = new Date();
    await settings.save();
    return settings;
};

module.exports = mongoose.model('BookingSettings', bookingSettingsSchema);
