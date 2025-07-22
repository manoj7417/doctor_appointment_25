import { NextResponse } from 'next/server';

const publicRoutes = ['/login', '/register', '/verify-otp', '/doctor-login', '/doctor-registration']; // add '/doctor-login'
const doctorLoginRoute = '/doctor-login';

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const doctorToken = request.cookies.get('doctorToken')?.value;
    const pathname = request.nextUrl.pathname;

    const isPublic = publicRoutes.includes(pathname);
    const isDoctorRoute = pathname.startsWith('/doctor-dashboard') || pathname.startsWith('/doctor-profile');
    const isDoctorLogin = pathname === doctorLoginRoute;

    // Redirect unauthenticated doctor users trying to access doctor routes
    if (isDoctorRoute && !doctorToken) {
        return NextResponse.redirect(new URL(doctorLoginRoute, request.url));
    }

    // Redirect unauthenticated regular users trying to access user routes
    if (!isDoctorRoute && !token && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect authenticated users away from public user pages
    if (!isDoctorRoute && token && isPublic) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect authenticated doctor away from doctor login page
    if (isDoctorLogin && doctorToken) {
        return NextResponse.redirect(new URL('/doctor-dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/find-doctor',
        '/medicine',
        '/login',
        '/register',
        '/verify-otp',
        '/doctor-login',
        '/doctor-registration',
        '/doctor-dashboard/:path*',
        '/doctor-profile/:path*',
    ],
};
