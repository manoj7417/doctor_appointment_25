import { NextResponse } from 'next/server';

// List of your main domains (exclude custom doctor domains)
const MAIN_DOMAINS = [
    'localhost',
    'localhost:3000',
    'localhost:3001',
    '127.0.0.1',
    '127.0.0.1:3000',
    'yourdomain.com',
    'www.yourdomain.com',
    // Add your main production domains here
];

export function middleware(request) {
    const { pathname, hostname } = request.nextUrl;
    const doctorToken = request.cookies.get('doctorToken')?.value;

    console.log('🔍 Middleware - Hostname:', hostname, 'Pathname:', pathname);

    // Check if this is a custom doctor domain
    const isCustomDomain = !MAIN_DOMAINS.includes(hostname);

    if (isCustomDomain) {
        console.log('🎯 Custom domain detected:', hostname);

        // Route to the custom doctor page
        const url = request.nextUrl.clone();
        url.pathname = `/doctor-domain/${hostname}`;

        return NextResponse.rewrite(url);
    }

    // Handle authentication for main domain doctor routes
    const doctorLoginRoute = '/doctor-login';
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
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
