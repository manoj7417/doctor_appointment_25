"use client";

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { handleBooking, checkSlotAvailability } from '@/lib/bookingUtils';
import { toast } from 'react-toastify';

export default function BookingExample() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Example doctor data
  const exampleDoctor = {
    _id: 'doctor123',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    price: 150,
    virtualConsultation: true,
    inPersonConsultation: true
  };

  const handleBookingExample = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select date and time slot');
      return;
    }

    setIsLoading(true);

    try {
      // Check slot availability first
      const isAvailable = await checkSlotAvailability(
        exampleDoctor._id,
        new Date(selectedDate),
        selectedSlot
      );

      if (!isAvailable) {
        toast.error('Selected slot is not available');
        return;
      }

      // Prepare booking data
      const bookingData = {
        patientName: user?.name || 'Guest User',
        patientPhone: user?.phone || '1234567890',
        doctorId: exampleDoctor._id,
        doctorName: exampleDoctor.name,
        specialization: exampleDoctor.specialization,
        appointmentDate: new Date(selectedDate),
        slot: selectedSlot,
        price: exampleDoctor.price,
        paymentMethod: 'razorpay',
        paymentStatus: 'pending',
        notes: 'Booking from example component'
      };

      // Use the handleBooking function
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

      console.log('Booking result:', booking);

    } catch (error) {
      console.error('Error in booking example:', error);
      toast.error('An error occurred during booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Booking Example</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Slot
          </label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a time slot</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:30 AM">10:30 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="04:30 PM">04:30 PM</option>
          </select>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <h3 className="font-medium text-gray-800 mb-2">Doctor Details</h3>
          <p className="text-sm text-gray-600">
            <strong>Name:</strong> {exampleDoctor.name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Specialization:</strong> {exampleDoctor.specialization}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Price:</strong> ${exampleDoctor.price}
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">User Status</h3>
          <p className="text-sm text-blue-600">
            {user ? (
              <>
                <strong>Logged in as:</strong> {user.name} ({user.email})
                <br />
                <span className="text-green-600">✓ Authenticated booking</span>
              </>
            ) : (
              <>
                <strong>Guest user</strong>
                <br />
                <span className="text-orange-600">⚠ Guest booking (phone verification required)</span>
              </>
            )}
          </p>
        </div>

        <button
          onClick={handleBookingExample}
          disabled={isLoading || !selectedDate || !selectedSlot}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Book Appointment'}
        </button>

        <div className="text-xs text-gray-500 mt-4">
          <p><strong>Features demonstrated:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Slot availability checking</li>
            <li>Authenticated vs guest bookings</li>
            <li>Error handling and success callbacks</li>
            <li>Toast notifications</li>
            <li>Loading states</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 