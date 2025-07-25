"use client";
import { generateDoctorSlug } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaRegClock,
  FaHospital,
  FaGraduationCap,
  FaBriefcaseMedical,
  FaArrowRight,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";

const DoctorHomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/doctor/getAll");
        const data = await res.json();

        console.log("API response:", data);
        console.log("Total doctors found:", data.totalCount);

        if (data.success) {
          console.log("Doctors fetched with complete details:", data.doctors.map(d => ({ 
            name: d.name, 
            status: d.status, 
            id: d._id,
            specialization: d.specialization,
            experience: d.experience,
            hospital: d.hospital,
            price: d.price,
            availability: d.availability,
            services: d.services,
            about: d.about,
            image: d.image,
            slots: d.slots,
            degree: d.degree,
            virtualConsultation: d.virtualConsultation,
            inPersonConsultation: d.inPersonConsultation
          })));
          setDoctors(data.doctors);
        } else {
          setError(data.message || "Failed to load doctors");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctor) => {
    const slug = generateDoctorSlug(doctor.name, doctor._id);
    router.push(`/doctors/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Healthcare Professionals
          </h1>
          <p className="text-xl text-gray-600">
            Choose from our network of experienced doctors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor) => {
          const {
            _id,
            name,
            image,
            specialization,
            experience,
            hospital,
            degree,
            status,
          } = doctor;

          return (
            <div
              key={_id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105 transition-transform duration-300"
                onClick={() => handleDoctorClick(doctor)}
              >
                {/* Doctor Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
                  <img
                    src={image || "/default-doctor.png"}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-doctor.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{name || "Doctor Name"}</h3>
                    <p className="text-blue-100">{specialization || "General Medicine"}</p>
                        </div>
                  <div className="absolute top-4 right-4 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <FaStar className="text-yellow-300 mr-1" />
                    <span className="text-white font-semibold">4.8</span>
                      </div>
                    </div>

                {/* Doctor Info - Limited Details */}
                <div className="p-6">
                  <div className="space-y-3">
                    {/* Experience */}
                    <div className="flex items-center">
                      <MdHealthAndSafety className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        {experience || 0} years experience
                      </span>
                    </div>

                    {/* Hospital */}
                    <div className="flex items-center">
                      <FaHospital className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        {hospital || "Not specified"}
                      </span>
                    </div>

                    {/* Degree */}
                    <div className="flex items-center">
                      <FaGraduationCap className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        {degree || "MD"}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      status === "approved" 
                        ? "bg-green-100 text-green-800" 
                        : status === "pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {status}
                    </span>
                  </div>

                  {/* View Profile Button */}
                  <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                    <span>View Profile</span>
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {doctors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No Doctors Available
            </h3>
            <p className="text-gray-600">
              We're currently setting up our network of healthcare professionals.
            </p>
                  </div>
                )}
              </div>
            </div>
  );
};

export default DoctorHomePage;
