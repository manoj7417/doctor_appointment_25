// app/api/doctor/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ message: 'Logged out' });

    // Clear the doctorToken cookie
    response.cookies.set('doctorToken', '', {
        path: '/',
        maxAge: 0,
    });

    return response;
}
