"""
Smart Canteen Management System - Flask API Server
This Flask application provides REST API endpoints for AI-powered demand prediction.
It can be called from the Node.js backend to get intelligent food demand forecasts.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta
from predict import DemandPredictor
import os
import sys

app = Flask(__name__)
CORS(app)  # Enable CORS for Node.js backend integration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Initialize the predictor
try:
    predictor = DemandPredictor(model_path=os.path.join(BASE_DIR, 'models', 'demand_model.pkl'))
    print("✅ Demand predictor initialized successfully")
except Exception as e:
    print(f"⚠️  Warning: Could not load model - {str(e)}")
    print("   Please run 'python train_model.py' first")
    predictor = None


@app.route('/', methods=['GET'])
def home():
    """Base route - API information"""
    return jsonify({
        'success': True,
        'message': 'Smart Canteen AI Prediction API',
        'version': '1.0.0',
        'status': 'Model loaded' if predictor else 'Model not loaded',
        'endpoints': {
            'predict_demand': '/predict-demand',
            'predict_item': '/predict-demand/<food_item>',
            'health': '/health'
        }
    }), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'model_loaded': predictor is not None,
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/predict-demand', methods=['GET', 'POST'])
def predict_demand():
    """
    Main prediction endpoint
    
    GET: Predicts demand using default/sample data
    POST: Predicts demand using provided historical data
    
    Request body (POST):
    {
        "items": {
            "Rice": {
                "recent_consumption": [120, 125, 118, ...],
                "day_of_week": "Monday",
                "avg_prepared": 140,
                "avg_waste_ratio": 0.08,
                "day_avg": 125
            },
            ...
        }
    }
    """
    
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Model not loaded. Please train the model first.'
        }), 500
    
    try:
        if request.method == 'POST':
            data = request.get_json()
            items_data = data.get('items', {})
            
            if not items_data:
                return jsonify({
                    'success': False,
                    'error': 'No items data provided'
                }), 400
        else:
            # Use default sample data for GET requests
            tomorrow = datetime.now() + timedelta(days=1)
            day_of_week = tomorrow.strftime('%A')
            
            items_data = {
                'Rice': {
                    'recent_consumption': [120, 125, 118, 130, 128, 122, 126],
                    'day_of_week': day_of_week,
                    'avg_prepared': 140,
                    'avg_waste_ratio': 0.08,
                    'day_avg': 125
                },
                'Dal': {
                    'recent_consumption': [85, 88, 82, 90, 87, 84, 86],
                    'day_of_week': day_of_week,
                    'avg_prepared': 95,
                    'avg_waste_ratio': 0.06,
                    'day_avg': 86
                },
                'Chapati': {
                    'recent_consumption': [210, 215, 205, 220, 218, 212, 216],
                    'day_of_week': day_of_week,
                    'avg_prepared': 230,
                    'avg_waste_ratio': 0.07,
                    'day_avg': 214
                },
                'Sabzi': {
                    'recent_consumption': [92, 95, 88, 98, 96, 90, 94],
                    'day_of_week': day_of_week,
                    'avg_prepared': 105,
                    'avg_waste_ratio': 0.07,
                    'day_avg': 93
                }
            }
        
        # Get predictions
        results = predictor.predict_all_items(items_data)
        
        # Format response
        response = {
            'success': True,
            'expected_diners': results['expected_diners'],
            'recommended_food_quantity': results['recommended_food_quantity'],
            'total_predicted_consumption': results['total_predicted_consumption'],
            'waste_risk_score': calculate_overall_waste_risk(results['items']),
            'prediction_date': results['prediction_date'],
            'for_date': results['for_date'],
            'items': results['items']
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/predict-demand/<food_item>', methods=['GET', 'POST'])
def predict_item(food_item):
    """
    Predict demand for a specific food item
    
    GET: Uses default data
    POST: Uses provided data
    
    Request body (POST):
    {
        "recent_consumption": [100, 105, 98, ...],
        "day_of_week": "Monday",
        "avg_prepared": 120,
        "avg_waste_ratio": 0.1,
        "day_avg": 105
    }
    """
    
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Model not loaded. Please train the model first.'
        }), 500
    
    try:
        if request.method == 'POST':
            item_data = request.get_json()
        else:
            # Default data
            tomorrow = datetime.now() + timedelta(days=1)
            item_data = {
                'recent_consumption': [100, 105, 98, 110, 108, 102, 106],
                'day_of_week': tomorrow.strftime('%A'),
                'avg_prepared': 120,
                'avg_waste_ratio': 0.1,
                'day_avg': 105
            }
        
        # Get prediction
        prediction = predictor.predict_demand(food_item, item_data)
        
        return jsonify({
            'success': True,
            'data': prediction
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/train', methods=['POST'])
def trigger_training():
    """
    Endpoint to trigger model retraining (optional)
    Can be called when new data is available
    """
    try:
        import subprocess
        
        # Run training script
        result = subprocess.run(
            [sys.executable, os.path.join(BASE_DIR, 'train_model.py')],
            capture_output=True,
            text=True,
            cwd=BASE_DIR
        )
        
        if result.returncode == 0:
            # Reload predictor
            global predictor
            predictor = DemandPredictor(model_path=os.path.join(BASE_DIR, 'models', 'demand_model.pkl'))
            
            return jsonify({
                'success': True,
                'message': 'Model retrained successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    
    if not predictor:
        return jsonify({
            'success': False,
            'error': 'Model not loaded'
        }), 500
    
    try:
        # Read model metadata
        metadata_path = os.path.join(BASE_DIR, 'models', 'model_metadata.txt')
        metadata = {}
        
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                for line in f:
                    if ':' in line:
                        key, value = line.strip().split(':', 1)
                        metadata[key.strip()] = value.strip()
        
        return jsonify({
            'success': True,
            'model_path': predictor.model_path,
            'supported_items': predictor.food_items,
            'features': predictor.feature_columns,
            'metadata': metadata
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def calculate_overall_waste_risk(items):
    """Calculate overall waste risk from all items"""
    if not items:
        return 0.0
    
    total_risk = sum(item['waste_risk_score'] for item in items.values())
    avg_risk = total_risk / len(items)
    return round(avg_risk, 3)


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    print("=" * 70)
    print("🍽️  Smart Canteen AI Prediction API Server")
    print("=" * 70)
    print("\n📡 Starting Flask server...")
    print("   API will be available at: http://localhost:5001")
    print("   Main endpoint: http://localhost:5001/predict-demand")
    print("\n   Press CTRL+C to stop the server\n")
    print("=" * 70)
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True
    )
