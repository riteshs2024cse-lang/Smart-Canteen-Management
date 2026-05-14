"""
Smart Canteen Management System - AI Demand Prediction Model Training
This script loads historical food log data, processes features, and trains a 
RandomForest model to predict next-day food demand.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Create necessary directories
os.makedirs(os.path.join(BASE_DIR, 'models'), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)

def load_data(file_path='data/food_logs.csv'):
    """Load food log data from CSV file"""
    print("📂 Loading data from CSV...")
    resolved_path = file_path if os.path.isabs(file_path) else os.path.join(BASE_DIR, file_path)
    df = pd.read_csv(resolved_path)
    print(f"✅ Loaded {len(df)} records")
    return df

def clean_data(df):
    """Clean missing values and handle data quality issues"""
    print("\n🧹 Cleaning data...")
    
    # Convert date to datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Handle missing values
    df = df.dropna()
    
    # Remove records where consumed > prepared (data quality issue)
    df = df[df['consumedQty'] <= df['preparedQty']]
    
    # Sort by date
    df = df.sort_values('date')
    
    print(f"✅ Cleaned data: {len(df)} records remaining")
    return df

def engineer_features(df):
    """Create useful features for prediction"""
    print("\n🔧 Engineering features...")
    
    # Map day of week to numeric
    day_mapping = {
        'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3,
        'Friday': 4, 'Saturday': 5, 'Sunday': 6
    }
    df['day_num'] = df['dayOfWeek'].map(day_mapping)
    
    # Calculate waste ratio
    df['waste_ratio'] = df['wastedQty'] / df['preparedQty']
    
    # Calculate consumption ratio
    df['consumption_ratio'] = df['consumedQty'] / df['preparedQty']
    
    # Create features for each food item
    feature_dfs = []
    
    for food_item in df['foodItem'].unique():
        food_df = df[df['foodItem'] == food_item].copy()
        food_df = food_df.sort_values('date')
        
        # Rolling average consumption (last 3 days)
        food_df['rolling_avg_3d'] = food_df['consumedQty'].rolling(window=3, min_periods=1).mean()
        
        # Rolling average consumption (last 7 days)
        food_df['rolling_avg_7d'] = food_df['consumedQty'].rolling(window=7, min_periods=1).mean()
        
        # Previous day consumption
        food_df['prev_day_consumption'] = food_df['consumedQty'].shift(1)
        
        # Previous 2 days consumption
        food_df['prev_2day_consumption'] = food_df['consumedQty'].shift(2)
        
        # Previous 3 days consumption
        food_df['prev_3day_consumption'] = food_df['consumedQty'].shift(3)
        
        # Trend (difference from previous day)
        food_df['consumption_trend'] = food_df['consumedQty'] - food_df['prev_day_consumption']
        
        # Day of week average consumption
        day_avg = food_df.groupby('day_num')['consumedQty'].transform('mean')
        food_df['day_of_week_avg'] = day_avg
        
        feature_dfs.append(food_df)
    
    # Combine all food items
    df_features = pd.concat(feature_dfs, ignore_index=True)
    
    # Fill NaN values created by shift operations
    df_features = df_features.bfill()
    
    # Fill remaining NaN values with mean for numeric columns only
    numeric_columns = df_features.select_dtypes(include=['float64', 'int64']).columns
    df_features[numeric_columns] = df_features[numeric_columns].fillna(df_features[numeric_columns].mean())
    
    print(f"✅ Created {len(df_features.columns)} features")
    return df_features

def prepare_training_data(df):
    """Prepare data for model training"""
    print("\n📊 Preparing training data...")
    
    # Select features
    feature_columns = [
        'day_num',
        'preparedQty',
        'rolling_avg_3d',
        'rolling_avg_7d',
        'prev_day_consumption',
        'prev_2day_consumption',
        'prev_3day_consumption',
        'consumption_trend',
        'day_of_week_avg',
        'waste_ratio',
        'consumption_ratio'
    ]
    
    # Target variable
    target_column = 'consumedQty'
    
    # Create feature matrix and target vector
    X = df[feature_columns]
    y = df[target_column]
    
    # Remove any remaining NaN values
    valid_indices = ~(X.isna().any(axis=1) | y.isna())
    X = X[valid_indices]
    y = y[valid_indices]
    
    print(f"✅ Training data prepared: {len(X)} samples, {len(feature_columns)} features")
    return X, y, feature_columns

def train_models(X, y):
    """Train multiple models and select the best one"""
    print("\n🤖 Training machine learning models...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    models = {
        'RandomForest': RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=42,
            n_jobs=-1
        ),
        'LinearRegression': LinearRegression()
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\n  Training {name}...")
        model.fit(X_train, y_train)
        
        # Make predictions
        y_pred_train = model.predict(X_train)
        y_pred_test = model.predict(X_test)
        
        # Calculate metrics
        train_mae = mean_absolute_error(y_train, y_pred_train)
        test_mae = mean_absolute_error(y_test, y_pred_test)
        test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
        test_r2 = r2_score(y_test, y_pred_test)
        
        results[name] = {
            'model': model,
            'train_mae': train_mae,
            'test_mae': test_mae,
            'test_rmse': test_rmse,
            'test_r2': test_r2
        }
        
        print(f"    Train MAE: {train_mae:.2f}")
        print(f"    Test MAE:  {test_mae:.2f}")
        print(f"    Test RMSE: {test_rmse:.2f}")
        print(f"    Test R²:   {test_r2:.4f}")
    
    # Select best model based on test MAE
    best_model_name = min(results, key=lambda k: results[k]['test_mae'])
    best_model = results[best_model_name]['model']
    
    print(f"\n✅ Best model: {best_model_name}")
    return best_model, results[best_model_name]

def save_model(model, feature_columns, food_items, metrics):
    """Save trained model and metadata"""
    print("\n💾 Saving model...")
    
    model_data = {
        'model': model,
        'feature_columns': feature_columns,
        'food_items': food_items,
        'metrics': metrics,
        'training_date': datetime.now().isoformat()
    }
    
    model_path = os.path.join(BASE_DIR, 'models', 'demand_model.pkl')
    joblib.dump(model_data, model_path)
    
    print(f"✅ Model saved to {model_path}")
    
    # Save model metadata
    metadata = {
        'Training Date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'Test MAE': f"{metrics['test_mae']:.2f}",
        'Test RMSE': f"{metrics['test_rmse']:.2f}",
        'Test R²': f"{metrics['test_r2']:.4f}",
        'Features': len(feature_columns),
        'Food Items': ', '.join(food_items)
    }
    
    metadata_path = os.path.join(BASE_DIR, 'models', 'model_metadata.txt')
    with open(metadata_path, 'w') as f:
        for key, value in metadata.items():
            f.write(f"{key}: {value}\n")
    
    print(f"✅ Metadata saved to {metadata_path}")

def display_feature_importance(model, feature_columns):
    """Display feature importance for RandomForest model"""
    if hasattr(model, 'feature_importances_'):
        print("\n📊 Feature Importance:")
        importances = model.feature_importances_
        feature_importance = sorted(
            zip(feature_columns, importances),
            key=lambda x: x[1],
            reverse=True
        )
        
        for feature, importance in feature_importance:
            print(f"    {feature:25s}: {importance:.4f}")

def main():
    """Main training pipeline"""
    print("=" * 70)
    print("🍽️  Smart Canteen Management System - AI Model Training")
    print("=" * 70)
    
    try:
        # Load and clean data
        df = load_data()
        df = clean_data(df)
        
        # Get unique food items
        food_items = df['foodItem'].unique().tolist()
        print(f"\n📋 Food items: {', '.join(food_items)}")
        
        # Engineer features
        df = engineer_features(df)
        
        # Prepare training data
        X, y, feature_columns = prepare_training_data(df)
        
        # Train models
        best_model, metrics = train_models(X, y)
        
        # Display feature importance
        display_feature_importance(best_model, feature_columns)
        
        # Save model
        save_model(best_model, feature_columns, food_items, metrics)
        
        print("\n" + "=" * 70)
        print("✅ Model training completed successfully!")
        print("=" * 70)
        print("\nNext steps:")
        print("  1. Run 'python predict.py' to test predictions")
        print("  2. Run 'python app.py' to start Flask API server")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n❌ Error during training: {str(e)}")
        raise

if __name__ == '__main__':
    main()
