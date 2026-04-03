import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  PieChart as PieIcon,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { dashboardAPI } from '../services/api';
import './Analytics.css';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function Analytics() {
  const [wasteAnalysis, setWasteAnalysis] = useState([]);
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [wasteRes, trendsRes, statsRes] = await Promise.all([
        dashboardAPI.getWasteAnalysis(),
        dashboardAPI.getWeeklyTrends(),
        dashboardAPI.getStats()
      ]);

      setWasteAnalysis(wasteRes.data);

      const weeklyData = Array.isArray(trendsRes?.data) ? trendsRes.data : [];
      const statsDailyData = Array.isArray(statsRes?.data?.dailyTrends) ? statsRes.data.dailyTrends : [];
      const sourceTrends = weeklyData.length > 0 ? weeklyData : statsDailyData;

      const trendData = sourceTrends.map(trend => ({
        date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        prepared: trend.totalPrepared,
        consumed: trend.totalConsumed,
        wasted: trend.totalWasted,
        wastePercent: trend.totalPrepared > 0 ? ((trend.totalWasted / trend.totalPrepared) * 100).toFixed(1) : '0.0'
      }));
      setWeeklyTrends(trendData.reverse());
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csvContent = wasteAnalysis.map(item => 
      `${item.foodItem},${item.totalPrepared},${item.totalConsumed},${item.totalWasted},${item.wastePercentage.toFixed(2)}`
    ).join('\n');
    
    const blob = new Blob([`Food Item,Prepared,Consumed,Wasted,Waste %\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waste-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Prepare chart data
  const wasteByItem = (wasteAnalysis || []).map(item => ({
    name: item.foodItem || 'Unknown',
    wasted: item.totalWasted || 0,
    consumed: item.totalConsumed || 0,
    prepared: item.totalPrepared || 0
  }));

  const wastePieData = (wasteAnalysis || []).map(item => ({
    name: item.foodItem || 'Unknown',
    value: item.totalWasted || 0
  }));

  const totalWaste = wasteAnalysis.reduce((sum, item) => sum + (item.totalWasted || 0), 0);
  const totalPrepared = wasteAnalysis.reduce((sum, item) => sum + (item.totalPrepared || 0), 0);
  const avgWastePercent = totalPrepared > 0 ? (totalWaste / totalPrepared * 100).toFixed(1) : '0.0';

  return (
    <div className="analytics fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <BarChart3 size={28} />
            Analytics & Insights
          </h2>
          <p className="page-subtitle">Comprehensive waste analysis and trends</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportData}>
            <Download size={20} />
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={fetchAnalytics}>
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon">
            <BarChart3 size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Prepared</div>
            <div className="summary-value">{totalPrepared.toFixed(0)} kg</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
            <TrendingDown size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Wasted</div>
            <div className="summary-value">{totalWaste.toFixed(0)} kg</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <PieIcon size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Avg Waste Rate</div>
            <div className="summary-value">{avgWastePercent}%</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Waste Comparison Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart3 size={20} />
              Waste vs Consumption by Item
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={wasteByItem}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
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
              <Bar dataKey="consumed" fill="#10b981" name="Consumed (kg)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="wasted" fill="#ef4444" name="Wasted (kg)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Waste Distribution Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <PieIcon size={20} />
              Waste Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={wastePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {wastePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '2px solid #10b981', 
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Calendar size={20} />
            Weekly Trends Analysis
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
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
            <Line 
              type="monotone" 
              dataKey="prepared" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 5 }} 
              name="Prepared (kg)" 
            />
            <Line 
              type="monotone" 
              dataKey="consumed" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 5 }} 
              name="Consumed (kg)" 
            />
            <Line 
              type="monotone" 
              dataKey="wasted" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 5 }} 
              name="Wasted (kg)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Waste Percentage Trend */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingDown size={20} />
            Waste Percentage Trend
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" label={{ value: 'Waste %', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '2px solid #10b981', 
                borderRadius: '0.75rem',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="wastePercent" 
              stroke="#f59e0b" 
              strokeWidth={3} 
              dot={{ r: 5, fill: '#f59e0b' }} 
              name="Waste %" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Analysis Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Detailed Waste Analysis</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Total Prepared</th>
                <th>Total Consumed</th>
                <th>Total Wasted</th>
                <th>Waste %</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {(wasteAnalysis || []).map((item, index) => {
                const wastePercentage = item.wastePercentage || 
                  (item.totalPrepared > 0 ? (item.totalWasted / item.totalPrepared * 100) : 0);
                return (
                  <tr key={index}>
                    <td className="font-semibold">{item.foodItem || 'Unknown'}</td>
                    <td>{(item.totalPrepared || 0).toFixed(1)} kg</td>
                    <td className="text-green">{(item.totalConsumed || 0).toFixed(1)} kg</td>
                    <td className="text-red">{(item.totalWasted || 0).toFixed(1)} kg</td>
                    <td>{wastePercentage.toFixed(1)}%</td>
                    <td>
                      <div className="performance-bar">
                        <div 
                          className="performance-fill"
                          style={{ 
                            width: `${100 - wastePercentage}%`,
                            background: wastePercentage < 10 
                              ? 'linear-gradient(90deg, #10b981, #059669)' 
                              : wastePercentage < 20 
                              ? 'linear-gradient(90deg, #f59e0b, #d97706)' 
                              : 'linear-gradient(90deg, #ef4444, #dc2626)'
                          }}
                        ></div>
                      <span>{(100 - wastePercentage).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
