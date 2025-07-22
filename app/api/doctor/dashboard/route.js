import { connectDB } from '@/lib/dbConfig';
import bookingModel from '@/models/bookingModel';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export async function GET(req) {
    try {
        await connectDB();

        // Get doctor ID from cookies
        const token = req.cookies.get('doctorToken')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.doctorId) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const doctorId = decoded.doctorId;

        // Get current date for today's calculations
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        // Get current month for monthly calculations
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        // Fetch all bookings for this doctor
        const allBookings = await bookingModel.find({ doctorId }).sort({ appointmentDate: -1 });

        // Calculate dashboard stats
        const totalAppointments = allBookings.length;

        const todayAppointments = allBookings.filter(booking =>
            booking.appointmentDate >= startOfToday &&
            booking.appointmentDate <= endOfToday
        );

        const patientsToday = todayAppointments.length;

        const cancelledAppointments = allBookings.filter(booking =>
            booking.status === 'cancelled'
        ).length;

        const totalRevenue = allBookings
            .filter(booking => booking.paymentStatus === 'completed')
            .reduce((sum, booking) => sum + booking.price, 0);

        // Calculate monthly revenue
        const monthlyRevenue = allBookings
            .filter(booking =>
                booking.appointmentDate >= startOfMonth &&
                booking.appointmentDate <= endOfMonth &&
                booking.paymentStatus === 'completed'
            )
            .reduce((sum, booking) => sum + booking.price, 0);

        // Get upcoming appointments (next 7 days)
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcomingAppointments = allBookings
            .filter(booking =>
                booking.appointmentDate >= today &&
                booking.appointmentDate <= nextWeek &&
                booking.status !== 'cancelled'
            )
            .slice(0, 10); // Limit to 10 upcoming appointments

        // Get today's appointments
        const todaysAppointments = allBookings
            .filter(booking =>
                booking.appointmentDate >= startOfToday &&
                booking.appointmentDate <= endOfToday &&
                booking.status !== 'cancelled'
            )
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

        // Calculate percentage changes (mock data for now)
        const stats = [
            {
                title: "Total Appointments",
                value: totalAppointments.toString(),
                change: "+12%",
                isPositive: true,
            },
            {
                title: "Patients Today",
                value: patientsToday.toString(),
                change: "+2%",
                isPositive: true
            },
            {
                title: "Cancellations",
                value: cancelledAppointments.toString(),
                change: "-1%",
                isPositive: false
            },
            {
                title: "Revenue",
                value: `₹${totalRevenue.toLocaleString()}`,
                change: "+8%",
                isPositive: true
            },
        ];

        // Format appointments for the table
        const formattedTodaysAppointments = todaysAppointments.map(booking => ({
            id: booking._id,
            patient: booking.patientName,
            phone: booking.patientPhone,
            time: new Date(booking.appointmentDate).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            date: new Date(booking.appointmentDate).toLocaleDateString('en-IN'),
            status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
            paymentStatus: booking.paymentStatus,
            price: booking.price,
            token: booking.token,
            notes: booking.notes
        }));

        const formattedUpcomingAppointments = upcomingAppointments.map(booking => ({
            id: booking._id,
            patient: booking.patientName,
            phone: booking.patientPhone,
            time: new Date(booking.appointmentDate).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            date: new Date(booking.appointmentDate).toLocaleDateString('en-IN'),
            status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
            paymentStatus: booking.paymentStatus,
            price: booking.price,
            token: booking.token,
            notes: booking.notes
        }));

        return NextResponse.json({
            success: true,
            data: {
                stats,
                todaysAppointments: formattedTodaysAppointments,
                upcomingAppointments: formattedUpcomingAppointments,
                totalRevenue,
                monthlyRevenue,
                totalAppointments,
                patientsToday,
                cancelledAppointments
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching dashboard data', error: error.message },
            { status: 500 }
        );
    }
} 