// Load CSV data into MongoDB
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// FoodLog Model
const FoodLog = require('./models/FoodLog');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Parse CSV and load into MongoDB
async function loadDataFromCSV() {
    try {
        const csvPath = path.join(__dirname, '../data/food_logs.csv');
        const csvData = fs.readFileSync(csvPath, 'utf-8');
        
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        console.log(`📂 Reading CSV file: ${csvPath}`);
        console.log(`📊 Total lines: ${lines.length - 1}`);
        
        // Clear existing data
        await FoodLog.deleteMany({});
        console.log('🗑️  Cleared existing data');
        
        const records = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            
            if (values.length >= 6) {
                const record = {
                    date: new Date(values[0]),
                    foodItem: values[1],
                    preparedQty: parseFloat(values[2]),
                    consumedQty: parseFloat(values[3]),
                    wastedQty: parseFloat(values[4]),
                    dayOfWeek: values[5]
                };
                
                records.push(record);
            }
        }
        
        // Insert in batches
        const batchSize = 100;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            await FoodLog.insertMany(batch);
            console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} records)`);
        }
        
        console.log(`✅ Successfully loaded ${records.length} records into MongoDB`);
        
        // Show summary
        const totalRecords = await FoodLog.countDocuments();
        const foodItems = await FoodLog.distinct('foodItem');
        
        console.log('\n📊 Database Summary:');
        console.log(`   Total Records: ${totalRecords}`);
        console.log(`   Food Items: ${foodItems.length}`);
        console.log(`   Items: ${foodItems.join(', ')}`);
        
        mongoose.connection.close();
        console.log('\n✅ Data loading completed!');
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        process.exit(1);
    }
}

// Main execution
(async () => {
    await connectDB();
    await loadDataFromCSV();
})();
