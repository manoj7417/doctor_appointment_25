/**
 * Email Service using Nodemailer
 * For sending booking confirmations and other emails
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Check if email credentials are configured
      const emailConfig = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      };

      if (emailConfig.auth.user && emailConfig.auth.pass) {
        this.transporter = nodemailer.createTransport(emailConfig);
        this.isConfigured = true;
        this.initialized = true;
      } else {
        this.isConfigured = false;
        this.initialized = true;
      }
    } catch (error) {
      console.error('❌ Error initializing email service:', error);
      this.isConfigured = false;
      this.initialized = true;
    }
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(bookingDetails, recipientEmail) {
    // Initialize the service if not already done
    if (!this.initialized) {
      await this.init();
    }

    if (!this.isConfigured) {
      return {
        success: true,
        message: 'Email sent successfully (DEMO MODE)',
        demoMode: true
      };
    }

    try {
      const appointmentDate = new Date(bookingDetails.appointmentDate);
      const formattedDate = appointmentDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const emailContent = this.generateBookingEmailTemplate(bookingDetails, formattedDate);

      const mailOptions = {
        from: `"Medical Appointment Portal" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Appointment Confirmed - Dr. ${bookingDetails.doctorName}`,
        html: emailContent
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Booking confirmation email sent successfully',
        messageId: result.messageId
      };

    } catch (error) {
      console.error('❌ Error sending booking confirmation email:', error);
      return {
        success: false,
        message: 'Failed to send confirmation email',
        error: error.message
      };
    }
  }

  /**
   * Generate HTML email template for booking confirmation
   */
  generateBookingEmailTemplate(bookingDetails, formattedDate) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .booking-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: bold;
            color: #555;
          }
          .detail-value {
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .important {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Appointment Confirmed!</h1>
          <p>Your medical appointment has been successfully booked</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${bookingDetails.patientName}</strong>,</p>
          
          <p>Your appointment with <strong>Dr. ${bookingDetails.doctorName}</strong> has been confirmed. Here are the details:</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">${bookingDetails.bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Doctor:</span>
              <span class="detail-value">Dr. ${bookingDetails.doctorName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Specialization:</span>
              <span class="detail-value">${bookingDetails.doctorSpecialization || 'General Physician'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${bookingDetails.slot}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Consultation Fee:</span>
              <span class="detail-value">₹${bookingDetails.consultationFee}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Hospital/Clinic:</span>
              <span class="detail-value">${bookingDetails.hospital || 'Not specified'}</span>
            </div>
          </div>
          
          <div class="important">
            <h3>📋 Important Instructions:</h3>
            <ul>
              <li>Please arrive 10 minutes before your appointment time</li>
              <li>Bring any relevant medical reports or prescriptions</li>
              <li>Wear a mask and follow COVID-19 protocols</li>
              <li>Keep this confirmation email for reference</li>
            </ul>
          </div>
          
          <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
          
          <p>Thank you for choosing our medical services!</p>
          
          <p>Best regards,<br>
          <strong>Medical Appointment Portal Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>For support, contact us at support@medicalportal.com</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send appointment reminder email
   */
  async sendAppointmentReminder(bookingDetails, recipientEmail) {
    if (!this.isConfigured) {
      return {
        success: true,
        message: 'Reminder email sent successfully (DEMO MODE)',
        demoMode: true
      };
    }

    try {
      const appointmentDate = new Date(bookingDetails.appointmentDate);
      const formattedDate = appointmentDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const mailOptions = {
        from: `"Medical Appointment Portal" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Reminder: Your appointment with Dr. ${bookingDetails.doctorName} tomorrow`,
        html: `
          <h2>Appointment Reminder</h2>
          <p>Dear ${bookingDetails.patientName},</p>
          <p>This is a friendly reminder that you have an appointment with <strong>Dr. ${bookingDetails.doctorName}</strong> tomorrow.</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${bookingDetails.slot}</p>
          <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
          <p>Please arrive 10 minutes before your scheduled time.</p>
          <p>Best regards,<br>Medical Appointment Portal Team</p>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Appointment reminder email sent successfully',
        messageId: result.messageId
      };

    } catch (error) {
      console.error('❌ Error sending reminder email:', error);
      return {
        success: false,
        message: 'Failed to send reminder email',
        error: error.message
      };
    }
  }

  /**
   * Send cancellation notification email
   */
  async sendCancellationEmail(bookingDetails, recipientEmail) {
    if (!this.isConfigured) {
      return {
        success: true,
        message: 'Cancellation email sent successfully (DEMO MODE)',
        demoMode: true
      };
    }

    try {
      const appointmentDate = new Date(bookingDetails.appointmentDate);
      const formattedDate = appointmentDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const mailOptions = {
        from: `"Medical Appointment Portal" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Appointment Cancelled - Dr. ${bookingDetails.doctorName}`,
        html: `
          <h2>Appointment Cancellation</h2>
          <p>Dear ${bookingDetails.patientName},</p>
          <p>Your appointment with <strong>Dr. ${bookingDetails.doctorName}</strong> has been cancelled.</p>
          <p><strong>Cancelled Appointment Details:</strong></p>
          <p>Date: ${formattedDate}</p>
          <p>Time: ${bookingDetails.slot}</p>
          <p>Booking ID: ${bookingDetails.bookingId}</p>
          <p>If you need to reschedule, please book a new appointment through our portal.</p>
          <p>Best regards,<br>Medical Appointment Portal Team</p>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Cancellation email sent successfully',
        messageId: result.messageId
      };

    } catch (error) {
      console.error('❌ Error sending cancellation email:', error);
      return {
        success: false,
        message: 'Failed to send cancellation email',
        error: error.message
      };
    }
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;
