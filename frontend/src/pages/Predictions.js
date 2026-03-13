import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Users,
  Utensils,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { predictionAPI, dashboardAPI } from '../services/api';
import './Predictions.css';

function Predictions() {
  const [predictions, setPredictions] = useState(null);
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchPredictions();
    fetchWeeklyTrends();
  }, [selectedDate]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await predictionAPI.getPrediction(selectedDate);
      setPredictions(response.data);
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyTrends = async () => {
    try {
      const response = await dashboardAPI.getWeeklyTrends();
      const trendData = response.data.map(trend => ({
        date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        prepared: trend.totalPrepared,
        consumed: trend.totalConsumed,
        wasted: trend.totalWasted
      }));
      setWeeklyTrends(trendData.reverse());
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    }
  };

  const getWasteRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      default: return 'secondary';
    }
  };

  const getWasteRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return <CheckCircle size={20} />;
      case 'medium': return <AlertTriangle size={20} />;
      case 'high': return <AlertTriangle size={20} />;
      default: return <TrendingUp size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const aiPredictions = predictions?.predictions || [];
  const isPredictionAvailable = aiPredictions.length > 0;

  return (
    <div className="predictions fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Brain size={28} />
            AI Demand Predictions
          </h2>
          <p className="page-subtitle">Machine learning powered food demand forecasting</p>
        </div>
        <div className="header-actions">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          <button className="btn btn-primary" onClick={fetchPredictions}>
            <RefreshCw size={20} />
            Predict
          </button>
        </div>
      </div>

      {/* AI Status Banner */}
      <div className={`ai-banner ${predictions?.source === 'ai' ? 'ai-active' : 'statistical'}`}>
        <div className="ai-banner-content">
          <Sparkles size={24} />
          <div>
            <div className="ai-banner-title">
              {predictions?.source === 'ai' ? 'AI Model Active' : 'Statistical Fallback'}
            </div>
            <div className="ai-banner-subtitle">
              {predictions?.source === 'ai' 
                ? 'Predictions powered by Random Forest ML model' 
                : 'Using statistical analysis (AI model unavailable)'}
            </div>
          </div>
        </div>
        {predictions?.modelInfo && (
          <div className="model-info">
            <span>Accuracy: {(predictions.modelInfo.accuracy * 100).toFixed(1)}%</span>
            <span>MAE: {predictions.modelInfo.mae?.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Prediction Summary Cards */}
      {isPredictionAvailable && (
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
              <Users size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">Expected Diners</div>
              <div className="summary-value">
                {Math.round(aiPredictions.reduce((sum, p) => sum + p.predictedQty, 0) / aiPredictions.length * 10)}
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <Utensils size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">Total Recommended</div>
              <div className="summary-value">
                {aiPredictions.reduce((sum, p) => sum + p.recommendedQty, 0).toFixed(0)} kg
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">Avg Confidence</div>
              <div className="summary-value">
                {(aiPredictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / aiPredictions.length * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Food Item Predictions</h3>
          <span className="prediction-date">
            <Calendar size={16} />
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Predicted Qty</th>
                <th>Recommended Qty</th>
                <th>Confidence</th>
                <th>Waste Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!isPredictionAvailable ? (
                <tr>
                  <td colSpan="6" className="text-center">No predictions available for this date</td>
                </tr>
              ) : (
                aiPredictions.map((pred, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{pred.foodItem}</td>
                    <td>{pred.predictedQty?.toFixed(1)} kg</td>
                    <td className="text-green">{pred.recommendedQty?.toFixed(1)} kg</td>
                    <td>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill" 
                          style={{ width: `${(pred.confidence || 0) * 100}%` }}
                        ></div>
                        <span>{((pred.confidence || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`risk-badge risk-${getWasteRiskColor(pred.wasteRisk)}`}>
                        {getWasteRiskIcon(pred.wasteRisk)}
                        {pred.wasteRisk || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${getWasteRiskColor(pred.wasteRisk)}`}>
                        {pred.wasteRisk === 'Low' ? 'Optimal' : pred.wasteRisk === 'Medium' ? 'Caution' : 'Review'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Trends Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Historical Trends (Last 7 Days)</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '2px solid #10b981', 
                borderRadius: '0.75rem',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }} 
            />
            <Legend />
            <Line type="monotone" dataKey="prepared" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Prepared" />
            <Line type="monotone" dataKey="consumed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Consumed" />
            <Line type="monotone" dataKey="wasted" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Wasted" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      {isPredictionAvailable && (
        <div className="recommendations-card">
          <h3>
            <Sparkles size={20} />
            AI Recommendations
          </h3>
          <ul>
            {aiPredictions.filter(p => p.wasteRisk === 'High').length > 0 && (
              <li className="recommendation-warning">
                <AlertTriangle size={16} />
                <span>
                  {aiPredictions.filter(p => p.wasteRisk === 'High').length} item(s) with high waste risk. 
                  Consider reducing preparation quantities.
                </span>
              </li>
            )}
            {aiPredictions.filter(p => p.wasteRisk === 'Low').length > 0 && (
              <li className="recommendation-success">
                <CheckCircle size={16} />
                <span>
                  {aiPredictions.filter(p => p.wasteRisk === 'Low').length} item(s) showing optimal performance. 
                  Continue current preparation levels.
                </span>
              </li>
            )}
            <li className="recommendation-info">
              <TrendingUp size={16} />
              <span>
                Predictions based on {predictions?.daysOfData || 0} days of historical data with {
                  ((predictions?.modelInfo?.accuracy || 0) * 100).toFixed(0)
                }% accuracy.
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Predictions;
