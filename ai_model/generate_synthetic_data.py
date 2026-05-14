import csv
import random
from datetime import datetime, timedelta
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'food_logs.csv')

# Food items with typical quantities
food_items = {
    'Rice': {'base': 130, 'variance': 30},
    'Dal': {'base': 85, 'variance': 20},
    'Chapati': {'base': 220, 'variance': 40},
    'Sabzi': {'base': 95, 'variance': 25},
    'Sambar': {'base': 70, 'variance': 20},
    'Idli': {'base': 150, 'variance': 30},
    'Dosa': {'base': 100, 'variance': 25},
    'Poha': {'base': 80, 'variance': 20},
    'Upma': {'base': 75, 'variance': 20},
    'Pulao': {'base': 110, 'variance': 25},
    'Curd Rice': {'base': 60, 'variance': 15},
    'Paratha': {'base': 180, 'variance': 35}
}

# Generate dates from December 2025 to early March 2026
start_date = datetime(2025, 12, 1)
end_date = datetime(2026, 3, 10)

# Read existing data to avoid duplicates
existing_entries = set()
try:
    with open(DATA_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            existing_entries.add((row['date'], row['foodItem']))
except:
    pass

# Generate synthetic data
synthetic_data = []
current_date = start_date

while current_date <= end_date:
    day_name = current_date.strftime('%A')
    is_weekend = day_name in ['Saturday', 'Sunday']
    
    # Select 4-6 random food items per day
    daily_items = random.sample(list(food_items.keys()), random.randint(4, 6))
    
    for item in daily_items:
        date_str = current_date.strftime('%Y-%m-%d')
        
        # Skip if entry already exists
        if (date_str, item) in existing_entries:
            continue
        
        # Base quantities with day-of-week adjustments
        base_prep = food_items[item]['base']
        variance = food_items[item]['variance']
        
        # Weekend reduction (20-30% less consumption)
        weekend_factor = 0.7 if is_weekend else 1.0
        
        # Random variation
        prepared = int(base_prep + random.randint(-variance, variance))
        prepared = max(prepared, 20)  # Minimum 20kg
        
        # Consumption (85-95% of prepared, adjusted for weekend)
        consumption_rate = random.uniform(0.85, 0.95) * weekend_factor
        consumed = int(prepared * consumption_rate)
        
        # Wasted quantity
        wasted = prepared - consumed
        
        # Ensure positive values
        if wasted < 0:
            wasted = 0
            consumed = prepared
        
        synthetic_data.append({
            'date': date_str,
            'foodItem': item,
            'preparedQty': prepared,
            'consumedQty': consumed,
            'wastedQty': wasted,
            'dayOfWeek': day_name
        })
    
    current_date += timedelta(days=1)

# Sort by date
synthetic_data.sort(key=lambda x: x['date'])

# Append to CSV file
with open(DATA_FILE, 'a', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['date', 'foodItem', 'preparedQty', 'consumedQty', 'wastedQty', 'dayOfWeek'])
    for row in synthetic_data:
        writer.writerow(row)

print(f"✓ Generated {len(synthetic_data)} synthetic data entries")
print(f"✓ Data saved to food_logs.csv")
print(f"✓ Date range: {synthetic_data[0]['date']} to {synthetic_data[-1]['date']}")
