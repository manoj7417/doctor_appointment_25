# BulkSMS Integration Setup Guide

This guide explains how to set up and use BulkSMS services in your medical appointment booking application.

## 📋 Prerequisites

1. **BulkSMS Account**: Sign up at [https://www.bulksmsplans.com/v2/](https://www.bulksmsplans.com/v2/)
2. **API Credentials**: Get your API ID and API Password from your BulkSMS dashboard
3. **Sender ID**: Configure your approved sender ID (e.g., "MEDICAL")

## 🔧 Environment Variables

Add these variables to your `.env.local` file:

```env
# BulkSMS Configuration
BULKSMS_API_ID=your_api_id_here
BULKSMS_API_PASSWORD=your_api_password_here
BULKSMS_SENDER_ID=MEDICAL
```

## 🚀 Features

### 1. OTP Verification

- Send OTP codes for user verification
- Automatic message formatting
- Error handling and retry logic

### 2. Booking Confirmations

- Send appointment confirmation messages
- Include doctor name, date, time, and booking ID
- Professional message formatting

### 3. Appointment Reminders

- Send reminder messages before appointments
- Include appointment details and instructions

### 4. Cancellation Notifications

- Send cancellation messages to patients
- Include rescheduling instructions

### 5. Balance Checking

- Check SMS balance in real-time
- Monitor usage and costs

## 📡 API Endpoints

### Send SMS

- **URL**: `https://www.bulksmsplans.com/api/send_sms`
- **Method**: POST
- **Parameters**:
  - `api_id`: Your API ID
  - `api_password`: Your API Password
  - `sms_type`: Transactional, Promotional, or OTP
  - `sms_encoding`: 1=Text, 2=Unicode, 3=Flash SMS, 4=Unicode Flash SMS
  - `sender`: Your approved sender ID
  - `number`: Recipient phone number (without +)
  - `message`: SMS content

### Check Balance

- **URL**: `https://www.bulksmsplans.com/api/balance`
- **Method**: POST
- **Parameters**:
  - `api_id`: Your API ID
  - `api_password`: Your API Password

### Delivery Report

- **URL**: `https://www.bulksmsplans.com/api/delivery_report`
- **Method**: POST
- **Parameters**:
  - `api_id`: Your API ID
  - `api_password`: Your API Password
  - `message_id`: Message ID from send response

## 💻 Usage

### In Your Components

```javascript
import bulkSmsService from "../lib/bulkSmsService";

// Send OTP
const otpResult = await bulkSmsService.sendOtp("+919876543210", "123456");

// Send booking confirmation
const bookingResult = await bulkSmsService.sendBookingConfirmation(
  "+919876543210",
  {
    doctorName: "Dr. Smith",
    date: "2024-01-15",
    time: "10:00 AM",
    bookingId: "BK123456",
  }
);

// Check balance
const balanceResult = await bulkSmsService.checkBalance();
```

### API Routes

```javascript
// Send OTP
POST /api/chatbot/send-otp
{
  "phoneNumber": "+919876543210"
}

// Send booking confirmation
POST /api/chatbot/send-booking-sms
{
  "phoneNumber": "+919876543210",
  "bookingDetails": {
    "doctorName": "Dr. Smith",
    "date": "2024-01-15",
    "time": "10:00 AM",
    "bookingId": "BK123456"
  }
}

// Check SMS balance
GET /api/chatbot/sms-balance
```

## 🧪 Demo Mode

In development mode without API credentials, the service runs in demo mode:

- Simulates SMS sending without actual API calls
- Returns mock responses for testing
- Logs what would be sent to the console

## 📝 SMS Templates

### OTP Template

```
Your OTP for medical appointment booking is: {OTP}. Valid for 10 minutes. Do not share this OTP with anyone.
```

### Booking Confirmation Template

```
Your appointment with Dr. {doctorName} has been confirmed for {date} at {time}. Booking ID: {bookingId}. Thank you for choosing our medical services.
```

### Appointment Reminder Template

```
Reminder: You have an appointment with Dr. {doctorName} tomorrow at {time}. Please arrive 10 minutes early.
```

### Cancellation Template

```
Your appointment with Dr. {doctorName} scheduled for {date} at {time} has been cancelled. For rescheduling, please contact us.
```

## ⚠️ Error Handling

The service includes comprehensive error handling:

- Invalid API credentials
- Network connectivity issues
- API rate limiting
- Invalid phone numbers
- Message length limits

## 🧪 Testing

### Test Endpoints

1. **Test Correct API**: `/api/chatbot/test-bulksms-correct-api`

   - Tests OTP, balance, and booking confirmation
   - Shows configuration status
   - Validates API credentials

2. **Debug Configuration**: Use the "Debug BulkSMS Config" button in the chatbot
   - Shows environment variables status
   - Displays API endpoint URLs
   - Tests basic connectivity

### Test Buttons in Chatbot

The chatbot includes several test buttons (development only):

- **Debug BulkSMS Config**: Check configuration
- **Test OTP**: Send test OTP
- **Test Booking**: Send test booking confirmation
- **Test Reminder**: Send test appointment reminder
- **Test Cancel**: Send test cancellation
- **SMS Balance**: Check current balance
- **Test Correct API**: Comprehensive API test

## 🔒 Security

- API credentials are stored in environment variables
- Passwords are hidden in logs
- Demo mode prevents accidental SMS sending in development
- Input validation for phone numbers and messages

## 💰 Cost Optimization

- Use appropriate SMS types (Transactional vs Promotional)
- Monitor balance regularly
- Implement delivery reports for failed messages
- Use templates to reduce message length

## 🆘 Support

If you encounter issues:

1. **Check API Credentials**: Verify your API ID and password
2. **Test Connectivity**: Use the test buttons in the chatbot
3. **Check Balance**: Ensure you have sufficient SMS balance
4. **Review Logs**: Check console logs for detailed error messages
5. **Contact BulkSMS Support**: For API-related issues

## 📚 API Documentation

For detailed API documentation, visit:
[https://www.bulksmsplans.com/v2/bulk/API/WebAPIDocuments/](https://www.bulksmsplans.com/v2/bulk/API/WebAPIDocuments/)

## 🔄 Migration from Twilio

This implementation replaces the previous Twilio integration:

- More cost-effective for Indian numbers
- Better delivery rates in India
- Simplified API structure
- No need for Twilio account or credentials
