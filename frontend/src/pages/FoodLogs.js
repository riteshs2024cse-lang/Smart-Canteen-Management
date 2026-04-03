import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save,
  Search,
  RefreshCw
} from 'lucide-react';
import { foodLogAPI } from '../services/api';
import './FoodLogs.css';

function FoodLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    foodItem: '',
    preparedQty: '',
    consumedQty: '',
    wastedQty: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await foodLogAPI.getAll();
      setLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && currentLog) {
        await foodLogAPI.update(currentLog._id, formData);
      } else {
        await foodLogAPI.create(formData);
      }
      fetchLogs();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save log:', err);
      alert('Failed to save food log');
    }
  };

  const handleEdit = (log) => {
    setCurrentLog(log);
    setFormData({
      foodItem: log.foodItem,
      preparedQty: log.preparedQty,
      consumedQty: log.consumedQty,
      wastedQty: log.wastedQty,
      date: new Date(log.date).toISOString().split('T')[0]
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await foodLogAPI.delete(id);
        fetchLogs();
      } catch (err) {
        console.error('Failed to delete log:', err);
        alert('Failed to delete food log');
      }
    }
  };

  const handleAdd = () => {
    setCurrentLog(null);
    setFormData({
      foodItem: '',
      preparedQty: '',
      consumedQty: '',
      wastedQty: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentLog(null);
  };

  const filteredLogs = logs.filter(log =>
    log.foodItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="food-logs fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Food Logs</h2>
          <p className="page-subtitle">Manage daily food preparation and consumption</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchLogs}>
            <RefreshCw size={20} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={20} />
            Add Log
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-date">Date</th>
                  <th className="col-item">Food Item</th>
                  <th className="col-number">Prepared</th>
                  <th className="col-number">Consumed</th>
                  <th className="col-number">Wasted</th>
                  <th className="col-waste">Waste %</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No food logs found</td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const wastePercent = ((log.wastedQty / log.preparedQty) * 100).toFixed(1);
                    return (
                      <tr key={log._id}>
                        <td className="col-date">{new Date(log.date).toLocaleDateString()}</td>
                        <td className="font-semibold col-item">{log.foodItem}</td>
                        <td className="col-number">{log.preparedQty}</td>
                        <td className="text-green col-number">{log.consumedQty}</td>
                        <td className="text-red col-number">{log.wastedQty}</td>
                        <td className="col-waste">
                          <span className={`badge ${wastePercent < 10 ? 'badge-success' : wastePercent < 20 ? 'badge-warning' : 'badge-danger'}`}>
                            {wastePercent}%
                          </span>
                        </td>
                        <td className="col-actions">
                          <div className="action-buttons">
                            <button
                              className="btn-icon btn-icon-edit"
                              onClick={() => handleEdit(log)}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-icon btn-icon-delete"
                              onClick={() => handleDelete(log._id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editMode ? 'Edit' : 'Add'} Food Log</h3>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="foodItem">Food Item *</label>
                  <input
                    type="text"
                    id="foodItem"
                    name="foodItem"
                    value={formData.foodItem}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Rice, Dal, Chapati"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="preparedQty">Prepared Qty *</label>
                    <input
                      type="number"
                      id="preparedQty"
                      name="preparedQty"
                      value={formData.preparedQty}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="consumedQty">Consumed Qty *</label>
                    <input
                      type="number"
                      id="consumedQty"
                      name="consumedQty"
                      value={formData.consumedQty}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="wastedQty">Wasted Qty *</label>
                  <input
                    type="number"
                    id="wastedQty"
                    name="wastedQty"
                    value={formData.wastedQty}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={20} />
                  {editMode ? 'Update' : 'Save'} Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodLogs;
