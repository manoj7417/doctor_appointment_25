import { toast } from 'react-toastify';

/**
 * Enhanced booking handler for guest bookings
 * @param {Object} bookingData - Booking information
 * @param {Function} onSuccess - Callback function on successful booking
 * @param {Function} onError - Callback function on booking error
 */
export const handleBooking = async (bookingData, onSuccess = null, onError = null) => {
    try {
        console.log("handleBooking called with:", bookingData);

        // Validate required booking data
        const requiredFields = ['patientName', 'patientPhone', 'doctorId', 'doctorName', 'appointmentDate', 'slot', 'price'];
        for (const field of requiredFields) {
            if (!bookingData[field]) {
                console.error(`Missing required field: ${field}`);
                throw new Error(`${field} is required for booking`);
            }
        }

        console.log("All required fields present");

        // Prepare booking payload
        const payload = {
            ...bookingData,
            paymentMethod: bookingData.paymentMethod || 'razorpay',
            paymentStatus: bookingData.paymentStatus || 'pending',
            notes: bookingData.notes || ''
        };

        // Make API call to create booking
        const response = await fetch('/api/chatbot/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Booking failed');
        }

        // Show success message
        toast.success('Booking created successfully!');

        // Call success callback if provided
        if (onSuccess) {
            onSuccess(result.booking);
        }

        return result.booking;

    } catch (error) {
        console.error('Booking error:', error);

        // Show error message
        toast.error(error.message || 'Failed to create booking');

        // Call error callback if provided
        if (onError) {
            onError(error);
        }

        throw error;
    }
};

/**
 * Check slot availability for a doctor
 * @param {string} doctorId - Doctor ID
 * @param {Date} appointmentDate - Appointment date
 * @param {string} slot - Time slot
 * @returns {Promise<boolean>} - True if slot is available
 */
export const checkSlotAvailability = async (doctorId, appointmentDate, slot) => {
    try {
        const response = await fetch(`/api/bookings/availability?doctorId=${doctorId}&date=${appointmentDate.toISOString()}&slot=${slot}`);
        const result = await response.json();
        return result.available;
    } catch (error) {
        console.error('Error checking slot availability:', error);
        return false;
    }
};

/**
 * Get all bookings
 * @returns {Promise<Array>} - Array of bookings
 */
export const getAllBookings = async () => {
    try {
        const response = await fetch('/api/bookings');
        const result = await response.json();
        return result.bookings || [];
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
};

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} - Updated booking
 */
export const cancelBooking = async (bookingId, reason = '') => {
    try {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to cancel booking');
        }

        toast.success('Booking cancelled successfully');
        return result.booking;

    } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error(error.message || 'Failed to cancel booking');
        throw error;
    }
};

/**
 * Reschedule a booking
 * @param {string} bookingId - Booking ID
 * @param {Date} newDate - New appointment date
 * @param {string} newSlot - New time slot
 * @returns {Promise<Object>} - Updated booking
 */
export const rescheduleBooking = async (bookingId, newDate, newSlot) => {
    try {
        const response = await fetch(`/api/bookings/${bookingId}/reschedule`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentDate: newDate.toISOString(),
                slot: newSlot
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to reschedule booking');
        }

        toast.success('Booking rescheduled successfully');
        return result.booking;

    } catch (error) {
        console.error('Error rescheduling booking:', error);
        toast.error(error.message || 'Failed to reschedule booking');
        throw error;
    }
}; 