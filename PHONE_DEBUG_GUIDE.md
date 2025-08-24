# Phone Number OTP Debug Guide

## 🔍 **Issue Description**

- OTP works for number: 821**\*** ✅
- OTP fails for number: 7417\*\*\*\* ❌

## 🧪 **Debug Steps**

### **Step 1: Test Specific Phone Numbers**

Use the new test endpoint to debug both numbers:

```bash
# Test the working number
curl -X POST http://localhost:3000/api/chatbot/test-phone-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "821*****"}'

# Test the failing number
curl -X POST http://localhost:3000/api/chatbot/test-phone-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "7417****"}'
```

### **Step 2: Check Console Logs**

Look for these logs in your terminal:

```
📱 Phone Number Processing:
  Original: 7417****
  Formatted: 7417****
  Length: 10
```

### **Step 3: Check BulkSMS Response**

Look for the BulkSMS API response:

```
📥 BulkSMS Response: {"code": 200, "message": "success"}
```

## 🔧 **Possible Issues & Solutions**

### **1. Phone Number Format**

- **Issue**: Different phone number formats
- **Solution**: Improved phone number formatting in `bulkSmsService.js`

### **2. DLT Template Issues**

- **Issue**: Some numbers might not be registered for DLT
- **Solution**: Check if the number is registered with your DLT template

### **3. BulkSMS Account Issues**

- **Issue**: Account restrictions or balance issues
- **Solution**: Check BulkSMS dashboard for account status

### **4. Network/Carrier Issues**

- **Issue**: Some carriers might block SMS
- **Solution**: Test with different carriers

## 📋 **Test Commands**

### **Test Environment Variables**

```bash
curl http://localhost:3000/api/chatbot/debug-env
```

### **Test BulkSMS Configuration**

```bash
curl http://localhost:3000/api/chatbot/test-bulksms-correct-api
```

### **Test Specific Phone Number**

```bash
curl -X POST http://localhost:3000/api/chatbot/test-phone-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "YOUR_PHONE_NUMBER"}'
```

## 🔍 **What to Check**

### **1. Phone Number Format**

- Is the number exactly 10 digits?
- Does it start with a valid Indian mobile prefix?
- Are there any special characters?

### **2. BulkSMS Configuration**

- Are API credentials correct?
- Is there sufficient balance?
- Is the sender ID approved?

### **3. DLT Template**

- Is your template approved for all numbers?
- Are both numbers registered for DLT?

### **4. API Response**

- Check the exact error message from BulkSMS
- Look for specific error codes

## 📞 **Next Steps**

1. **Run the test endpoint** for both numbers
2. **Check console logs** for detailed information
3. **Compare the responses** between working and failing numbers
4. **Check BulkSMS dashboard** for any account issues
5. **Contact BulkSMS support** if needed

## 🎯 **Quick Test**

Try this in your browser console:

```javascript
// Test the failing number
fetch("/api/chatbot/test-phone-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone: "7417****" }),
})
  .then((r) => r.json())
  .then(console.log);
```

This will help identify the exact issue with the failing phone number.
