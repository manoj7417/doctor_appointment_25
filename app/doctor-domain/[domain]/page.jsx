"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BookingChatBot from "@/components/shared/BookingChatBot";

export default function DoctorDomainPage() {
  const params = useParams();
  const domain = params.domain;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorByDomain = async () => {
      try {
        setLoading(true);

        console.log("🔍 Original domain parameter:", domain);

        // Only access window.location on the client side
        if (typeof window !== "undefined") {
          console.log("🔍 Current URL:", window.location.href);
          console.log("🔍 Current pathname:", window.location.pathname);
        }

        // Clean the domain parameter - remove protocol and path if present
        let cleanDomain = domain;
        if (domain.includes("://")) {
          cleanDomain = domain.split("://")[1];
        }
        if (cleanDomain.includes("/")) {
          cleanDomain = cleanDomain.split("/")[0];
        }

        console.log("🔍 Cleaned domain:", cleanDomain);

        const response = await fetch(
          `/api/doctor/by-domain?domain=${encodeURIComponent(cleanDomain)}`
        );
        const data = await response.json();

        console.log("📡 API Response:", data);

        if (response.ok && data.doctor) {
          setDoctor(data.doctor);
          console.log("✅ Doctor found:", data.doctor.name);
        } else {
          setError(data.message || "Doctor not found");
          console.error("❌ Error fetching doctor:", data.message);
        }
      } catch (err) {
        setError("Failed to load doctor information");
        console.error("❌ Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (domain) {
      fetchDoctorByDomain();
    }
  }, [domain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Doctor Not Found
              </h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Domain:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">{domain}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                No Doctor Found
              </h1>
              <p className="text-gray-600">
                This domain is not associated with any doctor.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract doctor data with fallbacks
  const {
    _id,
    name = "Doctor Name",
    image = "/doc1.png",
    specialization = "General Medicine",
    experience = 0,
    degree = "MD",
    hospital = "Not specified",
    rating = 4.5,
    availability = [],
    virtualConsultation = false,
    inPersonConsultation = false,
    about = "No information available about this doctor.",
    services = [],
    price = 0,
    address = "",
    email = "",
    phone = "",
    slots = {},
    status = "pending",
    hasWebsite = false,
    websiteUrl = "",
    domain: doctorDomain = "",
    slug = "",
  } = doctor;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img
                src={image}
                alt={name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{name}</h1>
                <p className="text-sm text-gray-500">{specialization}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Custom Domain</p>
              <p className="text-sm font-medium text-gray-900">
                {doctorDomain}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <img
                  src={image}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {name}
                </h2>
                <p className="text-lg text-blue-600 font-medium mb-1">
                  {specialization}
                </p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {rating} ({Math.floor(Math.random() * 100) + 50} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <svg
                    className="text-blue-500 text-xl mr-3 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{experience} years</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <svg
                    className="text-green-500 text-xl mr-3 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Consultation Fee</p>
                    <p className="font-medium">₹{price}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <svg
                    className="text-purple-500 text-xl mr-3 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{hospital}</p>
                  </div>
                </div>

                {hasWebsite && (websiteUrl || doctorDomain) && (
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <svg
                      className="text-purple-500 text-xl mr-3 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="font-medium">
                        {doctorDomain || websiteUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {email && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-gray-600">{email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-gray-600">{phone}</span>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-start text-sm">
                      <svg
                        className="w-4 h-4 text-gray-400 mr-3 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">{address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                About Dr. {name}
              </h3>
              <p className="text-gray-700 leading-relaxed">{about}</p>
            </div>

            {/* Services Section */}
            {services && services.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Services Offered
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consultation Types */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Consultation Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {virtualConsultation && (
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">
                        Virtual Consultation
                      </p>
                      <p className="text-sm text-gray-600">
                        Video/Phone consultation available
                      </p>
                    </div>
                  </div>
                )}
                {inPersonConsultation && (
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">
                        In-Person Consultation
                      </p>
                      <p className="text-sm text-gray-600">
                        Visit the clinic for consultation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            {availability && availability.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Days
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availability.map((day, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Slots Section */}
            {slots && Object.keys(slots).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(slots).map(([day, timeSlots]) => (
                    <div key={day} className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold mb-2">{day}</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(timeSlots) &&
                          timeSlots.map((slot, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {slot}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking ChatBot */}
      <BookingChatBot doctorId={_id} />
    </div>
  );
}
