// app/not-found.jsx
export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl font-bold text-black mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6">
                Sorry, the page you're looking for doesn't exist.
            </p>
            <a
                href="/"
                className="bg-black text-white px-4 py-2 rounded hover:bg-black transition"
            >
                Go Back Home
            </a>
        </div>
    );
}
