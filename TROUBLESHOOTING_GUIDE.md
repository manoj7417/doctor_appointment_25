# Troubleshooting Guide: Razorpay & OTP Issues

## 🔧 Issues Identified

### 1. Razorpay SERVER_ERROR
The "SERVER_ERROR" from Razorpay indicates incorrect or missing test credentials.

### 2. OTP Not Being Received
BulkSMS API credentials are not configured, so OTPs cannot be sent.

## 🚀 Quick Fix Steps

### Step 1: Test Your Current Configuration

I've created debug endpoints to help identify the exact issues. Test them in this order:

#### 1. Check Environment Variables
Visit: `http://localhost:3000/api/chatbot/debug-env`

This will show you:
- Which environment variables are missing
- Whether Razorpay and BulkSMS credentials are configured
- Current environment status

#### 2. Test Razorpay Configuration
Visit: `http://localhost:3000/api/chatbot/test-razorpay-config`

This will:
- Verify your Razorpay credentials
- Test creating a minimal order
- Show detailed error messages if there are issues

#### 3. Test BulkSMS Configuration
Visit: `http://localhost:3000/api/chatbot/test-bulksms-correct-api`

This will:
- Check BulkSMS credentials
- Test balance checking
- Test OTP sending (in demo mode if no credentials)
- Test booking confirmation SMS

### Step 2: Fix Razorpay Issues

If the Razorpay test fails, check:

1. **Test Credentials**: Ensure you're using test credentials from Razorpay dashboard
2. **Key Format**: Your Key ID should start with `rzp_test_`
3. **Environment Variables**: Verify these are set in your `.env.local`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_id_here
   RAZORPAY_SECRET=your_test_secret_key_here
   ```

### Step 3: Fix OTP Issues

If OTPs are not being received:

1. **Check BulkSMS Credentials**: Ensure these are set in your `.env.local`:
   ```env
   BULKSMS_API_ID=your_api_id_here
   BULKSMS_API_PASSWORD=your_api_password_here
   BULKSMS_SENDER_ID=MEDICAL
   ```

2. **Demo Mode**: If no BulkSMS credentials, the system will run in demo mode (no real SMS sent)

3. **Test OTP Sending**: Use the chatbot's "Test OTP" button to verify

### Step 4: Restart Your Development Server

```bash
npm run dev
```

## 🧪 Testing Your Configuration

### Test Razorpay Configuration
Visit: `http://localhost:3000/api/chatbot/test-razorpay-config`

### Test BulkSMS Configuration
Visit: `http://localhost:3000/api/chatbot/test-bulksms-correct-api`

### Test OTP Sending
Use the chatbot's "Test OTP" button or visit: `http://localhost:3000/api/chatbot/send-otp`

## 🔍 Debug Endpoints

I've added several debug endpoints to help you troubleshoot:

1. **Environment Variables Check**: `/api/chatbot/debug-env`
2. **Razorpay Config Test**: `/api/chatbot/test-razorpay-config`
3. **BulkSMS Config Test**: `/api/chatbot/test-bulksms-correct-api`

## ⚠️ Common Issues & Solutions

### Razorpay SERVER_ERROR
- **Cause**: Incorrect or missing API credentials
- **Solution**: Verify your Key ID and Secret are correct
- **Test**: Use test credentials from Razorpay dashboard
- **Debug**: Check the detailed error response from `/api/chatbot/test-razorpay-config`

### OTP Not Received
- **Cause**: BulkSMS credentials not configured
- **Solution**: Add BULKSMS_API_ID and BULKSMS_API_PASSWORD
- **Alternative**: Use demo mode for testing (no real SMS sent)
- **Debug**: Check `/api/chatbot/test-bulksms-correct-api` for detailed results

### Environment Variables Not Loading
- **Cause**: .env.local file not in correct location
- **Solution**: Ensure .env.local is in project root (same level as package.json)
- **Restart**: Always restart dev server after adding .env.local
- **Debug**: Use `/api/chatbot/debug-env` to verify

## 📞 Support

If you continue having issues:

1. **Check the debug endpoints** for detailed error messages
2. **Verify your credentials** are correct
3. **Test with demo mode** first to isolate issues
4. **Check browser console** for client-side errors
5. **Check server logs** for backend errors

## 🎯 Quick Test Commands

```bash
# Test environment variables
curl http://localhost:3000/api/chatbot/debug-env

# Test Razorpay config
curl http://localhost:3000/api/chatbot/test-razorpay-config

# Test BulkSMS config
curl http://localhost:3000/api/chatbot/test-bulksms-correct-api
```

## 🔧 Specific Debugging Steps

### For Razorpay SERVER_ERROR:
1. Visit `/api/chatbot/test-razorpay-config`
2. Check the error details in the response
3. Verify your test credentials are correct
4. Ensure you're using test mode credentials (not live)

### For OTP Issues:
1. Visit `/api/chatbot/test-bulksms-correct-api`
2. Check if BulkSMS credentials are configured
3. If in demo mode, OTPs won't be sent but the system will work
4. For real SMS, configure BulkSMS credentials

### For Environment Issues:
1. Visit `/api/chatbot/debug-env`
2. Check which variables are missing
3. Verify your `.env.local` file is in the correct location
4. Restart your development server
