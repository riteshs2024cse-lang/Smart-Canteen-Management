import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Leaf,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

const COLORS = ['#10b981', '#059669', '#22c55e', '#16a34a'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      setStats(data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <AlertCircle size={48} />
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          <RefreshCw size={20} />
          Retry
        </button>
      </div>
    );
  }

  const summary = stats?.summary || {};
  const foodItemBreakdown = stats?.foodItemBreakdown || [];
  const dailyTrends = stats?.dailyTrends || [];

  // Prepare chart data
  const wasteData = foodItemBreakdown.map(item => ({
    name: item.foodItem,
    wasted: item.totalWasted,
    consumed: item.totalConsumed
  }));

  const trendData = dailyTrends.slice(0, 7).reverse().map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    prepared: trend.totalPrepared,
    consumed: trend.totalConsumed,
    wasted: trend.totalWasted
  }));

  return (
    <div className="dashboard fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p className="page-subtitle">Real-time canteen performance metrics</p>
        </div>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          <RefreshCw size={20} />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-header">
            <div>
              <div className="stats-value">{summary.totalPrepared || 0}</div>
              <div className="stats-label">Total Prepared</div>
            </div>
            <div className="stats-icon">
              <Utensils size={24} />
            </div>
          </div>
          <div className="stats-trend positive">
            <TrendingUp size={16} />
            <span>{summary.logsCount || 0} total logs</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <div>
              <div className="stats-value">{summary.totalConsumed || 0}</div>
              <div className="stats-label">Total Consumed</div>
            </div>
            <div className="stats-icon" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
              <Users size={24} />
            </div>
          </div>
          <div className="stats-trend positive">
            <TrendingUp size={16} />
            <span>{((summary.totalConsumed / summary.totalPrepared) * 100 || 0).toFixed(1)}% efficiency</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <div>
              <div className="stats-value">{summary.totalWasted || 0}</div>
              <div className="stats-label">Total Wasted</div>
            </div>
            <div className="stats-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <TrendingDown size={24} />
            </div>
          </div>
          <div className="stats-trend negative">
            <TrendingDown size={16} />
            <span>{(summary.wastePercentage || 0).toFixed(1)}% waste</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <div>
              <div className="stats-value">{(100 - (summary.wastePercentage || 0)).toFixed(1)}%</div>
              <div className="stats-label">Eco Score</div>
            </div>
            <div className="stats-icon" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
              <Leaf size={24} />
            </div>
          </div>
          <div className="stats-trend positive">
            <Leaf size={16} />
            <span>Sustainable operation</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Daily Trends Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart3 size={20} />
              Weekly Trends
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorPrepared" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="prepared" stroke="#10b981" fillOpacity={1} fill="url(#colorPrepared)" name="Prepared" />
              <Area type="monotone" dataKey="consumed" stroke="#059669" fillOpacity={1} fill="url(#colorConsumed)" name="Consumed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Food Item Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Utensils size={20} />
              Food Item Analysis
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wasteData}>
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
              <Bar dataKey="consumed" fill="#10b981" name="Consumed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="wasted" fill="#ef4444" name="Wasted" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Food Items Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Food Items Breakdown</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Prepared</th>
                <th>Consumed</th>
                <th>Wasted</th>
                <th>Waste %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {foodItemBreakdown.map((item, index) => (
                <tr key={index}>
                  <td className="font-semibold">{item.foodItem}</td>
                  <td>{item.totalPrepared}</td>
                  <td className="text-green">{item.totalConsumed}</td>
                  <td className="text-red">{item.totalWasted}</td>
                  <td>{item.wastePercentage.toFixed(1)}%</td>
                  <td>
                    <span className={`badge ${item.wastePercentage < 10 ? 'badge-success' : item.wastePercentage < 20 ? 'badge-warning' : 'badge-danger'}`}>
                      {item.wastePercentage < 10 ? 'Excellent' : item.wastePercentage < 20 ? 'Good' : 'High Waste'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
