// API Base URL
const API_URL = 'http://localhost:5000/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if booking system is enabled
    checkBookingStatus();

    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;

    // Initialize all quantity inputs as disabled
    document.querySelectorAll('.food-item .quantity').forEach(input => {
        input.disabled = true;
    });

    // Form submission handlers
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);
    
    // Load bookings when user ID changes
    document.getElementById('userId').addEventListener('blur', loadMyBookings);

    // Enable/disable quantity inputs based on checkbox
    document.querySelectorAll('.food-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const quantityInput = e.target.closest('.food-item').querySelector('.quantity');
            if (e.target.checked) {
                quantityInput.disabled = false;
            } else {
                quantityInput.disabled = true;
            }
        });
    });
});

// Check booking system status
async function checkBookingStatus() {
    try {
        const response = await fetch(`${API_URL}/booking-settings`);
        const result = await response.json();

        if (result.success && !result.data.isBookingEnabled) {
            // Booking is disabled, show message and disable form
            showClosedMessage(result.data.closureMessage);
            disableBookingForm();
        }
    } catch (error) {
        console.error('Error checking booking status:', error);
    }
}

// Show closed message
function showClosedMessage(message) {
    const main = document.querySelector('.booking-main');
    const closedBanner = document.createElement('div');
    closedBanner.id = 'closedBanner';
    closedBanner.style.cssText = `
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: #78350f;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: 2px solid #fbbf24;
    `;
    closedBanner.innerHTML = `
        <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Pre-Booking Temporarily Closed</h3>
        <p style="font-size: 1rem; margin: 0;">${message || 'Pre-booking is currently closed. Please check back later.'}</p>
    `;
    main.insertBefore(closedBanner, main.firstChild);
}

// Disable booking form
function disableBookingForm() {
    const form = document.getElementById('bookingForm');
    const submitBtn = document.querySelector('button[type="submit"]');
    
    if (form) {
        // Disable all form elements
        const inputs = form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => {
            input.disabled = true;
        });
        
        // Change submit button text
        if (submitBtn) {
            submitBtn.textContent = 'Pre-booking Closed';
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
        
        // Disable food selection
        document.querySelectorAll('.food-item').forEach(item => {
            item.style.opacity = '0.5';
            item.style.pointerEvents = 'none';
        });
    }
}

// Handle booking form submission
async function handleBookingSubmit(e) {
    e.preventDefault();

    // Get user info
    const userId = document.getElementById('userId').value.trim();
    const userName = document.getElementById('userName').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();

    // Get booking details
    const bookingDate = document.getElementById('bookingDate').value;
    const mealType = document.getElementById('mealType').value;
    const specialRequests = document.getElementById('specialRequests').value.trim();

    // Validate basic fields
    if (!userId || !userName || !bookingDate || !mealType) {
        showError('Please fill in all required fields');
        return;
    }

    // Get selected food items with quantities
    const foodItems = [];
    document.querySelectorAll('.food-item input[type="checkbox"]:checked').forEach(checkbox => {
        const itemName = checkbox.value;
        const quantityInput = checkbox.closest('.food-item').querySelector('.quantity');
        const quantity = parseInt(quantityInput.value) || 1;
        
        foodItems.push({
            name: itemName,
            quantity: quantity
        });
    });

    // Validate food items
    if (foodItems.length === 0) {
        showError('Please select at least one food item');
        return;
    }

    // Prepare booking data
    const bookingData = {
        userId,
        userName,
        userEmail: userEmail || undefined,
        userPhone: userPhone || undefined,
        bookingDate,
        mealType,
        foodItems,
        specialRequests: specialRequests || undefined
    };

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        submitBtn.disabled = true;

        // Send booking request
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            // Show success modal
            showSuccessModal(result.data);
            
            // Reset form
            document.getElementById('bookingForm').reset();
            document.querySelectorAll('.food-item input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            
            // Reset date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('bookingDate').value = today;

            // Reload bookings
            loadMyBookings();
        } else {
            showError(result.error || 'Failed to create booking');
        }

        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        console.error('Booking error:', error);
        showError('Network error. Please check if the server is running.');
        
        // Restore button
        const submitBtn = e.target.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Book My Meal';
        submitBtn.disabled = false;
    }
}

// Load user's bookings
async function loadMyBookings() {
    const userId = document.getElementById('userId').value.trim();
    const bookingsList = document.getElementById('bookingsList');

    if (!userId) {
        bookingsList.innerHTML = '<p class="empty-state">Enter your ID above to view your bookings</p>';
        return;
    }

    try {
        bookingsList.innerHTML = '<p class="empty-state"><i class="fas fa-spinner fa-spin"></i> Loading bookings...</p>';

        const response = await fetch(`${API_URL}/bookings?userId=${userId}`);
        const result = await response.json();

        if (response.ok && result.data && result.data.length > 0) {
            bookingsList.innerHTML = result.data.map(booking => createBookingCard(booking)).join('');
        } else {
            bookingsList.innerHTML = '<p class="empty-state">No bookings found</p>';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsList.innerHTML = '<p class="empty-state">Error loading bookings. Please try again.</p>';
    }
}

// Create booking card HTML
function createBookingCard(booking) {
    const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const itemsList = booking.foodItems.map(item => 
        `<span class="item-tag">${item.name} (x${item.quantity})</span>`
    ).join('');

    const cancelButton = booking.status === 'confirmed' 
        ? `<button class="btn-cancel" onclick="cancelBooking('${booking._id}')">
            <i class="fas fa-times"></i> Cancel Booking
           </button>`
        : '';

    return `
        <div class="booking-card ${booking.status}">
            <div class="booking-header-card">
                <div class="booking-info">
                    <h4>${booking.mealType.charAt(0).toUpperCase() + booking.mealType.slice(1)}</h4>
                    <p><i class="fas fa-calendar"></i> ${bookingDate}</p>
                </div>
                <span class="booking-status ${booking.status}">${booking.status}</span>
            </div>
            <div class="booking-items">
                <h5>Food Items:</h5>
                <div class="items-list">
                    ${itemsList}
                </div>
            </div>
            ${booking.specialRequests ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                    <h5 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">Special Requests:</h5>
                    <p style="font-size: 13px; color: var(--text-primary);">${booking.specialRequests}</p>
                </div>
            ` : ''}
            ${cancelButton ? `<div class="booking-actions">${cancelButton}</div>` : ''}
        </div>
    `;
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
            method: 'PUT'
        });

        const result = await response.json();

        if (response.ok) {
            showSuccess('Booking cancelled successfully');
            loadMyBookings();
        } else {
            showError(result.error || 'Failed to cancel booking');
        }
    } catch (error) {
        console.error('Cancel error:', error);
        showError('Network error. Please try again.');
    }
}

// Show success modal
function showSuccessModal(booking) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('successMessage');
    
    const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const itemsText = booking.foodItems.map(item => `${item.name} (x${item.quantity})`).join(', ');

    message.innerHTML = `
        Your <strong>${booking.mealType}</strong> on <strong>${bookingDate}</strong> has been confirmed.<br><br>
        <small style="color: var(--text-secondary);">Items: ${itemsText}</small>
    `;

    modal.classList.add('active');
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Show error message
function showError(message) {
    alert('Error: ' + message);
}

// Show success message
function showSuccess(message) {
    alert(message);
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeSuccessModal();
    }
});
