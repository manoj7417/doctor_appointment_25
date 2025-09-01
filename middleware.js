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
    // IMPORTANT: remove shankarpolyclinic.com from here if it's meant to be a doctor domain
];

export function middleware(request) {
    const { pathname, hostname } = request.nextUrl;
    const doctorToken = request.cookies.get('doctorToken')?.value;

    console.log('🔍 Middleware - Hostname:', hostname, 'Pathname:', pathname);

    // Check if this is a custom doctor domain
    const isCustomDomain = !MAIN_DOMAINS.includes(hostname);

    // Handle doctor-domain routes on main domain first
    if (pathname.startsWith('/doctor-domain/')) {
        console.log('🎯 Doctor domain route detected:', pathname);
        // Let the route handler process this normally
        return NextResponse.next();
    }

    // Prevent infinite loops - if we're already on a custom domain path, don't rewrite
    if (isCustomDomain && pathname !== '/') {
        console.log('🎯 Custom domain with non-root path, skipping rewrite:', pathname);
        return NextResponse.next();
    }

    if (isCustomDomain) {
        console.log('🎯 Custom domain detected:', hostname);

        // Only rewrite if we're at the root path to prevent double paths
        if (pathname === '/' || pathname === '') {
            const url = request.nextUrl.clone();
            url.pathname = `/doctor-domain/${hostname}`;
            url.search = ''; // Clear any query parameters
            url.hash = ''; // Clear any hash

            console.log('🔄 Rewriting root path to:', url.pathname);
            return NextResponse.rewrite(url);
        } else {
            console.log('🎯 Non-root path on custom domain, skipping rewrite:', pathname);
            return NextResponse.next();
        }
    }

    // 🔒 Handle doctor auth only for main domains
    const doctorLoginRoute = '/doctor-login';
    const isDoctorRoute =
        pathname.startsWith('/doctor-dashboard') || pathname.startsWith('/doctor-profile');
    const isDoctorLogin = pathname === doctorLoginRoute;

    if (isDoctorRoute && !doctorToken) {
        return NextResponse.redirect(new URL(doctorLoginRoute, request.url));
    }

    if (isDoctorLogin && doctorToken) {
        return NextResponse.redirect(new URL('/doctor-dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
