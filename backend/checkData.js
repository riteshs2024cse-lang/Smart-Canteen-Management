// Check what data exists in the database
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

async function checkData() {
    try {
        // Check all data
        const allLogs = await FoodLog.find().sort({ date: -1 }).limit(10);
        console.log('\n📊 Latest 10 Food Logs:');
        allLogs.forEach(log => {
            console.log(`   ${log.date.toISOString().split('T')[0]} - ${log.foodItem}: ${log.preparedQty}kg`);
        });
        
        // Check for March 12, 2026 specifically
        const march12Start = new Date('2026-03-12T00:00:00Z');
        const march12End = new Date('2026-03-12T23:59:59Z');
        
        const march12Logs = await FoodLog.find({
            date: { $gte: march12Start, $lte: march12End }
        });
        
        console.log(`\n📅 Food Logs for March 12, 2026: ${march12Logs.length} entries`);
        march12Logs.forEach(log => {
            console.log(`   ${log.foodItem}: Prepared ${log.preparedQty}kg, Consumed ${log.consumedQty}kg, Wasted ${log.wastedQty}kg`);
        });
        
        if (march12Logs.length > 0) {
            const total = march12Logs.reduce((acc, log) => ({
                prepared: acc.prepared + log.preparedQty,
                consumed: acc.consumed + log.consumedQty,
                wasted: acc.wasted + log.wastedQty
            }), { prepared: 0, consumed: 0, wasted: 0 });
            
            console.log(`\n📊 Totals for March 12, 2026:`);
            console.log(`   Prepared: ${total.prepared} kg`);
            console.log(`   Consumed: ${total.consumed} kg`);
            console.log(`   Wasted: ${total.wasted} kg`);
        }
        
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

(async () => {
    await connectDB();
    await checkData();
})();
