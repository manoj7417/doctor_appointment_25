"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/doctor/getAll");
      const data = await response.json();

      if (data.success) {
        setDoctors(data.doctors);
        console.log("Fetched doctors:", data.doctors); // Debug log
        // Log image URLs for debugging
        data.doctors.forEach((doctor, index) => {
          console.log(`Doctor ${index + 1} (${doctor.name}):`, {
            image: doctor.image,
            hasImage: !!doctor.image,
            imageType: typeof doctor.image,
            finalImageUrl: doctor.image || "/doc1.png",
          });
        });

        // Preload images to ensure they're cached
        data.doctors.forEach((doctor) => {
          if (doctor.image) {
            const img = new Image();
            img.src = doctor.image;
          }
        });
      } else {
        setError(data.message || "Failed to fetch doctors");
      }
    } catch (err) {
      setError("Error fetching doctors");
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">
            Loading doctors...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Doctors
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDoctors}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Our Medical Professionals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with experienced healthcare providers for personalized care
            and expert medical consultation
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Verified Doctors</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Online Booking</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Doctors Available
              </h3>
              <p className="text-gray-600">
                We're currently setting up our network of healthcare providers.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Doctor Image */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={doctor.image || "/doc1.png"}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.log("Image failed to load:", doctor.image);
                      e.target.src = "/doc1.png";
                    }}
                  />

                  {/* Status Badge */}
                  {doctor.status === "approved" && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      Verified
                    </div>
                  )}

                  {/* Specialization Badge */}
                  {doctor.specialization && (
                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-1 rounded-lg shadow-sm">
                      {doctor.specialization}
                    </div>
                  )}
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>

                    {doctor.degree && (
                      <p className="text-sm text-gray-600 mb-2">
                        {doctor.degree}
                      </p>
                    )}

                    {doctor.experience && (
                      <p className="text-sm text-gray-600">
                        {doctor.experience} years of experience
                      </p>
                    )}
                  </div>

                  {doctor.hospital && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 font-medium">
                          {doctor.hospital}
                        </span>
                      </div>
                    </div>
                  )}

                  {doctor.price && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Consultation Fee
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          ₹{doctor.price}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Services */}
                  {doctor.services && doctor.services.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Services
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {doctor.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium"
                          >
                            {service}
                          </span>
                        ))}
                        {doctor.services.length > 3 && (
                          <span className="text-xs text-gray-500 font-medium">
                            +{doctor.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {doctor.availability && doctor.availability.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Available Days
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {doctor.availability.slice(0, 3).map((day, index) => (
                          <span
                            key={index}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium"
                          >
                            {day}
                          </span>
                        ))}
                        {doctor.availability.length > 3 && (
                          <span className="text-xs text-gray-500 font-medium">
                            +{doctor.availability.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/doctors/${doctor.slug}`}
                      className="flex-1 bg-gray-100 text-gray-800 text-sm font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center border border-gray-200"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
