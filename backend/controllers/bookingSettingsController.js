const BookingSettings = require('../models/BookingSettings');

// Get current booking settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await BookingSettings.getSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching booking settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking settings',
            error: error.message
        });
    }
};

// Update booking settings
exports.updateSettings = async (req, res) => {
    try {
        const { isBookingEnabled, closureMessage } = req.body;
        
        const updates = {};
        if (typeof isBookingEnabled !== 'undefined') {
            updates.isBookingEnabled = isBookingEnabled;
        }
        if (closureMessage) {
            updates.closureMessage = closureMessage;
        }
        
        const settings = await BookingSettings.updateSettings(updates);
        
        res.json({
            success: true,
            message: `Pre-booking ${settings.isBookingEnabled ? 'enabled' : 'disabled'} successfully`,
            data: settings
        });
    } catch (error) {
        console.error('Error updating booking settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking settings',
            error: error.message
        });
    }
};

// Toggle booking status
exports.toggleBooking = async (req, res) => {
    try {
        const settings = await BookingSettings.getSettings();
        settings.isBookingEnabled = !settings.isBookingEnabled;
        settings.lastUpdated = new Date();
        await settings.save();
        
        res.json({
            success: true,
            message: `Pre-booking ${settings.isBookingEnabled ? 'enabled' : 'disabled'} successfully`,
            data: settings
        });
    } catch (error) {
        console.error('Error toggling booking status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle booking status',
            error: error.message
        });
    }
};
