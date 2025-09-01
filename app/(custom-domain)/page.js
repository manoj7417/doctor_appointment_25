export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to DoctorApp
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Find and book appointments with the best doctors in your area
                    </p>
                    <div className="space-y-4">
                        <p className="text-gray-500">
                            This is the main homepage for the DoctorApp platform.
                        </p>
                        <p className="text-gray-500">
                            Custom doctor domains will automatically redirect to their profile pages.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
