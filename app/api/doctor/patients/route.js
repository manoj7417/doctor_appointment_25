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

        // Get query parameters for filtering
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        // Build query filter - Only show patients that doctor has checked/completed
        // This ensures only patients whose appointments have been marked as 'checked' or 'completed' are shown
        let filter = {
            doctorId,
            status: { $in: ['completed', 'checked'] } // Only show patients doctor has seen
        };

        if (search) {
            filter.$or = [
                { patientName: { $regex: search, $options: 'i' } },
                { patientPhone: { $regex: search, $options: 'i' } },
                { patientEmail: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'all') {
            filter.status = status;
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Fetch patients with pagination
        const patients = await bookingModel.find(filter)
            .sort({ appointmentDate: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const totalPatients = await bookingModel.countDocuments(filter);

        // Group patients by unique patient information
        const uniquePatients = [];
        const patientMap = new Map();

        patients.forEach(booking => {
            const patientKey = booking.patientPhone; // Use phone as unique identifier

            if (!patientMap.has(patientKey)) {
                const patientData = {
                    id: booking._id,
                    patientName: booking.patientName,
                    patientPhone: booking.patientPhone,
                    patientEmail: booking.patientEmail,
                    totalAppointments: 1,
                    lastVisit: booking.appointmentDate,
                    firstVisit: booking.appointmentDate,
                    totalSpent: booking.paymentStatus === 'completed' ? booking.price : 0,
                    status: booking.status,
                    latestBooking: booking,
                    allBookings: [booking]
                };

                patientMap.set(patientKey, patientData);
                uniquePatients.push(patientData);
            } else {
                const existingPatient = patientMap.get(patientKey);
                existingPatient.totalAppointments += 1;
                existingPatient.totalSpent += booking.paymentStatus === 'completed' ? booking.price : 0;

                // Update last visit if this booking is more recent
                if (new Date(booking.appointmentDate) > new Date(existingPatient.lastVisit)) {
                    existingPatient.lastVisit = booking.appointmentDate;
                    existingPatient.latestBooking = booking;
                }

                // Update first visit if this booking is older
                if (new Date(booking.appointmentDate) < new Date(existingPatient.firstVisit)) {
                    existingPatient.firstVisit = booking.appointmentDate;
                }

                existingPatient.allBookings.push(booking);
            }
        });

        // Sort patients by last visit (most recent first)
        uniquePatients.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));

        // Calculate additional statistics for checked patients only
        const totalRevenue = uniquePatients.reduce((sum, patient) => sum + patient.totalSpent, 0);
        const activePatients = uniquePatients.filter(patient =>
            new Date(patient.lastVisit) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        ).length;

        // Format patient data for response
        const formattedPatients = uniquePatients.map(patient => ({
            id: patient.id,
            patientName: patient.patientName,
            patientPhone: patient.patientPhone,
            patientEmail: patient.patientEmail,
            totalAppointments: patient.totalAppointments,
            lastVisit: new Date(patient.lastVisit).toLocaleDateString('en-IN'),
            firstVisit: new Date(patient.firstVisit).toLocaleDateString('en-IN'),
            totalSpent: patient.totalSpent,
            status: patient.latestBooking.status,
            paymentStatus: patient.latestBooking.paymentStatus,
            nextAppointment: patient.latestBooking.status === 'confirmed' ?
                new Date(patient.latestBooking.appointmentDate).toLocaleDateString('en-IN') : null,
            latestBookingId: patient.latestBooking._id
        }));

        return NextResponse.json({
            success: true,
            data: {
                patients: formattedPatients,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalPatients / limit),
                    totalPatients,
                    hasNextPage: page * limit < totalPatients,
                    hasPrevPage: page > 1
                },
                statistics: {
                    totalPatients: uniquePatients.length,
                    totalRevenue,
                    activePatients,
                    averageAppointmentsPerPatient: uniquePatients.length > 0 ?
                        (patients.length / uniquePatients.length).toFixed(1) : 0
                }
            }
        });

    } catch (error) {
        console.error('Patients fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching patients data', error: error.message },
            { status: 500 }
        );
    }
} 