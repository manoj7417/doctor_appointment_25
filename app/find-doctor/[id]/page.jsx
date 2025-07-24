"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaRegClock,
  FaHospital,
  FaGraduationCap,
  FaBriefcaseMedical,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";

const DoctorDescriptionPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors/${id}`);
        const data = await response.json();

        console.log("Fetched doctor data:", data);

        if (data.success) {
          setDoctor(data.doctor);
        } else {
          setError(data.message || "Failed to fetch doctor details");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDoctor();
    }
  }, [id]);

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

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Doctor Not Found
              </h2>
              <p className="text-gray-600">
                {error || "The doctor you're looking for doesn't exist."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract doctor data with fallbacks
  const {
    name = "Doctor Name",
    image = "/default-doctor.png",
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
    status = "pending"
  } = doctor;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Doctor Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-blue-100">{specialization}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FaStar className="text-yellow-300 mr-1" />
                <span className="font-semibold">{rating}</span>
                <span className="text-blue-100 ml-1">/5</span>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Doctor Image & Booking */}
              <div className="lg:w-1/3">
                <div className="relative group">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-auto rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/default-doctor.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">
                      {hospital}
                    </span>
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="mt-6 space-y-4">
                  {availability && availability.length > 0 && (
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <FaRegClock className="text-blue-500 text-xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="font-medium">
                          {availability.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <FaHospital className="text-blue-500 text-xl mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Hospital</p>
                      <p className="font-medium">{hospital}</p>
                    </div>
                  </div>
                  {phone && (
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <FaPhoneAlt className="text-blue-500 text-xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Card */}
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-lg text-blue-800 mb-4">
                    Book an Appointment
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Time
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>09:00 AM</option>
                        <option>10:30 AM</option>
                        <option>12:00 PM</option>
                        <option>02:00 PM</option>
                        <option>04:30 PM</option>
                      </select>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                      Confirm Appointment
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Doctor Details */}
              <div className="lg:w-2/3">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <FaBriefcaseMedical className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">
                        Specialization
                      </span>
                    </div>
                    <p className="font-semibold mt-1">
                      {specialization}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <FaGraduationCap className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Degree</span>
                    </div>
                    <p className="font-semibold mt-1">
                      {degree}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <MdHealthAndSafety className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Experience</span>
                    </div>
                    <p className="font-semibold mt-1">
                      {experience} years
                    </p>
                  </div>
                </div>

                {/* Consultation Types */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Consultation Types
                  </h3>
                  
                  {virtualConsultation && inPersonConsultation ? (
                    // Both consultation types available - show prominent indicator
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-purple-800">Flexible Consultation Options</h4>
                          <p className="text-sm text-purple-600">Choose between virtual or in-person appointments</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center bg-green-50 p-3 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-green-800 font-medium">Virtual Consultation</span>
                        </div>
                        <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="text-blue-800 font-medium">In-Person Consultation</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Individual consultation types
                    <div className="flex flex-wrap gap-3">
                      {virtualConsultation && (
                        <div className="flex items-center bg-green-50 p-3 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-green-800 font-medium">Virtual Consultation Available</span>
                        </div>
                      )}
                      {inPersonConsultation && (
                        <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="text-blue-800 font-medium">In-Person Consultation Available</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* About Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    About {name}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {about}
                  </p>
                </div>

                {/* Services Section */}
                {services && services.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Services Offered
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-start bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <MdHealthAndSafety className="text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">
                            {service}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Slots Section */}
                {slots && Object.keys(slots).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Available Time Slots
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(slots).map(([day, timeSlots]) => (
                        <div key={day} className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-800 mb-2">{day}</h3>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(timeSlots) && timeSlots.map((slot, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patient Reviews (Placeholder) */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Patient Reviews
                  </h2>
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <p className="text-center text-gray-600">
                      This doctor has an average rating of{" "}
                      <span className="font-bold">
                        {rating}/5
                      </span>{" "}
                      from patient reviews.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                        View all reviews →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDescriptionPage;
