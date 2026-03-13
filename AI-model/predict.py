"""
Smart Canteen Management System - Demand Prediction Module
This module provides functions to predict next-day food demand and calculate
recommended preparation quantities with waste risk assessment.
"""

import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime, timedelta

class DemandPredictor:
    """Demand prediction class for canteen food items"""
    
    def __init__(self, model_path='models/demand_model.pkl'):
        """Initialize predictor with trained model"""
        self.model_path = model_path
        self.model_data = None
        self.model = None
        self.feature_columns = None
        self.food_items = None
        
        self.load_model()
    
    def load_model(self):
        """Load the trained model from disk"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Model file not found: {self.model_path}\n"
                "Please run 'python train_model.py' first to train the model."
            )
        
        print(f"📦 Loading model from {self.model_path}...")
        self.model_data = joblib.load(self.model_path)
        self.model = self.model_data['model']
        self.feature_columns = self.model_data['feature_columns']
        self.food_items = self.model_data['food_items']
        
        print(f"✅ Model loaded successfully")
        print(f"   Supported food items: {', '.join(self.food_items)}")
    
    def prepare_features(self, food_item_data):
        """
        Prepare features for prediction from historical data
        
        Parameters:
        -----------
        food_item_data : dict
            Dictionary containing:
            - food_item: str
            - recent_consumption: list of recent consumption values (last 7 days)
            - day_of_week: str or int (0-6)
            - avg_prepared: float
            - avg_waste_ratio: float
        
        Returns:
        --------
        pandas.DataFrame with features ready for prediction
        """
        recent = food_item_data.get('recent_consumption', [])
        
        # Ensure we have enough data
        if len(recent) < 3:
            # Use default values if not enough history
            recent = [100] * 7  # Default consumption
        
        # Convert day_of_week to numeric if string
        day_mapping = {
            'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3,
            'Friday': 4, 'Saturday': 5, 'Sunday': 6
        }
        
        day_num = food_item_data.get('day_of_week', 0)
        if isinstance(day_num, str):
            day_num = day_mapping.get(day_num, 0)
        
        # Calculate features
        features = {
            'day_num': day_num,
            'preparedQty': food_item_data.get('avg_prepared', np.mean(recent)),
            'rolling_avg_3d': np.mean(recent[-3:]) if len(recent) >= 3 else np.mean(recent),
            'rolling_avg_7d': np.mean(recent[-7:]) if len(recent) >= 7 else np.mean(recent),
            'prev_day_consumption': recent[-1] if len(recent) >= 1 else 100,
            'prev_2day_consumption': recent[-2] if len(recent) >= 2 else 100,
            'prev_3day_consumption': recent[-3] if len(recent) >= 3 else 100,
            'consumption_trend': recent[-1] - recent[-2] if len(recent) >= 2 else 0,
            'day_of_week_avg': food_item_data.get('day_avg', np.mean(recent)),
            'waste_ratio': food_item_data.get('avg_waste_ratio', 0.1),
            'consumption_ratio': 1 - food_item_data.get('avg_waste_ratio', 0.1)
        }
        
        # Create DataFrame with correct column order
        df = pd.DataFrame([features])[self.feature_columns]
        return df
    
    def predict_consumption(self, food_item_data):
        """
        Predict next-day consumption for a food item
        
        Returns:
        --------
        float: Predicted consumption quantity
        """
        features = self.prepare_features(food_item_data)
        prediction = self.model.predict(features)[0]
        
        # Ensure prediction is positive
        prediction = max(0, prediction)
        
        return prediction
    
    def calculate_waste_risk(self, predicted_consumption, recommended_qty, historical_waste_ratio):
        """
        Calculate waste risk score based on prediction and preparation quantity
        
        Returns:
        --------
        float: Waste risk score (0-1, where 0 is low risk, 1 is high risk)
        """
        # Calculate buffer percentage
        buffer = (recommended_qty - predicted_consumption) / predicted_consumption if predicted_consumption > 0 else 0
        
        # Risk factors
        buffer_risk = min(buffer / 0.2, 1)  # Higher buffer = higher risk
        historical_risk = historical_waste_ratio
        
        # Combined risk (weighted average)
        waste_risk = (0.6 * buffer_risk + 0.4 * historical_risk)
        
        return round(waste_risk, 3)
    
    def predict_demand(self, food_item, food_item_data=None):
        """
        Main prediction function that returns complete demand forecast
        
        Parameters:
        -----------
        food_item : str
            Name of the food item
        food_item_data : dict, optional
            Historical data for the food item
        
        Returns:
        --------
        dict with prediction results
        """
        # Default data if not provided
        if food_item_data is None:
            food_item_data = {
                'food_item': food_item,
                'recent_consumption': [100, 105, 98, 110, 108, 102, 106],
                'day_of_week': datetime.now().weekday(),
                'avg_prepared': 120,
                'avg_waste_ratio': 0.1,
                'day_avg': 105
            }
        
        # Predict consumption
        predicted_consumption = self.predict_consumption(food_item_data)
        
        # Calculate recommended quantity with 10% buffer to reduce waste
        recommended_qty = int(predicted_consumption * 1.1)
        
        # Calculate waste risk
        waste_risk = self.calculate_waste_risk(
            predicted_consumption,
            recommended_qty,
            food_item_data.get('avg_waste_ratio', 0.1)
        )
        
        return {
            'food_item': food_item,
            'predicted_consumption': round(predicted_consumption, 2),
            'recommended_quantity': recommended_qty,
            'waste_risk_score': waste_risk,
            'confidence': 'High' if len(food_item_data.get('recent_consumption', [])) >= 7 else 'Medium'
        }
    
    def predict_all_items(self, items_data):
        """
        Predict demand for multiple food items
        
        Parameters:
        -----------
        items_data : dict
            Dictionary where keys are food items and values are their data
        
        Returns:
        --------
        dict with predictions for all items
        """
        predictions = {}
        total_predicted = 0
        total_recommended = 0
        
        for food_item, data in items_data.items():
            prediction = self.predict_demand(food_item, data)
            predictions[food_item] = prediction
            total_predicted += prediction['predicted_consumption']
            total_recommended += prediction['recommended_quantity']
        
        # Calculate expected diners (assuming avg 1 portion per diner per item)
        # Adjust this calculation based on your canteen's serving patterns
        expected_diners = int(total_predicted / len(items_data)) if items_data else 0
        
        return {
            'expected_diners': expected_diners,
            'recommended_food_quantity': total_recommended,
            'total_predicted_consumption': round(total_predicted, 2),
            'items': predictions,
            'prediction_date': datetime.now().isoformat(),
            'for_date': (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        }


def test_prediction():
    """Test the prediction module"""
    print("=" * 70)
    print("🧪 Testing Demand Prediction Module")
    print("=" * 70)
    
    try:
        # Initialize predictor
        predictor = DemandPredictor()
        
        # Test data for different food items
        test_data = {
            'Rice': {
                'recent_consumption': [120, 125, 118, 130, 128, 122, 126],
                'day_of_week': 'Monday',
                'avg_prepared': 140,
                'avg_waste_ratio': 0.08,
                'day_avg': 125
            },
            'Dal': {
                'recent_consumption': [85, 88, 82, 90, 87, 84, 86],
                'day_of_week': 'Monday',
                'avg_prepared': 95,
                'avg_waste_ratio': 0.06,
                'day_avg': 86
            },
            'Chapati': {
                'recent_consumption': [210, 215, 205, 220, 218, 212, 216],
                'day_of_week': 'Monday',
                'avg_prepared': 230,
                'avg_waste_ratio': 0.07,
                'day_avg': 214
            },
            'Sabzi': {
                'recent_consumption': [92, 95, 88, 98, 96, 90, 94],
                'day_of_week': 'Monday',
                'avg_prepared': 105,
                'avg_waste_ratio': 0.07,
                'day_avg': 93
            }
        }
        
        # Get predictions for all items
        print("\n📊 Generating predictions...\n")
        results = predictor.predict_all_items(test_data)
        
        # Display results
        print(f"🗓️  Prediction for: {results['for_date']}")
        print(f"👥 Expected Diners: {results['expected_diners']}")
        print(f"🍽️  Total Recommended Quantity: {results['recommended_food_quantity']}")
        print(f"📈 Total Predicted Consumption: {results['total_predicted_consumption']}")
        
        print("\n" + "-" * 70)
        print("Individual Food Item Predictions:")
        print("-" * 70)
        
        for food_item, prediction in results['items'].items():
            print(f"\n{food_item}:")
            print(f"  Predicted Consumption: {prediction['predicted_consumption']}")
            print(f"  Recommended Quantity:  {prediction['recommended_quantity']}")
            print(f"  Waste Risk Score:      {prediction['waste_risk_score']} ({get_risk_level(prediction['waste_risk_score'])})")
            print(f"  Confidence:            {prediction['confidence']}")
        
        print("\n" + "=" * 70)
        print("✅ Prediction test completed successfully!")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n❌ Error during prediction: {str(e)}")
        raise


def get_risk_level(score):
    """Convert risk score to level"""
    if score < 0.3:
        return "Low"
    elif score < 0.6:
        return "Medium"
    else:
        return "High"


if __name__ == '__main__':
    test_prediction()
