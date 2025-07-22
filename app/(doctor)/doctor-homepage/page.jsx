"use client";
import BookingChatBot from "@/components/shared/BookingChatBot";
import { useDoctorStore } from "@/store/doctorStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaRegClock,
  FaHospital,
  FaGraduationCap,
  FaBriefcaseMedical,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";


const DoctorHomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/doctor/getAll");
        const data = await res.json();

        if (data.success) {
          setDoctors(data.doctors);
        } else {
          setError(data.message || "Failed to load doctors");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading doctors...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    // <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
    //   <div className="max-w-6xl mx-auto">
    //     <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    //       {/* Doctor Header */}
    //       <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
    //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
    //           <div>
    //             <h1 className="text-3xl font-bold">{filteredDoctor.name}</h1>
    //             <p className="text-blue-100">{filteredDoctor.specialization}</p>
    //           </div>
    //           <div className="mt-4 md:mt-0 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
    //             <FaStar className="text-yellow-300 mr-1" />
    //             <span className="font-semibold">{filteredDoctor.rating}</span>
    //             <span className="text-blue-100 ml-1">/5</span>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="p-6 md:p-8">
    //         <div className="flex flex-col lg:flex-row gap-8">
    //           {/* Left Column - Doctor Image & Booking */}
    //           <div className="lg:w-1/3">
    //             <div className="relative group">
    //               <img
    //                 src={filteredDoctor.image}
    //                 alt={filteredDoctor.name}
    //                 className="w-full h-auto rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300"
    //               />
    //               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
    //                 <span className="text-white font-medium">
    //                   {filteredDoctor.hospital}
    //                 </span>
    //               </div>
    //             </div>

    //             {/* Quick Info Cards */}
    //             <div className="mt-6 space-y-4">
    //               <div className="flex items-center p-4 bg-blue-50 rounded-lg">
    //                 <FaRegClock className="text-blue-500 text-xl mr-3" />
    //                 <div>
    //                   <p className="text-sm text-gray-500">Availability</p>
    //                   <p className="font-medium">
    //                     {filteredDoctor.availability}
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="flex items-center p-4 bg-blue-50 rounded-lg">
    //                 <FaHospital className="text-blue-500 text-xl mr-3" />
    //                 <div>
    //                   <p className="text-sm text-gray-500">Hospital</p>
    //                   <p className="font-medium">{filteredDoctor.hospital}</p>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Booking Card */}
    //             <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
    //               <h3 className="font-bold text-lg text-blue-800 mb-4">
    //                 Book an Appointment
    //               </h3>
    //               <div className="space-y-4">
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Select Date
    //                   </label>
    //                   <input
    //                     type="date"
    //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //                   />
    //                 </div>
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Select Time
    //                   </label>
    //                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    //                     <option>09:00 AM</option>
    //                     <option>10:30 AM</option>
    //                     <option>12:00 PM</option>
    //                     <option>02:00 PM</option>
    //                     <option>04:30 PM</option>
    //                   </select>
    //                 </div>
    //                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
    //                   Confirm Appointment
    //                 </button>
    //               </div>
    //             </div>
    //           </div>

    //           {/* Right Column - Doctor Details */}
    //           <div className="lg:w-2/3">
    //             {/* Stats Grid */}
    //             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
    //               <div className="bg-gray-50 p-4 rounded-xl">
    //                 <div className="flex items-center">
    //                   <FaBriefcaseMedical className="text-blue-500 mr-2" />
    //                   <span className="text-sm text-gray-500">
    //                     Specialization
    //                   </span>
    //                 </div>
    //                 <p className="font-semibold mt-1">
    //                   {filteredDoctor.specialization}
    //                 </p>
    //               </div>
    //               <div className="bg-gray-50 p-4 rounded-xl">
    //                 <div className="flex items-center">
    //                   <FaGraduationCap className="text-blue-500 mr-2" />
    //                   <span className="text-sm text-gray-500">Degree</span>
    //                 </div>
    //                 <p className="font-semibold mt-1">
    //                   {filteredDoctor.degree}
    //                 </p>
    //               </div>
    //               <div className="bg-gray-50 p-4 rounded-xl">
    //                 <div className="flex items-center">
    //                   <MdHealthAndSafety className="text-blue-500 mr-2" />
    //                   <span className="text-sm text-gray-500">Experience</span>
    //                 </div>
    //                 <p className="font-semibold mt-1">
    //                   {filteredDoctor.experience} years
    //                 </p>
    //               </div>
    //             </div>

    //             {/* About Section */}
    //             <div className="mb-8">
    //               <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
    //                 <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
    //                 About Dr. {filteredDoctor.name.split(" ")[2]}
    //               </h2>
    //               <p className="text-gray-700 leading-relaxed">
    //                 {filteredDoctor.about}
    //               </p>
    //             </div>

    //             {/* Services Section */}
    //             <div className="mb-8">
    //               <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
    //                 <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
    //                 Services Offered
    //               </h2>
    //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //                 {filteredDoctor.services.map((service, index) => (
    //                   <div
    //                     key={index}
    //                     className="flex items-start bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors"
    //                   >
    //                     <div className="bg-blue-100 p-2 rounded-full mr-3">
    //                       <MdHealthAndSafety className="text-blue-600" />
    //                     </div>
    //                     <span className="font-medium text-gray-800">
    //                       {service}
    //                     </span>
    //                   </div>
    //                 ))}
    //               </div>
    //             </div>

    //             {/* Patient Reviews (Placeholder) */}
    //             <div>
    //               <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
    //                 <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
    //                 Patient Reviews
    //               </h2>
    //               <div className="bg-blue-50 p-6 rounded-xl">
    //                 <p className="text-center text-gray-600">
    //                   This doctor has an average rating of{" "}
    //                   <span className="font-bold">
    //                     {filteredDoctor.rating}/5
    //                   </span>{" "}
    //                   from patient reviews.
    //                 </p>
    //                 <div className="mt-4 flex justify-center">
    //                   <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
    //                     View all reviews →
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      <div>
        {doctors.map((doctor) => {
          const {
            _id,
            name,
            image,
            specialization,
            experience,
            price,
            availability,
            hospital,
            degree,
            about,
            services,
            status,
          } = doctor;

          return (
            // <div
            //   key={_id}
            //   className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10"
            // >
            //   <div className="max-w-6xl mx-auto">
            //     <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            //       <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            //           <div>
            //             <h1 className="text-3xl font-bold">{name}</h1>
            //             <p className="text-blue-100">{specialization}</p>
            //           </div>
            //           <div className="mt-4 md:mt-0 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            //             <FaStar className="text-yellow-300 mr-1" />
            //             <span className="font-semibold">3</span>
            //             <span className="text-blue-100 ml-1">/5</span>
            //           </div>
            //         </div>
            //       </div>

            //       <div className="p-6 md:p-8">
            //         <div className="flex flex-col lg:flex-row gap-8">
            //           <div className="lg:w-1/3">
            //             <div className="relative group">
            //               <img
            //                 src={image || "/default-doctor.png"}
            //                 alt={name}
            //                 className="w-full h-auto rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300"
            //               />
            //               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            //                 <span className="text-white font-medium">
            //                   {hospital}
            //                 </span>
            //               </div>
            //             </div>

            //             <div className="mt-6 space-y-4">
            //               <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            //                 <FaRegClock className="text-blue-500 text-xl mr-3" />
            //                 <div>
            //                   <p className="text-sm text-gray-500">
            //                     Availability
            //                   </p>
            //                   <p className="font-medium">
            //                     {availability?.join(", ")}
            //                   </p>
            //                 </div>
            //               </div>
            //               <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            //                 <FaHospital className="text-blue-500 text-xl mr-3" />
            //                 <div>
            //                   <p className="text-sm text-gray-500">Hospital</p>
            //                   <p className="font-medium">{hospital}</p>
            //                 </div>
            //               </div>
            //             </div>
            //           </div>

            //           <div className="lg:w-2/3">
            //             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            //               <div className="bg-gray-50 p-4 rounded-xl">
            //                 <div className="flex items-center">
            //                   <FaBriefcaseMedical className="text-blue-500 mr-2" />
            //                   <span className="text-sm text-gray-500">
            //                     Specialization
            //                   </span>
            //                 </div>
            //                 <p className="font-semibold mt-1">
            //                   {specialization}
            //                 </p>
            //               </div>
            //               <div className="bg-gray-50 p-4 rounded-xl">
            //                 <div className="flex items-center">
            //                   <FaGraduationCap className="text-blue-500 mr-2" />
            //                   <span className="text-sm text-gray-500">
            //                     Degree
            //                   </span>
            //                 </div>
            //                 <p className="font-semibold mt-1">{degree}</p>
            //               </div>
            //               <div className="bg-gray-50 p-4 rounded-xl">
            //                 <div className="flex items-center">
            //                   <MdHealthAndSafety className="text-blue-500 mr-2" />
            //                   <span className="text-sm text-gray-500">
            //                     Experience
            //                   </span>
            //                 </div>
            //                 <p className="font-semibold mt-1">
            //                   {experience} years
            //                 </p>
            //               </div>
            //             </div>

            //             <div className="mb-8">
            //               <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            //                 <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            //                 About Dr. {name}
            //               </h2>
            //               <p className="text-gray-700 leading-relaxed">
            //                 {about}
            //               </p>
            //             </div>

            //             <div className="mb-8">
            //               <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            //                 <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            //                 Services Offered
            //               </h2>
            //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            //                 {services?.map((service, index) => (
            //                   <div
            //                     key={index}
            //                     className="flex items-start bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors"
            //                   >
            //                     <div className="bg-blue-100 p-2 rounded-full mr-3">
            //                       <MdHealthAndSafety className="text-blue-600" />
            //                     </div>
            //                     <span className="font-medium text-gray-800">
            //                       {service}
            //                     </span>
            //                   </div>
            //                 ))}
            //               </div>
            //             </div>
            //           </div>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            <div
              key={_id}
              className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10"
            >
              <div className="max-w-6xl mx-auto">
                {loading ? (
                  // Skeleton Loading State
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Skeleton */}
                    <div className="bg-gray-200 p-6 animate-pulse">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="space-y-2">
                          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="mt-4 md:mt-0 h-10 bg-gray-300 rounded-full w-24"></div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column Skeleton */}
                        <div className="lg:w-1/3 space-y-6">
                          <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse"></div>

                          <div className="space-y-4">
                            <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                              <div className="h-6 w-6 bg-gray-300 rounded-full mr-3"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                              </div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                              <div className="h-6 w-6 bg-gray-300 rounded-full mr-3"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column Skeleton */}
                        <div className="lg:w-2/3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {[1, 2, 3].map((item) => (
                              <div
                                key={item}
                                className="bg-gray-100 p-4 rounded-xl animate-pulse"
                              >
                                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                              </div>
                            ))}
                          </div>

                          <div className="mb-8">
                            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-300 rounded"></div>
                              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            </div>
                          </div>

                          <div className="mb-8">
                            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[1, 2, 3, 4].map((item) => (
                                <div
                                  key={item}
                                  className="flex items-start bg-gray-100 p-4 rounded-lg animate-pulse"
                                >
                                  <div className="h-8 w-8 bg-gray-300 rounded-full mr-3"></div>
                                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Actual Content when data is loaded
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <h1 className="text-3xl font-bold">{name}</h1>
                          <p className="text-blue-100">{specialization}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                          <FaStar className="text-yellow-300 mr-1" />
                          <span className="font-semibold">3</span>
                          <span className="text-blue-100 ml-1">/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/3">
                          <div className="relative group">
                            <img
                              src={image || "/default-doctor.png"}
                              alt={name}
                              className="w-full h-auto rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <span className="text-white font-medium">
                                {hospital}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 space-y-4">
                            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                              <FaRegClock className="text-blue-500 text-xl mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  Availability
                                </p>
                                <p className="font-medium">
                                  {availability?.join(", ")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                              <FaHospital className="text-blue-500 text-xl mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  Hospital
                                </p>
                                <p className="font-medium">{hospital}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-2/3">
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
                                <span className="text-sm text-gray-500">
                                  Degree
                                </span>
                              </div>
                              <p className="font-semibold mt-1">{degree}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <div className="flex items-center">
                                <MdHealthAndSafety className="text-blue-500 mr-2" />
                                <span className="text-sm text-gray-500">
                                  Experience
                                </span>
                              </div>
                              <p className="font-semibold mt-1">
                                {experience} years
                              </p>
                            </div>
                          </div>

                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                              About Dr. {name}
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                              {about}
                            </p>
                          </div>

                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                              Services Offered
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {services?.map((service, index) => (
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
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <BookingChatBot />
    </>
  );
};

export default DoctorHomePage;
