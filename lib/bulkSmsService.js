/**
 * BulkSMS Service for sending SMS messages
 * Based on official BulkSMS API documentation
 */

class BulkSmsService {
  constructor() {
    this.apiId = process.env.BULKSMS_API_ID;
    this.apiPassword = process.env.BULKSMS_API_PASSWORD;
    this.senderId = process.env.BULKSMS_SENDER_ID || 'MEDICAL';
    this.baseUrl = 'https://www.bulksmsplans.com';
    this.isDemoMode = process.env.NODE_ENV === 'development' && !this.apiId;
  }

  /**
   * Format phone number to remove + and spaces
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters first
    let cleaned = phoneNumber.replace(/[^\d]/g, '');

    // Handle Indian phone numbers
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      // Remove country code if present (91)
      cleaned = cleaned.substring(2);
    } else if (cleaned.length === 13 && cleaned.startsWith('91')) {
      // Remove country code if present (91)
      cleaned = cleaned.substring(2);
    }

    // Ensure it's a 10-digit number
    if (cleaned.length === 10) {
      return cleaned;
    } else if (cleaned.length > 10) {
      // Take last 10 digits
      return cleaned.substring(cleaned.length - 10);
    } else {
      // Return as is if less than 10 digits
      return cleaned;
    }
  }

  /**
   * Send SMS using the correct BulkSMS API structure
   */
  async sendSms(phoneNumber, message, smsType = 'Transactional', smsEncoding = '1') {
    if (this.isDemoMode) {
      console.log('🔧 DEMO MODE: SMS would be sent to', phoneNumber, 'with message:', message);
      return {
        success: true,
        message: 'Message sent successfully (DEMO MODE)',
        data: {
          message_id: Math.floor(Math.random() * 1000000),
          number: phoneNumber
        }
      };
    }

    if (!this.apiId || !this.apiPassword) {
      throw new Error('BulkSMS API credentials not configured. Please set BULKSMS_API_ID and BULKSMS_API_PASSWORD environment variables.');
    }

    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    console.log('📱 Phone Number Processing:');
    console.log('  Original:', phoneNumber);
    console.log('  Formatted:', formattedNumber);
    console.log('  Length:', formattedNumber.length);

    // Prepare the payload according to official API documentation
    const payload = {
      api_id: this.apiId,
      api_password: this.apiPassword,
      sms_type: smsType,
      sms_encoding: smsEncoding,
      sender: this.senderId,
      number: formattedNumber,
      message: message
    };

    console.log('📤 Sending SMS via BulkSMS:', {
      endpoint: `${this.baseUrl}/api/send_sms`,
      payload: { ...payload, api_password: '***' } // Hide password in logs
    });

    try {
      const response = await fetch(`${this.baseUrl}/api/send_sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log('📥 BulkSMS Response:', responseText);

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (error) {
        console.error('❌ Failed to parse BulkSMS response as JSON:', responseText);
        throw new Error(`Invalid response from BulkSMS API: ${responseText}`);
      }

      // Check if the response indicates success
      if (parsedData.code === 200) {
        console.log('✅ SMS sent successfully:', parsedData);
        return {
          success: true,
          message: parsedData.message || 'Message sent successfully',
          data: parsedData.data || {
            message_id: parsedData.data?.message_id,
            number: formattedNumber
          }
        };
      } else {
        console.error('❌ SMS sending failed:', parsedData);
        return {
          success: false,
          message: parsedData.message || 'Failed to send SMS',
          error: parsedData,
          code: parsedData.code
        };
      }

    } catch (error) {
      console.error('❌ Error sending SMS via BulkSMS:', error);
      throw new Error(`BulkSMS API error: ${error.message}`);
    }
  }

  /**
   * Send OTP SMS
   */
  // async sendOtp(phoneNumber, otp) {
  //   const message = `Your OTP for medical appointment booking is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
  //   return this.sendSms(phoneNumber, message, 'OTP', '1');
  // }



  async sendOtp(phoneNumber, otp) {
    // Message MUST match the DLT-approved template exactly
    const message = `Dear User, Your OTP for login to MAPL portal is ${otp}. Valid for 30 minutes. Please do not share this OTP. Regards, MAPL Team`;

    return this.sendSms(phoneNumber, message, 'Transactional', '1');
  }

  /**
   * Send booking confirmation SMS
   */
  // async sendBookingConfirmation(phoneNumber, bookingDetails) {
  //   const message = `Your appointment with Dr. ${bookingDetails.doctorName} has been confirmed for ${bookingDetails.date} at ${bookingDetails.time}. Booking ID: ${bookingDetails.bookingId}. Thank you for choosing our medical services.`;
  //   return this.sendSms(phoneNumber, message, 'Transactional', '1');
  // }


  async sendBookingConfirmation(phoneNumber, bookingDetails) {
    // Format the appointment date properly
    const appointmentDate = new Date(bookingDetails.appointmentDate);
    const formattedDate = appointmentDate.toLocaleDateString('en-IN');

    // DLT-compliant template with placeholders
    const message = `Dear ${bookingDetails.patientName}, your appointment with Dr. ${bookingDetails.doctorName} on ${formattedDate} at ${bookingDetails.slot} (Booking ID: ${bookingDetails.bookingId}) is confirmed. Please arrive 10 minutes before your appointment. Thank you, MAPL Team.`;

    return this.sendSms(phoneNumber, message, 'Transactional', '1');
  }

  /**
   * Send appointment reminder SMS
   */
  async sendAppointmentReminder(phoneNumber, appointmentDetails) {
    const message = `Reminder: You have an appointment with Dr. ${appointmentDetails.doctorName} tomorrow at ${appointmentDetails.time}. Please arrive 10 minutes early.`;
    return this.sendSms(phoneNumber, message, 'Transactional', '1');
  }

  /**
   * Send cancellation notification SMS
   */
  async sendCancellationNotification(phoneNumber, cancellationDetails) {
    const message = `Your appointment with Dr. ${cancellationDetails.doctorName} scheduled for ${cancellationDetails.date} at ${cancellationDetails.time} has been cancelled. For rescheduling, please contact us.`;
    return this.sendSms(phoneNumber, message, 'Transactional', '1');
  }

  /**
   * Check SMS balance
   */
  async checkBalance() {
    if (this.isDemoMode) {
      return {
        success: true,
        balance: 1000,
        message: 'Demo balance: 1000 SMS'
      };
    }

    if (!this.apiId || !this.apiPassword) {
      throw new Error('BulkSMS API credentials not configured');
    }

    try {
      // Try different balance endpoints based on common SMS API patterns
      const balanceEndpoints = [
        `${this.baseUrl}/api/balance`,
        `${this.baseUrl}/api/check_balance`,
        `${this.baseUrl}/api/get_balance`,
        `${this.baseUrl}/api/account_balance`,
        `${this.baseUrl}/balance`,
        `${this.baseUrl}/check_balance`,
        `${this.baseUrl}/get_balance`
      ];

      let lastError = null;

      for (const endpoint of balanceEndpoints) {
        try {
          console.log(`🔍 Trying balance endpoint: ${endpoint}`);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              api_id: this.apiId,
              api_password: this.apiPassword
            })
          });

          const responseText = await response.text();
          console.log(`📥 Balance response from ${endpoint}:`, responseText);

          let parsedData;
          try {
            parsedData = JSON.parse(responseText);
          } catch (error) {
            console.log(`❌ Non-JSON response from ${endpoint}:`, responseText);
            lastError = new Error(`Invalid response from ${endpoint}: ${responseText}`);
            continue; // Try next endpoint
          }

          // Check if this is a successful response
          if (parsedData.code === 200 || parsedData.success || parsedData.balance !== undefined) {
            console.log(`✅ Found working balance endpoint: ${endpoint}`);
            return {
              success: true,
              balance: parsedData.data?.balance || parsedData.balance || 0,
              message: parsedData.message || 'Balance retrieved successfully',
              endpoint: endpoint
            };
          } else {
            console.log(`❌ Balance endpoint ${endpoint} returned error:`, parsedData);
            lastError = new Error(parsedData.message || `Balance check failed at ${endpoint}`);
          }

        } catch (error) {
          console.log(`❌ Error with balance endpoint ${endpoint}:`, error.message);
          lastError = error;
          continue; // Try next endpoint
        }
      }

      // If we get here, no balance endpoint worked
      console.error('❌ All balance endpoints failed');
      throw lastError || new Error('No working balance endpoint found');

    } catch (error) {
      console.error('❌ Error checking BulkSMS balance:', error);
      throw new Error(`BulkSMS balance check error: ${error.message}`);
    }
  }

  /**
   * Get delivery status
   */
  async getDeliveryStatus(messageId) {
    if (this.isDemoMode) {
      return {
        success: true,
        status: 'delivered',
        message: 'Demo delivery status'
      };
    }

    if (!this.apiId || !this.apiPassword) {
      throw new Error('BulkSMS API credentials not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/delivery_report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          api_id: this.apiId,
          api_password: this.apiPassword,
          message_id: messageId
        })
      });

      const responseText = await response.text();
      let parsedData;

      try {
        parsedData = JSON.parse(responseText);
      } catch (error) {
        throw new Error(`Invalid response from BulkSMS API: ${responseText}`);
      }

      if (parsedData.code === 200) {
        return {
          success: true,
          status: parsedData.data?.status || parsedData.status,
          message: parsedData.message || 'Delivery status retrieved successfully'
        };
      } else {
        return {
          success: false,
          message: parsedData.message || 'Failed to get delivery status',
          error: parsedData
        };
      }

    } catch (error) {
      console.error('❌ Error getting delivery status:', error);
      throw new Error(`BulkSMS delivery status error: ${error.message}`);
    }
  }
}

// Create and export a singleton instance
const bulkSmsService = new BulkSmsService();
export default bulkSmsService;
