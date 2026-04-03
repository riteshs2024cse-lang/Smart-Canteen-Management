import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck2,
  Power,
  Save,
  RefreshCw,
  Ban,
  CheckCircle2
} from 'lucide-react';
import { bookingAPI, bookingSettingsAPI } from '../services/api';
import './PreOrders.css';

function PreOrders() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [closureMessage, setClosureMessage] = useState('');
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const isBookingOpen = settings?.isBookingEnabled ?? true;

  const formattedLastUpdated = useMemo(() => {
    if (!settings?.lastUpdated) {
      return 'Not available';
    }
    return new Date(settings.lastUpdated).toLocaleString();
  }, [settings]);

  const getMealCount = (mealType) => {
    if (!Array.isArray(stats)) {
      return 0;
    }

    return stats.find((item) => item?._id === mealType)?.totalBookings || 0;
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [settingsRes, statsRes, bookingsRes] = await Promise.all([
        bookingSettingsAPI.get(),
        bookingAPI.getStats(),
        bookingAPI.getAll({ limit: 10 })
      ]);

      setSettings(settingsRes.data);
      setClosureMessage(settingsRes.data?.closureMessage || 'Pre-ordering is unavailable right now.');

      const mealTypeStats = Array.isArray(statsRes?.data?.mealTypeStats)
        ? statsRes.data.mealTypeStats
        : [];

      setStats(mealTypeStats);
      setRecentBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    } catch (err) {
      console.error('Failed to load pre-order data:', err);
      alert('Failed to load pre-order data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBooking = async () => {
    try {
      const response = await bookingSettingsAPI.toggle();
      setSettings(response.data);
      alert(response.message || 'Pre-order settings updated.');
    } catch (err) {
      console.error('Failed to toggle pre-orders:', err);
      alert('Failed to update pre-order status.');
    }
  };

  const handleSaveClosureMessage = async () => {
    try {
      const response = await bookingSettingsAPI.update({ closureMessage });
      setSettings(response.data);
      alert('Closure message updated.');
    } catch (err) {
      console.error('Failed to update closure message:', err);
      alert('Failed to save closure message.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="preorders fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <CalendarCheck2 size={28} />
            Pre-Order Management
          </h2>
          <p className="page-subtitle">Manage pre-order availability and review user bookings</p>
        </div>
        <button className="btn btn-secondary" onClick={loadAllData}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="management-grid">
        <div className="card control-card">
          <h3 className="card-title">Pre-Order Switch</h3>
          <div className={`status-pill ${isBookingOpen ? 'open' : 'closed'}`}>
            {isBookingOpen ? <CheckCircle2 size={16} /> : <Ban size={16} />}
            {isBookingOpen ? 'Open for users' : 'Closed for users'}
          </div>
          <p className="helper-text">Last updated: {formattedLastUpdated}</p>
          <button className="btn btn-primary" onClick={handleToggleBooking}>
            <Power size={18} />
            {isBookingOpen ? 'Turn Off Pre-Orders' : 'Turn On Pre-Orders'}
          </button>
        </div>

        <div className="card control-card">
          <h3 className="card-title">Closure Message</h3>
          <p className="helper-text">Shown to users when pre-orders are disabled.</p>
          <textarea
            value={closureMessage}
            onChange={(event) => setClosureMessage(event.target.value)}
            rows="4"
            placeholder="Pre-ordering is unavailable right now."
          />
          <button className="btn btn-secondary" onClick={handleSaveClosureMessage}>
            <Save size={18} />
            Save Message
          </button>
        </div>

        <div className="card stats-card-wide">
          <h3 className="card-title">Booking Snapshot</h3>
          <div className="kpi-grid">
            <div className="kpi">
              <span className="kpi-label">Breakfast</span>
              <span className="kpi-value">{getMealCount('breakfast')}</span>
            </div>
            <div className="kpi">
              <span className="kpi-label">Lunch</span>
              <span className="kpi-value">{getMealCount('lunch')}</span>
            </div>
            <div className="kpi">
              <span className="kpi-label">Dinner</span>
              <span className="kpi-value">{getMealCount('dinner')}</span>
            </div>
          </div>
        </div>

        <div className="card list-card">
          <h3 className="card-title">Latest Pre-Orders</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Meal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No bookings yet.</td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.userName}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td className="capitalize">{booking.mealType}</td>
                      <td>
                        <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreOrders;
