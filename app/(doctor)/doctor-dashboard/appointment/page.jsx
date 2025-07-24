"use client";
import useBookingStore from "@/store/bookingStore";
import { useDoctorStore } from "@/store/doctorStore";
import React, { useEffect, useState } from "react";

export default function AppointmentPage() {
  const { bookingDetails, setBookingDetails } = useBookingStore();
  const { _id: doctorId, name: doctorName } = useDoctorStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if doctor is logged in
        if (!doctorId) {
          setError("Please log in as a doctor to view appointments");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/chatbot/booking");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data?.success) {
          throw new Error(data?.message || "Failed to fetch bookings");
        }

        // Filter bookings by current doctor
        const doctorBookings = Array.isArray(data.bookings)
          ? data.bookings.filter((booking) => booking.doctorId === doctorId)
          : [];

        const bookingsWithCheckStatus = doctorBookings.map((booking) => ({
          ...booking,
          checked: !!booking.checked,
        }));

        setBookingDetails(bookingsWithCheckStatus);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [setBookingDetails, doctorId]);

  const toggleChecked = async (bookingId) => {
    try {
      const currentBooking = bookingDetails.find((b) => b._id === bookingId);
      if (!currentBooking) {
        throw new Error("Booking not found");
      }

      const newCheckedStatus = !currentBooking.checked;

      // ✅ Safe copy + update
      const updatedBookings = bookingDetails.map((booking) =>
        booking._id === bookingId
          ? { ...booking, checked: newCheckedStatus }
          : booking
      );

      setBookingDetails(updatedBookings);

      // Use the doctor appointments API instead of chatbot booking API
      const res = await fetch(`/api/doctor/appointments/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
          status: newCheckedStatus ? 'checked' : 'confirmed',
          notes: newCheckedStatus ? 'Patient checked by doctor' : 'Reverted to confirmed status'
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message || "Update failed");

      // 🔁 Revert update
      const revertedBookings = bookingDetails.map((booking) =>
        booking._id === bookingId
          ? { ...booking, checked: !booking.checked }
          : booking
      );

      setBookingDetails(revertedBookings);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Appointments</h2>
          <p className="text-sm text-gray-600">
            {doctorName ? `Showing appointments for Dr. ${doctorName}` : "Loading doctor information..."}
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Appointments</h2>
          <p className="text-sm text-gray-600">
            {doctorName ? `Showing appointments for Dr. ${doctorName}` : "Please log in as a doctor"}
          </p>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Appointments</h2>
        <p className="text-sm text-gray-600">
          {doctorName ? `Showing appointments for Dr. ${doctorName}` : "Please log in as a doctor"}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Check patients to mark them as seen. Checked patients will appear in your Patients page.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                Patient Name
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                Appointment Date
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Slot</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Token</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                Payment Status
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                Appointment Status
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Checked</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookingDetails.length > 0 ? (
              bookingDetails.map((appt) => (
                <tr
                  key={appt._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6">{appt.patientName}</td>
                  <td className="py-3 px-6">
                    {new Date(appt.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">{appt.slot}</td>
                  <td className="py-3 px-6 font-mono text-sm text-gray-700">
                    {appt.token || "—"}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        appt.paymentStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appt.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        appt.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : appt.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {appt.status || "pending"}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        appt.checked
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {appt.checked ? "Checked" : "Not Checked"}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => toggleChecked(appt._id)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        appt.checked
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      } transition-colors`}
                    >
                      {appt.checked ? "Undo Check" : "Check Patient"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  {doctorName ? "No appointments found for this doctor" : "Please log in as a doctor to view appointments"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
