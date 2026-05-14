// Smart Canteen Management System - Main JavaScript

const API_BASE = '/api';
let charts = {};
let aiTipInterval = null;

function getAuthHeaders(extraHeaders = {}) {
    if (!window.Auth) {
        return extraHeaders;
    }
    return window.Auth.getAuthHeaders(extraHeaders);
}

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    const user = await window.Auth.requireRole('admin');
    if (!user) {
        return;
    }

    initAdminAIAssistant();

    const userNameEl = document.getElementById('headerUserName');
    if (userNameEl) {
        userNameEl.textContent = user.name || 'Admin';
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => window.Auth.logout());
    }

    initNavigation();
    initMenuToggle();
    initFormHandlers();
    loadDashboardData();
    setDefaultDates();
});

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            navigateTo(pageName);
        });
    });
}

function navigateTo(pageName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    
    // Update active page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'food-logs': 'Food Logs',
        'bookings': 'Meal Bookings',
        'predictions': 'AI Predictions',
        'feedback': 'Developer Requests'
    };
    document.getElementById('pageTitle').textContent = titles[pageName];
    updateAdminAITip(pageName);
    
    // Load page data
    switch(pageName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'food-logs':
            loadFoodLogs();
            break;
        case 'bookings':
            loadBookingsData();
            loadBookingStats();
            loadBookingSettings();
            break;
        case 'predictions':
            loadPredictions();
            loadHistoricalData();
            break;
        case 'feedback':
            loadFeedback();
            break;
    }
}

function initAdminAIAssistant() {
    updateAdminAITip('dashboard');
}

function updateAdminAITip(pageName) {
    const tipElement = document.getElementById('adminAITip');
    if (!tipElement) {
        return;
    }

    const pageTips = {
        dashboard: [
            'Monitoring live prep, consumption, and waste efficiency.',
            'Use trend cards to detect sudden demand shifts quickly.',
            'AI highlights where operational optimization is needed.'
        ],
        'food-logs': [
            'Capture daily logs accurately to improve prediction quality.',
            'Consistent food-item naming helps cleaner analytics results.',
            'Lower variance in logs improves AI confidence scores.'
        ],
        bookings: [
            'Review booking counts to align kitchen preparation plans.',
            'Filter by meal and status to spot cancellation patterns.',
            'Booking signals improve tomorrow demand forecasts.'
        ],
        predictions: [
            'AI forecast blends recent usage and historical behavior.',
            'Compare risk score against prepared quantity before dispatch.',
            'Adjust menu plans early to reduce waste percentage.'
        ],
        feedback: [
            'Capture feature requests clearly for faster implementation.',
            'Use concise titles to help developers prioritize correctly.',
            'Operational pain points make the best improvement tickets.'
        ]
    };

    const tips = pageTips[pageName] || pageTips.dashboard;
    let tipIndex = 0;
    tipElement.textContent = tips[tipIndex];

    if (aiTipInterval) {
        clearInterval(aiTipInterval);
    }

    aiTipInterval = setInterval(() => {
        tipIndex = (tipIndex + 1) % tips.length;
        tipElement.textContent = tips[tipIndex];
    }, 3500);
}

// Menu Toggle for Mobile
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        // Use March 12, 2026 (hardcoded for demo)
        const todayStr = '2026-03-12';
        
        // Load dashboard stats for today only
        const response = await fetch(`${API_BASE}/dashboard?startDate=${todayStr}&endDate=${todayStr}`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to load dashboard data');
        }
        
        if (result.success && result.data && result.data.summary) {
            updateDashboardStats(result.data.summary);
        } else {
            // If no data for today, show zeros
            updateDashboardStats({
                totalPrepared: 0,
                totalConsumed: 0,
                totalWasted: 0,
                wastePercentage: 0,
                logsCount: 0
            });
        }
        
        // Load charts
        loadDashboardCharts();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

function updateDashboardStats(data) {
    document.getElementById('totalPrepared').textContent = `${Math.round(data.totalPrepared) || 0} kg`;
    document.getElementById('totalConsumed').textContent = `${Math.round(data.totalConsumed) || 0} kg`;
    document.getElementById('totalWasted').textContent = `${Math.round(data.totalWasted) || 0} kg`;
    document.getElementById('wastePercentage').textContent = `${data.wastePercentage ? data.wastePercentage.toFixed(1) : 0}%`;
    
    // Update logs count if element exists
    const logsCountEl = document.getElementById('totalLogsCount');
    if (logsCountEl && data.logsCount) {
        logsCountEl.textContent = data.logsCount;
    }
}

async function loadHistoricalData() {
    try {
        const response = await fetch(`${API_BASE}/food-log?limit=100`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load historical data');
        }
        
        const tbody = document.getElementById('historicalDataBody');
        
        if (data.success && data.data.length > 0) {
            // Group by food item
            const groupedData = data.data.reduce((acc, log) => {
                if (!acc[log.foodItem]) {
                    acc[log.foodItem] = {
                        prepared: 0,
                        consumed: 0,
                        wasted: 0,
                        count: 0
                    };
                }
                acc[log.foodItem].prepared += log.preparedQty;
                acc[log.foodItem].consumed += log.consumedQty;
                acc[log.foodItem].wasted += log.wastedQty;
                acc[log.foodItem].count++;
                return acc;
            }, {});
            
            tbody.innerHTML = Object.entries(groupedData).map(([foodItem, stats]) => {
                const wastePercent = ((stats.wasted / stats.prepared) * 100).toFixed(1);
                const trend = wastePercent < 10 ? 'Improving' : wastePercent < 20 ? 'Stable' : 'Needs Attention';
                const trendClass = wastePercent < 10 ? 'positive' : wastePercent < 20 ? '' : 'negative';
                
                return `
                    <tr>
                        <td><strong>${foodItem}</strong></td>
                        <td>${stats.prepared.toFixed(1)} kg</td>
                        <td>${stats.consumed.toFixed(1)} kg</td>
                        <td style="color: var(--warning-500);">${stats.wasted.toFixed(1)} kg</td>
                        <td><span class="stat-change ${trendClass}">${wastePercent}%</span></td>
                        <td><span class="stat-change ${trendClass}">${trend}</span></td>
                    </tr>
                `;
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No historical data available</td></tr>';
        }
    } catch (error) {
        console.error('Error loading historical data:', error);
    }
}



async function loadDashboardCharts() {
    try {
        const response = await fetch(`${API_BASE}/food-log?limit=30`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load chart data');
        }
        
        if (data.success && data.data.length > 0) {
            createConsumptionWasteChart(data.data);
            createFoodItemsChart(data.data);
        }
    } catch (error) {
        console.error('Error loading charts:', error);
    }
}

function createConsumptionWasteChart(data) {
    const ctx = document.getElementById('consumptionWasteChart');
    if (!ctx) return;
    
    // Group by date
    const groupedData = data.reduce((acc, log) => {
        const date = formatDate(log.date);
        if (!acc[date]) {
            acc[date] = { consumed: 0, wasted: 0 };
        }
        acc[date].consumed += log.consumedQty;
        acc[date].wasted += log.wastedQty;
        return acc;
    }, {});
    
    const dates = Object.keys(groupedData).slice(-7);
    const consumed = dates.map(date => groupedData[date].consumed);
    const wasted = dates.map(date => groupedData[date].wasted);
    
    if (charts.consumptionWaste) {
        charts.consumptionWaste.destroy();
    }
    
    charts.consumptionWaste = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Consumed (kg)',
                data: consumed,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Wasted (kg)',
                data: wasted,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    ctx.style.height = '300px';
}

function createFoodItemsChart(data) {
    const ctx = document.getElementById('foodItemsChart');
    if (!ctx) return;
    
    // Group by food item
    const groupedData = data.reduce((acc, log) => {
        if (!acc[log.foodItem]) {
            acc[log.foodItem] = 0;
        }
        acc[log.foodItem] += log.consumedQty;
        return acc;
    }, {});
    
    const foodItems = Object.keys(groupedData);
    const quantities = Object.values(groupedData);
    
    if (charts.foodItems) {
        charts.foodItems.destroy();
    }
    
    charts.foodItems = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: foodItems,
            datasets: [{
                data: quantities,
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#ec4899',
                    '#14b8a6',
                    '#f97316'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    ctx.style.height = '300px';
}

// Food Logs Functions
async function loadFoodLogs() {
    try {
        // Build query parameters from filters
        let url = `${API_BASE}/food-log`;
        const params = new URLSearchParams();
        
        const startDate = document.getElementById('startDate')?.value;
        const endDate = document.getElementById('endDate')?.value;
        const foodItem = document.getElementById('foodItemFilter')?.value;
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (foodItem) params.append('foodItem', foodItem);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load food logs');
        }
        
        const tbody = document.getElementById('foodLogsBody');
        
        if (data.success && data.data && data.data.length > 0) {
            tbody.innerHTML = data.data.map(log => {
                const wastePercent = ((log.wastedQty / log.preparedQty) * 100).toFixed(1);
                return `
                    <tr>
                        <td>${formatDate(log.date)}</td>
                        <td><strong>${log.foodItem}</strong></td>
                        <td>${log.preparedQty} kg</td>
                        <td>${log.consumedQty} kg</td>
                        <td style="color: var(--warning-500);">${log.wastedQty} kg</td>
                        <td><span class="stat-change ${wastePercent < 10 ? 'positive' : 'negative'}">${wastePercent}%</span></td>
                        <td>${log.dayOfWeek}</td>
                        <td>
                            <button class="btn-secondary" style="padding: 0.5rem 1rem;" onclick="editLog('${log._id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No food logs found</td></tr>';
        }
        
        // Populate food item filter if not already populated
        if (data.success && data.data && data.data.length > 0 && !foodItem) {
            const foodItems = [...new Set(data.data.map(log => log.foodItem))];
            const select = document.getElementById('foodItemFilter');
            const currentValue = select.value;
            select.innerHTML = '<option value="">All Items</option>' + 
                foodItems.map(item => `<option value="${item}">${item}</option>`).join('');
            select.value = currentValue;
        }
        
    } catch (error) {
        console.error('Error loading food logs:', error);
        showError('Failed to load food logs');
    }
}

function setDefaultDates() {
    // Use March 12, 2026 as "today" for demo
    const today = '2026-03-12';
    const weekAgo = '2026-03-11';
    
    if (document.getElementById('startDate')) {
        document.getElementById('startDate').value = weekAgo;
        document.getElementById('endDate').value = today;
    }
    
    if (document.getElementById('logDate')) {
        document.getElementById('logDate').value = today;
    }
}

function applyFilters() {
    loadFoodLogs();
}

function openAddFoodLog() {
    const modal = document.getElementById('addFoodLogModal');
    modal.classList.add('active');
    
    // Set today's date and day
    const today = new Date();
    document.getElementById('logDate').value = today.toISOString().split('T')[0];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    document.getElementById('logDayOfWeek').value = days[today.getDay()];
}

function closeModal() {
    document.getElementById('addFoodLogModal').classList.remove('active');
    document.getElementById('addFoodLogForm').reset();
}

function initFormHandlers() {
    const foodLogForm = document.getElementById('addFoodLogForm');
    if (foodLogForm) {
        foodLogForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const preparedQty = parseFloat(document.getElementById('logPrepared').value);
            const consumedQty = parseFloat(document.getElementById('logConsumed').value);
            const wastedQty = preparedQty - consumedQty;
            
            const logData = {
                date: document.getElementById('logDate').value,
                foodItem: document.getElementById('logFoodItem').value,
                preparedQty: preparedQty,
                consumedQty: consumedQty,
                wastedQty: wastedQty,
                dayOfWeek: document.getElementById('logDayOfWeek').value
            };
            
            try {
                const response = await fetch(`${API_BASE}/food-log`, {
                    method: 'POST',
                    headers: getAuthHeaders({
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(logData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showSuccess('Food log added successfully!');
                    closeModal();
                    loadFoodLogs();
                    loadDashboardData();
                } else {
                    showError('Failed to add food log');
                }
            } catch (error) {
                console.error('Error adding food log:', error);
                showError('Failed to add food log');
            }
        });
    }
    
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const feedbackData = {
                name: document.getElementById('feedbackName').value,
                email: document.getElementById('feedbackEmail').value,
                type: document.getElementById('feedbackType').value,
                message: document.getElementById('feedbackMessage').value,
                date: new Date().toISOString()
            };
            
            // Store in localStorage for now
            let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
            feedbacks.unshift(feedbackData);
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
            
            showSuccess('Request sent to developers successfully!');
            feedbackForm.reset();
            loadFeedback();
        });
    }
}

// Predictions Functions
async function loadPredictions() {
    try {
        const response = await fetch(`${API_BASE}/predict-demand`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to load predictions');
        }

        const data = result.data || result;
        
        // Update summary cards
        document.getElementById('expectedDiners').textContent = data.expectedDiners || '-';
        document.getElementById('recommendedQty').textContent = data.recommendedFoodQuantity ? `${data.recommendedFoodQuantity} kg` : '-';
        document.getElementById('wasteRisk').textContent =
            data.wasteRiskScore !== undefined && data.wasteRiskScore !== null
                ? `${(data.wasteRiskScore * 100).toFixed(0)}%`
                : '-';
        document.getElementById('aiConfidence').textContent = data.confidence ? `${data.confidence}%` : 'High';
        
        // Display food item predictions
        const grid = document.getElementById('foodPredictionsGrid');
        
        if (data.foodItemPredictions && data.foodItemPredictions.length > 0) {
            grid.innerHTML = data.foodItemPredictions.map(item => {
                const wasteRisk = item.wasteRisk || 0;
                const riskColor = wasteRisk < 0.3 ? 'var(--success-500)' : wasteRisk < 0.6 ? 'var(--warning-500)' : 'var(--error-500)';
                const riskLabel = wasteRisk < 0.3 ? 'Low' : wasteRisk < 0.6 ? 'Medium' : 'High';
                
                return `
                    <div class="food-prediction-item">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                            <h4 style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900);">${item.foodItem}</h4>
                            <span style="padding: 0.25rem 0.75rem; background: ${riskColor}; color: white; border-radius: var(--radius); font-size: 0.75rem; font-weight: 600;">${riskLabel} Risk</span>
                        </div>
                        <div style="display: grid; gap: 0.75rem;">
                            <div>
                                <p style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: 0.25rem;">Predicted Consumption</p>
                                <p style="font-size: 1.25rem; font-weight: 700; color: var(--primary-600);">${item.predictedConsumption || item.recommendedQty} kg</p>
                            </div>
                            <div>
                                <p style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: 0.25rem;">Recommended Quantity</p>
                                <p style="font-size: 1.125rem; font-weight: 600; color: var(--gray-700);">${item.recommendedQty} kg</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            grid.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: 2rem;">No predictions available</p>';
        }
        
    } catch (error) {
        console.error('Error loading predictions:', error);
        showError('Failed to load predictions');
    }
}

function refreshPredictions() {
    loadPredictions();
    loadHistoricalData();
}

// Booking Functions
async function loadBookingsData() {
    try {
        const tbody = document.getElementById('bookingsTableBody');
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Loading bookings...</td></tr>';

        const filters = buildBookingFilters();
        const response = await fetch(`${API_BASE}/bookings${filters}`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            tbody.innerHTML = result.data.map(booking => createBookingRow(booking)).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--gray-500);">No bookings found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        document.getElementById('bookingsTableBody').innerHTML = 
            '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--error-red);">Error loading bookings</td></tr>';
    }
}

async function loadBookingStats() {
    try {
        const response = await fetch(`${API_BASE}/bookings/stats`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (result.success) {
            const stats = result.data;
            
            const todayBookingsEl = document.getElementById('todayBookings');
            const expectedDinersEl = document.getElementById('bookingExpectedDiners');
            const todayDateEl = document.getElementById('todayDate');
            
            if (todayBookingsEl) todayBookingsEl.textContent = stats.todayBookings || 0;
            if (expectedDinersEl) expectedDinersEl.textContent = stats.expectedDiners || 0;
            
            // Display today's date
            if (todayDateEl) {
                const today = new Date('2026-03-12');
                todayDateEl.textContent = today.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
            }
        }
    } catch (error) {
        console.error('Error loading booking stats:', error);
    }
}

function buildBookingFilters() {
    const date = document.getElementById('bookingFilterDate')?.value;
    const mealType = document.getElementById('bookingFilterMeal')?.value;
    const status = document.getElementById('bookingFilterStatus')?.value;
    const userId = document.getElementById('bookingFilterUser')?.value;

    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (mealType) params.append('mealType', mealType);
    if (status) params.append('status', status);
    if (userId) params.append('userId', userId);

    return params.toString() ? `?${params.toString()}` : '';
}

function applyBookingFilters() {
    loadBookingsData();
}

function createBookingRow(booking) {
    const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const foodItems = booking.foodItems.map(item => 
        `${item.name} (x${item.quantity})`
    ).join(', ');

    const statusColors = {
        'confirmed': 'var(--success-green)',
        'cancelled': 'var(--error-red)',
        'completed': 'var(--primary-blue)'
    };

    const statusBg = {
        'confirmed': 'rgba(34, 197, 94, 0.1)',
        'cancelled': 'rgba(239, 68, 68, 0.1)',
        'completed': 'rgba(59, 130, 246, 0.1)'
    };

    const statusColor = statusColors[booking.status] || 'var(--gray-500)';
    const statusBackground = statusBg[booking.status] || 'var(--gray-100)';

    const cancelButton = booking.status === 'confirmed' 
        ? `<button class="btn-danger-small" onclick="adminCancelBooking('${booking._id}')">
            <i class="fas fa-times"></i> Cancel
           </button>`
        : '<span style="color: var(--gray-500); font-size: 0.875rem;">-</span>';

    return `
        <tr>
            <td>${booking.userId}</td>
            <td>${booking.userName}</td>
            <td>${bookingDate}</td>
            <td style="text-transform: capitalize;">${booking.mealType}</td>
            <td style="max-width: 250px;">${foodItems}</td>
            <td>
                <span style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${statusColor}; background: ${statusBackground};">
                    ${booking.status}
                </span>
            </td>
            <td>${cancelButton}</td>
        </tr>
    `;
}

async function adminCancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });

        const result = await response.json();

        if (result.success) {
            alert('Booking cancelled successfully');
            loadBookingsData();
            loadBookingStats();
        } else {
            alert('Error: ' + (result.error || 'Failed to cancel booking'));
        }
    } catch (error) {
        console.error('Cancel error:', error);
        alert('Network error. Please try again.');
    }
}

// Booking Settings Functions
async function loadBookingSettings() {
    try {
        const response = await fetch(`${API_BASE}/booking-settings`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();

        if (result.success) {
            const settings = result.data;
            const toggle = document.getElementById('bookingToggle');
            const statusText = document.getElementById('bookingStatusText');
            
            if (toggle) {
                toggle.checked = settings.isBookingEnabled;
                // Remove existing event listener to avoid duplicates
                toggle.removeEventListener('change', handleBookingToggle);
                toggle.addEventListener('change', handleBookingToggle);
            }
            
            if (statusText) {
                statusText.textContent = settings.isBookingEnabled ? 'Enabled' : 'Disabled';
                statusText.style.color = settings.isBookingEnabled ? 'var(--primary-500)' : 'var(--error-500)';
            }
        }
    } catch (error) {
        console.error('Error loading booking settings:', error);
    }
}

async function handleBookingToggle(event) {
    const isEnabled = event.target.checked;
    const statusText = document.getElementById('bookingStatusText');
    
    try {
        const response = await fetch(`${API_BASE}/booking-settings/toggle`, {
            method: 'POST',
            headers: getAuthHeaders({
                'Content-Type': 'application/json'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (statusText) {
                statusText.textContent = result.data.isBookingEnabled ? 'Enabled' : 'Disabled';
                statusText.style.color = result.data.isBookingEnabled ? 'var(--primary-500)' : 'var(--error-500)';
            }
            
            // Show success message
            const message = result.data.isBookingEnabled 
                ? 'Pre-booking system is now enabled. Users can book meals.' 
                : 'Pre-booking system is now disabled. Users cannot book meals.';
            
            // Create a temporary notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: ${result.data.isBookingEnabled ? 'var(--primary-500)' : 'var(--warning-500)'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        } else {
            // Revert toggle if failed
            event.target.checked = !isEnabled;
            alert('Failed to update booking status: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Toggle error:', error);
        event.target.checked = !isEnabled;
        alert('Network error. Please try again.');
    }
}

// Feedback Functions
function loadFeedback() {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const container = document.getElementById('feedbackItems');
    
    if (feedbacks.length > 0) {
        container.innerHTML = feedbacks.map((feedback, index) => `
            <div class="feedback-item" style="background: white; border: 1px solid var(--gray-200); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                    <div>
                        <strong style="color: var(--gray-900);">${feedback.name}</strong>
                        ${feedback.email ? `<span style="color: var(--gray-500); font-size: 0.875rem;"> - ${feedback.email}</span>` : ''}
                    </div>
                    <span style="padding: 0.25rem 0.75rem; background: var(--primary-100); color: var(--primary-700); border-radius: var(--radius); font-size: 0.75rem; font-weight: 600;">${feedback.type}</span>
                </div>
                <p style="color: var(--gray-700); margin-bottom: 0.5rem;">${feedback.message}</p>
                <p style="font-size: 0.75rem; color: var(--gray-500);">${formatDate(feedback.date)}</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: 2rem;">No management requests submitted yet</p>';
    }
}



// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showSuccess(message) {
    // Simple alert for now - can be improved with a toast notification
    alert(message);
}

function showError(message) {
    console.error(message);
    alert(message);
}

function editLog(id) {
    // TODO: Implement edit functionality
    alert('Edit functionality coming soon!');
}
