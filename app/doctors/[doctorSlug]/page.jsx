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
import { extractDoctorIdFromSlug } from "@/lib/utils";
import BookingChatBot from "@/components/shared/BookingChatBot";

const DoctorDescriptionPage = () => {
  const { doctorSlug } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        setLoading(true);

        // Extract doctor ID from slug
        const doctorId = extractDoctorIdFromSlug(doctorSlug);

        if (!doctorId) {
          setError("Invalid doctor URL");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/doctors/${doctorId}`);
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

    if (doctorSlug) {
      fetchDoctor();
    }
  }, [doctorSlug]);

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
    domain = "",
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
                      e.target.src = "/doc1.png";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">{hospital}</span>
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="mt-6 space-y-4">
                  {availability && availability.length > 0 && (
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <FaRegClock className="text-blue-500 text-xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Available Days</p>
                        <p className="font-medium">{availability.join(", ")}</p>
                      </div>
                    </div>
                  )}

                  {hospital && (
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <FaHospital className="text-green-500 text-xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Hospital</p>
                        <p className="font-medium">{hospital}</p>
                      </div>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <FaPhoneAlt className="text-blue-500 text-xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{phone}</p>
                      </div>
                    </div>
                  )}

                  {hasWebsite && (websiteUrl || domain) && (
                    <div className="flex items-center p-4 bg-purple-50 rounded-lg">
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
                        <p className="font-medium">{domain || websiteUrl}</p>
                      </div>
                    </div>
                  )}
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
                    <p className="font-semibold mt-1">{specialization}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <FaGraduationCap className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Degree</span>
                    </div>
                    <p className="font-semibold mt-1">{degree}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <MdHealthAndSafety className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Experience</span>
                    </div>
                    <p className="font-semibold mt-1">{experience} years</p>
                  </div>
                </div>

                {/* Consultation Types */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Consultation Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {virtualConsultation && (
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="font-medium">
                            Virtual Consultation
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Available for online appointments
                        </p>
                      </div>
                    )}
                    {inPersonConsultation && (
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="font-medium">
                            In-Person Consultation
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Available for physical appointments
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Consultation Fee</h3>
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="font-medium">₹{price || 0}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Per consultation
                    </p>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">About</h3>
                  <p className="text-gray-700 leading-relaxed">{about}</p>
                </div>

                {/* Services Section */}
                {services && services.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((service, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg flex items-center"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Slots Section */}
                {slots && Object.keys(slots).length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">
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
        </div>
      </div>

      {/* Booking ChatBot */}
      <BookingChatBot doctorId={extractDoctorIdFromSlug(doctorSlug)} />
    </div>
  );
};

export default DoctorDescriptionPage;
