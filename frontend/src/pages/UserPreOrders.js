import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck2,
  ShoppingBag,
  Ban,
  Clock3,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { bookingAPI, bookingSettingsAPI } from '../services/api';
import { clearAuth, getAuth } from '../auth';
import './PreOrders.css';

const MEAL_OPTIONS = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' }
];

const AVAILABLE_ITEMS = [
  { name: 'Poha', mealTypes: ['breakfast'], description: 'Light and quick breakfast' },
  { name: 'Idli', mealTypes: ['breakfast'], description: 'Steamed rice cakes' },
  { name: 'Dosa', mealTypes: ['breakfast'], description: 'Crispy fermented crepe' },
  { name: 'Rice', mealTypes: ['lunch', 'dinner'], description: 'Plain steamed rice' },
  { name: 'Dal', mealTypes: ['lunch', 'dinner'], description: 'Protein-rich lentil curry' },
  { name: 'Chapati', mealTypes: ['lunch', 'dinner'], description: 'Whole wheat flatbread' },
  { name: 'Sabzi', mealTypes: ['lunch', 'dinner'], description: 'Seasonal vegetable curry' },
  { name: 'Sambar', mealTypes: ['breakfast', 'lunch', 'dinner'], description: 'South Indian stew' }
];

function UserPreOrders() {
  const auth = getAuth();
  const user = auth?.user;

  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    mealType: 'lunch',
    selectedItems: {},
    specialRequests: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const isBookingOpen = settings?.isBookingEnabled ?? true;
  const closureMessage = useMemo(() => settings?.closureMessage || 'Pre-ordering is currently closed.', [settings]);
  const availableItems = useMemo(() => {
    return AVAILABLE_ITEMS.filter((item) => item.mealTypes.includes(bookingForm.mealType));
  }, [bookingForm.mealType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsRes, bookingsRes] = await Promise.all([
        bookingSettingsAPI.get(),
        bookingAPI.getByUser(user?.userId)
      ]);

      setSettings(settingsRes.data);
      setMyBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    } catch (err) {
      console.error('Failed to load pre-order data:', err);
      alert('Failed to load your pre-orders.');
    } finally {
      setLoading(false);
    }
  };

  const onBookingInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'mealType') {
      setBookingForm((prev) => ({
        ...prev,
        mealType: value,
        selectedItems: {}
      }));
      return;
    }

    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleItem = (itemName, checked) => {
    setBookingForm((prev) => {
      const nextSelectedItems = { ...prev.selectedItems };

      if (checked) {
        nextSelectedItems[itemName] = nextSelectedItems[itemName] || { quantity: 1 };
      } else {
        delete nextSelectedItems[itemName];
      }

      return {
        ...prev,
        selectedItems: nextSelectedItems
      };
    });
  };

  const changeItemQuantity = (itemName, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setBookingForm((prev) => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        [itemName]: {
          ...(prev.selectedItems[itemName] || {}),
          quantity: safeQuantity
        }
      }
    }));
  };

  const handleCreateBooking = async (event) => {
    event.preventDefault();

    const foodItems = Object.entries(bookingForm.selectedItems)
      .map(([name, item]) => ({
        name,
        quantity: Math.max(1, Number(item.quantity) || 1)
      }))
      .filter((item) => item.quantity > 0);

    if (!bookingForm.bookingDate || !bookingForm.mealType || foodItems.length === 0) {
      alert('Please fill all required fields and select at least one available food item.');
      return;
    }

    try {
      await bookingAPI.create({
        bookingDate: bookingForm.bookingDate,
        mealType: bookingForm.mealType,
        specialRequests: bookingForm.specialRequests,
        foodItems
      });

      setBookingForm((prev) => ({
        ...prev,
        selectedItems: {},
        specialRequests: ''
      }));
      await loadData();
      alert('Pre-order created successfully.');
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert(err?.message || 'Failed to create pre-order.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this pre-order?')) {
      return;
    }

    try {
      await bookingAPI.cancel(bookingId);
      await loadData();
      alert('Pre-order cancelled.');
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert('Failed to cancel pre-order.');
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/user/login';
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
            User Pre-Orders
          </h2>
          <p className="page-subtitle">Welcome {user?.name}. Place and track your meal pre-orders.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="user-grid">
        <div className="card">
          <h3 className="card-title">Profile</h3>
          <div className="form-grid">
            <label>
              User ID
              <input value={user?.userId || ''} disabled />
            </label>
            <label>
              Name
              <input value={user?.name || ''} disabled />
            </label>
            <label>
              Email
              <input value={user?.email || ''} disabled />
            </label>
            <label>
              Phone
              <input value={user?.phone || ''} disabled />
            </label>
          </div>
          <button className="btn btn-secondary" onClick={loadData}>
            <ShoppingBag size={18} />
            Refresh My Pre-Orders
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">Create Pre-Order</h3>
          {!isBookingOpen && (
            <div className="closed-banner">
              <Ban size={18} />
              <span>{closureMessage}</span>
            </div>
          )}
          <form onSubmit={handleCreateBooking} className="stack-form">
            <label>
              Date *
              <input
                type="date"
                name="bookingDate"
                value={bookingForm.bookingDate}
                onChange={onBookingInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </label>
            <label>
              Meal Type *
              <select name="mealType" value={bookingForm.mealType} onChange={onBookingInputChange}>
                {MEAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="available-items-section">
              <div className="section-copy">
                <label>Available Items *</label>
                <p className="helper-text">Pick from the items served for the selected meal and adjust quantities.</p>
              </div>

              <div className="available-items-grid">
                {availableItems.map((item) => {
                  const isSelected = Boolean(bookingForm.selectedItems[item.name]);
                  const quantity = bookingForm.selectedItems[item.name]?.quantity || 1;

                  return (
                    <div className={`available-item-card ${isSelected ? 'selected' : ''}`} key={item.name}>
                      <label className="available-item-toggle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleItem(item.name, e.target.checked)}
                        />
                        <span>
                          <strong>{item.name}</strong>
                          <small>{item.description}</small>
                        </span>
                      </label>

                      <div className="available-item-actions">
                        <label>
                          Quantity
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            disabled={!isSelected}
                            onChange={(e) => changeItemQuantity(item.name, e.target.value)}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="selection-summary">
                <span className="helper-text">Selected items:</span>
                <div className="selection-chip-list">
                  {Object.keys(bookingForm.selectedItems).length > 0 ? (
                    Object.entries(bookingForm.selectedItems).map(([name, item]) => (
                      <span className="selection-chip" key={name}>
                        {name} x{Math.max(1, Number(item.quantity) || 1)}
                      </span>
                    ))
                  ) : (
                    <span className="selection-empty">No items selected yet.</span>
                  )}
                </div>
              </div>
            </div>
            <label>
              Special Request
              <textarea
                name="specialRequests"
                value={bookingForm.specialRequests}
                onChange={onBookingInputChange}
                rows="3"
                placeholder="Example: less oil, no spice"
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={!isBookingOpen}>
              <CalendarCheck2 size={18} />
              Place Pre-Order
            </button>
          </form>
        </div>

        <div className="card list-card">
          <div className="split-header">
            <h3 className="card-title">My Booking History</h3>
            <button className="btn btn-secondary" onClick={loadData}>
              <Clock3 size={16} />
              Refresh
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Meal</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No bookings found.</td>
                  </tr>
                ) : (
                  myBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td className="capitalize">{booking.mealType}</td>
                      <td>{booking.foodItems?.map((item) => item.name).join(', ') || '-'}</td>
                      <td>
                        <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        {booking.status === 'confirmed' ? (
                          <button className="btn-icon btn-icon-delete" onClick={() => handleCancelBooking(booking._id)} title="Cancel booking">
                            <Ban size={16} />
                          </button>
                        ) : (
                          <span className="muted-inline">
                            <MessageSquare size={14} />
                            Closed
                          </span>
                        )}
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

export default UserPreOrders;
