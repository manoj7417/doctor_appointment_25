# Booking System Guide

## Overview

The enhanced booking system supports both authenticated and guest bookings with comprehensive error handling and slot availability checking.

## Key Features

- ✅ **Authenticated Bookings**: Users logged in can book appointments with their account linked
- ✅ **Guest Bookings**: Non-authenticated users can book with phone verification
- ✅ **Slot Availability**: Real-time checking of available time slots
- ✅ **Payment Integration**: Razorpay payment processing
- ✅ **SMS Notifications**: Automatic confirmation messages
- ✅ **Booking Management**: Cancel and reschedule functionality
- ✅ **Error Handling**: Comprehensive error handling with user feedback

## API Endpoints

### 1. Create Booking
```
POST /api/bookings
```

**Request Body:**
```json
{
  "patientName": "John Doe",
  "patientPhone": "1234567890",
  "patientEmail": "john@example.com",
  "doctorId": "doctor123",
  "doctorName": "Dr. Sarah Johnson",
  "specialization": "Cardiology",
  "appointmentDate": "2024-01-15T10:00:00.000Z",
  "slot": "10:00 AM",
  "price": 150,
  "paymentMethod": "razorpay",
  "paymentStatus": "pending",
  "notes": "Optional notes"
}
```

### 2. Check Slot Availability
```
GET /api/bookings/availability?doctorId=doctor123&date=2024-01-15&slot=10:00 AM
```

### 3. Get User Bookings
```
GET /api/bookings
```

### 4. Cancel Booking
```
PUT /api/bookings/{bookingId}/cancel
```

### 5. Reschedule Booking
```
PUT /api/bookings/{bookingId}/reschedule
```

## Usage Examples

### Basic Booking with handleBooking Function

```javascript
import { handleBooking, checkSlotAvailability } from '@/lib/bookingUtils';
import { useUserStore } from '@/store/userStore';

const { user } = useUserStore();

const bookingData = {
  patientName: user?.name || 'Guest User',
  patientPhone: user?.phone || '1234567890',
  doctorId: 'doctor123',
  doctorName: 'Dr. Sarah Johnson',
  specialization: 'Cardiology',
  appointmentDate: new Date('2024-01-15'),
  slot: '10:00 AM',
  price: 150,
  paymentMethod: 'razorpay',
  paymentStatus: 'pending',
  notes: 'Optional booking notes'
};

// Check availability first
const isAvailable = await checkSlotAvailability(
  bookingData.doctorId,
  bookingData.appointmentDate,
  bookingData.slot
);

if (!isAvailable) {
  toast.error('Selected slot is not available');
  return;
}

// Create booking
const booking = await handleBooking(
  bookingData,
  user, // Pass user if authenticated
  (booking) => {
    // Success callback
    console.log('Booking successful:', booking);
    toast.success(`Booking confirmed! Token: ${booking.token}`);
  },
  (error) => {
    // Error callback
    console.error('Booking failed:', error);
    toast.error('Booking failed. Please try again.');
  }
);
```

### Guest Booking (Phone Verification)

```javascript
// For guest bookings, phone verification is required
const guestBookingData = {
  patientName: 'Guest User',
  patientPhone: '1234567890', // This will be verified via OTP
  doctorId: 'doctor123',
  doctorName: 'Dr. Sarah Johnson',
  specialization: 'Cardiology',
  appointmentDate: new Date(),
  slot: '10:00 AM',
  price: 150
};

const booking = await handleBooking(
  guestBookingData,
  null, // No user for guest booking
  (booking) => {
    console.log('Guest booking successful:', booking);
  },
  (error) => {
    console.error('Guest booking failed:', error);
  }
);
```

### Booking Management

```javascript
import { cancelBooking, rescheduleBooking } from '@/lib/bookingUtils';

// Cancel a booking
const cancelledBooking = await cancelBooking('booking123', 'Changed my mind');

// Reschedule a booking
const rescheduledBooking = await rescheduleBooking(
  'booking123',
  new Date('2024-01-20'),
  '02:00 PM'
);
```

## Database Schema

### Booking Model

```javascript
{
  userId: ObjectId, // Optional - for authenticated bookings
  patientName: String,
  patientPhone: String,
  patientEmail: String, // Optional
  doctorId: ObjectId,
  doctorName: String,
  specialization: String,
  appointmentDate: Date,
  slot: String,
  status: String, // 'confirmed', 'cancelled', 'completed', 'pending'
  paymentMethod: String, // 'card', 'paypal', 'upi', 'razorpay'
  paymentStatus: String, // 'pending', 'completed', 'failed', 'refunded'
  price: Number,
  paymentDetails: Object,
  token: String, // Unique booking token
  bookingType: String, // 'authenticated' or 'guest'
  notes: String,
  cancellationReason: String,
  cancelledAt: Date,
  checked: Boolean,
  timestamps: true
}
```

## Authentication Flow

### Authenticated Users
1. User logs in with email/password
2. JWT token stored in HTTP-only cookie
3. Booking automatically linked to user account
4. Full booking history accessible

### Guest Users
1. Phone number verification via OTP
2. Booking stored without user account
3. Limited access to booking history
4. Can convert to authenticated booking later

## Error Handling

The system handles various error scenarios:

- **Slot Unavailable**: Returns error if selected slot is already booked
- **Invalid Data**: Validates all required fields
- **Authentication Errors**: Handles expired or invalid tokens
- **Payment Failures**: Graceful handling of payment processing errors
- **Network Errors**: Retry mechanisms and fallback options

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Input Validation**: Comprehensive data validation
- **Authorization Checks**: Users can only manage their own bookings
- **Rate Limiting**: Prevents abuse of booking system

## Integration with Payment System

The booking system integrates with Razorpay for payments:

1. **Order Creation**: Creates Razorpay order before booking
2. **Payment Processing**: Handles payment through Razorpay gateway
3. **Payment Verification**: Verifies payment signature
4. **Booking Confirmation**: Creates booking only after successful payment

## SMS Notifications

Automatic SMS notifications are sent for:

- **Booking Confirmation**: Includes doctor details, date, time, and token
- **Cancellation Notifications**: When bookings are cancelled
- **Reschedule Notifications**: When appointments are rescheduled

## Best Practices

1. **Always check availability** before attempting to book
2. **Handle errors gracefully** with user-friendly messages
3. **Use loading states** to improve user experience
4. **Validate input data** on both client and server
5. **Log booking activities** for audit purposes
6. **Implement retry mechanisms** for network failures
7. **Use proper error boundaries** in React components

## Testing

Test the booking system with:

```javascript
// Test authenticated booking
const authenticatedBooking = await handleBooking(bookingData, user);

// Test guest booking
const guestBooking = await handleBooking(bookingData, null);

// Test slot availability
const isAvailable = await checkSlotAvailability(doctorId, date, slot);

// Test booking cancellation
const cancelledBooking = await cancelBooking(bookingId, 'Test cancellation');
```

## Troubleshooting

### Common Issues

1. **"Slot not available"**: Check if slot is already booked
2. **"Authentication required"**: User needs to log in or verify phone
3. **"Payment failed"**: Check Razorpay configuration
4. **"SMS sending failed"**: Check Twilio credentials

### Debug Mode

Enable debug logging by setting environment variable:
```
DEBUG_BOOKING=true
```

This will log detailed information about booking operations. 