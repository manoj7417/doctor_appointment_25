import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Doctor Not Found
                </h1>
                <p className="text-gray-600 mb-4">
                    The doctor you&apos;re looking for doesn&apos;t exist or this domain is not associated with any doctor.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
}
