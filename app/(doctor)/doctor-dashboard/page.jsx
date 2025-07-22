"use client";
import { useState, useEffect } from "react";
import AppointmentTable from "@/components/shared/AppointmentTable";
import DashboardCard from "@/components/shared/DoctorDashboardCard";
import { useClientDoctorStore } from "@/lib/hooks/useClientStore";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    todaysAppointments: [],
    upcomingAppointments: [],
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalAppointments: 0,
    patientsToday: 0,
    cancelledAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const { doctorData, clearDoctorData, setDoctorData, isClient } = useClientDoctorStore();

  // Define fetchDashboardData first
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctor/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log current doctor data
  useEffect(() => {
    if (isClient && doctorData) {
      console.log("Current doctor data in dashboard:", doctorData);
    }
  }, [doctorData, isClient]);

  // Fetch and update doctor data when dashboard loads
  useEffect(() => {
    if (!isClient || !doctorData) return;

    const fetchDoctorData = async () => {
      setDoctorLoading(true);
      try {
        const response = await fetch('/api/doctor/current', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.doctor) {
            setDoctorData(result.doctor);
            console.log("Updated doctor data from API:", result.doctor);
          }
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setDoctorLoading(false);
      }
    };

    // Only fetch if we don't have complete doctor data
    if (!doctorData.name || !doctorData.email) {
      fetchDoctorData();
    } else {
      setDoctorLoading(false);
    }
  }, [setDoctorData, doctorData?.name || '', doctorData?.email || '', isClient]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Show loading if doctor data is not ready
  if (doctorLoading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor data...</p>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleViewAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`/api/doctor/appointments/${appointmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        // You can implement a modal or navigate to appointment details
        console.log('Appointment details:', result.appointment);
        toast.success('Appointment details loaded');
        // TODO: Show appointment details in a modal
      } else {
        toast.error(result.message || 'Failed to load appointment details');
      }
    } catch (error) {
      console.error('Error viewing appointment:', error);
      toast.error('Failed to load appointment details');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/doctor/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Appointment cancelled successfully');
        fetchDashboardData(); // Refresh the dashboard
      } else {
        toast.error(result.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleMarkAsChecked = async (appointmentId) => {
    if (!confirm('Mark this patient as checked? This will add them to your patients list.')) {
      return;
    }

    try {
      const response = await fetch(`/api/doctor/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'checked',
          notes: 'Patient checked by doctor'
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Patient marked as checked successfully');
        fetchDashboardData(); // Refresh the dashboard
      } else {
        toast.error(result.message || 'Failed to mark patient as checked');
      }
    } catch (error) {
      console.error('Error marking patient as checked:', error);
      toast.error('Failed to mark patient as checked');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Today's Appointments ({dashboardData.todaysAppointments.length})
        </h3>
        {dashboardData.todaysAppointments.length > 0 ? (
          <AppointmentTable 
            appointments={dashboardData.todaysAppointments}
            onViewAppointment={handleViewAppointment}
            onCancelAppointment={handleCancelAppointment}
            onMarkAsChecked={handleMarkAsChecked}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upcoming Appointments ({dashboardData.upcomingAppointments.length})
        </h3>
        {dashboardData.upcomingAppointments.length > 0 ? (
          <AppointmentTable 
            appointments={dashboardData.upcomingAppointments}
            onViewAppointment={handleViewAppointment}
            onCancelAppointment={handleCancelAppointment}
            onMarkAsChecked={handleMarkAsChecked}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
        )}
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue:</span>
              <span className="font-semibold">₹{dashboardData.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Revenue:</span>
              <span className="font-semibold">₹{dashboardData.monthlyRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Appointments:</span>
              <span className="font-semibold">{dashboardData.totalAppointments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patients Today:</span>
              <span className="font-semibold">{dashboardData.patientsToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cancellations:</span>
              <span className="font-semibold">{dashboardData.cancelledAppointments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
