import { NextResponse } from 'next/server';

const doctorLoginRoute = '/doctor-login';

export function middleware(request) {
    const doctorToken = request.cookies.get('doctorToken')?.value;
    const pathname = request.nextUrl.pathname;

    const isDoctorRoute = pathname.startsWith('/doctor-dashboard') || pathname.startsWith('/doctor-profile');
    const isDoctorLogin = pathname === doctorLoginRoute;

    // Redirect unauthenticated doctor users trying to access doctor routes
    if (isDoctorRoute && !doctorToken) {
        return NextResponse.redirect(new URL(doctorLoginRoute, request.url));
    }

    // Redirect authenticated doctor away from doctor login page
    if (isDoctorLogin && doctorToken) {
        return NextResponse.redirect(new URL('/doctor-dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/doctor-login',
        '/doctor-registration',
        '/doctor-dashboard/:path*',
        '/doctor-profile/:path*',
    ],
};
