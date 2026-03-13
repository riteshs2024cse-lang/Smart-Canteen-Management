// Add sample data for today
const mongoose = require('mongoose');
require('dotenv').config();
const FoodLog = require('./models/FoodLog');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

async function addTodayData() {
    try {
        // March 12, 2026
        const today = new Date('2026-03-12T12:00:00');
        
        const todayStr = today.toISOString().split('T')[0];
        const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
        
        console.log(`📅 Adding data for ${todayStr} (${dayName})`);
        
        // Remove any existing data for March 11 and March 12
        await FoodLog.deleteMany({ 
            date: { 
                $gte: new Date('2026-03-11T00:00:00'),
                $lte: new Date('2026-03-12T23:59:59')
            }
        });
        console.log('🗑️  Cleared March 11-12 data');
        
        // Sample data for today
        const todayLogs = [
            { date: today, foodItem: 'Rice', preparedQty: 145, consumedQty: 128, wastedQty: 17, dayOfWeek: dayName },
            { date: today, foodItem: 'Dal', preparedQty: 92, consumedQty: 85, wastedQty: 7, dayOfWeek: dayName },
            { date: today, foodItem: 'Chapati', preparedQty: 235, consumedQty: 218, wastedQty: 17, dayOfWeek: dayName },
            { date: today, foodItem: 'Sabzi', preparedQty: 105, consumedQty: 98, wastedQty: 7, dayOfWeek: dayName },
            { date: today, foodItem: 'Sambar', preparedQty: 78, consumedQty: 71, wastedQty: 7, dayOfWeek: dayName },
            { date: today, foodItem: 'Idli', preparedQty: 162, consumedQty: 145, wastedQty: 17, dayOfWeek: dayName }
        ];
        
        await FoodLog.insertMany(todayLogs);
        
        console.log(`✅ Added ${todayLogs.length} food logs for today`);
        console.log(`📊 Total Prepared: ${todayLogs.reduce((sum, log) => sum + log.preparedQty, 0)} kg`);
        console.log(`📊 Total Consumed: ${todayLogs.reduce((sum, log) => sum + log.consumedQty, 0)} kg`);
        console.log(`📊 Total Wasted: ${todayLogs.reduce((sum, log) => sum + log.wastedQty, 0)} kg`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

(async () => {
    await connectDB();
    await addTodayData();
})();
