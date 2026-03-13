# Pre-Booking System Guide

## Overview
The Smart Canteen now includes a **Pre-Booking System** (Phase 1) that allows students and staff to book their meals in advance. This helps improve demand prediction and reduce food waste.

## System Architecture

### 1. **User Booking Portal**
   - **URL**: http://localhost:5000/booking.html
   - **Purpose**: Allows end users (students/staff) to book meals
   - **Features**:
     - User registration (ID, Name, Email, Phone)
     - Date and meal type selection (Breakfast/Lunch/Dinner)
     - Food item selection with quantities
     - View personal booking history
     - Cancel bookings
     - Special dietary requests

### 2. **Admin Dashboard** 
   - **URL**: http://localhost:5000
   - **Purpose**: View and manage all bookings
   - **Features**:
     - Booking statistics and analytics
     - View all bookings with filters
     - Cancel bookings on behalf of users
     - Export booking data
     - Integration with AI predictions

## How to Use

### For Users (Students/Staff):

1. **Open User Booking Portal**: http://localhost:5000/booking.html

2. **Fill in Your Information**:
   - Student/Employee ID (required)
   - Full Name (required)
   - Email (optional)
   - Phone (optional)

3. **Book a Meal**:
   - Select booking date
   - Choose meal type (Breakfast/Lunch/Dinner)
   - Check the food items you want
   - Adjust quantities if needed
   - Add special requests (optional)
   - Click "Book My Meal"

4. **View Your Bookings**:
   - Your bookings appear below the form
   - See booking status: Confirmed, Cancelled, or Completed
   - Cancel confirmed bookings if needed

### For Administrators:

1. **Open Admin Dashboard**: http://localhost:5000

2. **Navigate to Bookings Section**:
   - Click "Bookings" in the left sidebar
   - View booking statistics at the top
   - See all bookings in the table

3. **Filter Bookings**:
   - Filter by date
   - Filter by meal type
   - Filter by status
   - Search by user ID

4. **Manage Bookings**:
   - Cancel bookings if needed
   - View food item details
   - Export data for analysis

## API Endpoints

### Create Booking
```
POST /api/bookings
Body: {
  "userId": "STU12345",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "1234567890",
  "bookingDate": "2026-03-15",
  "mealType": "lunch",
  "foodItems": [
    { "name": "Rice", "quantity": 1 },
    { "name": "Dal", "quantity": 1 }
  ],
  "specialRequests": "Less spicy"
}
```

### Get All Bookings
```
GET /api/bookings?date=2026-03-15&mealType=lunch&status=confirmed&userId=STU12345
```

### Get Booking Statistics
```
GET /api/bookings/stats
```

### Get Single Booking
```
GET /api/bookings/:id
```

### Cancel Booking
```
PUT /api/bookings/:id/cancel
```

## Database Schema

### Booking Model
```javascript
{
  userId: String,          // Student/Employee ID
  userName: String,        // Full name
  userEmail: String,       // Email (optional)
  userPhone: String,       // Phone (optional)
  bookingDate: Date,       // Date of meal
  mealType: String,        // "breakfast", "lunch", or "dinner"
  foodItems: [{
    name: String,          // Food item name
    quantity: Number       // Quantity
  }],
  status: String,          // "confirmed", "cancelled", "completed"
  specialRequests: String, // Dietary requirements
  bookingTime: Date,       // When booking was made
  createdAt: Date,
  updatedAt: Date
}
```

## Features Implemented

✅ **User Portal**:
- Clean, mobile-friendly interface
- Real-time booking creation
- View personal booking history
- Cancel bookings
- Special requests support

✅ **Admin Dashboard Integration**:
- Booking statistics (total, today's, expected diners)
- Filter bookings by multiple criteria
- View all bookings in table format
- Cancel bookings on behalf of users

✅ **Backend API**:
- RESTful API design
- Duplicate booking prevention
- Flexible filtering
- Aggregated statistics
- Pagination support

✅ **Database**:
- MongoDB integration
- Indexed for performance
- Proper validation
- Status tracking

## Benefits

1. **Better Demand Prediction**: Know exact meal requirements in advance
2. **Reduced Food Waste**: Prepare based on actual bookings
3. **Improved User Experience**: No waiting in long queues
4. **Data-Driven Decisions**: Analyze booking patterns
5. **Cost Savings**: Optimize food procurement

## Future Enhancements (Phase 2)

- QR code generation for booking confirmation
- Email/SMS notifications
- Meal redemption tracking
- Integration with payment systems
- Mobile app
- Analytics dashboard with charts
- Booking limits and cutoff times
- Menu management (set available items per meal)

## Testing the System

1. **Start Backend Server**:
   ```bash
   cd backend
   node server.js
   ```

2. **Start AI Server**:
   ```bash
   cd AI-model
   python app.py
   ```

3. **Access User Portal**: http://localhost:5000/booking.html

4. **Access Admin Dashboard**: http://localhost:5000

5. **Create Test Booking**:
   - Enter User ID: STU12345
   - Enter Name: Test User
   - Select Date: Tomorrow
   - Select Meal: Lunch
   - Select Items: Rice, Dal
   - Submit

6. **Verify in Admin Dashboard**:
   - Go to Bookings section
   - See your test booking
   - Check statistics updated

## Support

For issues or questions:
- Check MongoDB connection
- Verify both servers are running
- Check browser console for errors
- Review API endpoints for correct data format

---

**Smart Canteen Management System**
*AI-Powered with Pre-Booking*
