"use client";
import BookingChatBot from "@/components/shared/BookingChatBot";
import { extractDoctorIdFromSlug } from "@/lib/utils";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaRegClock,
  FaHospital,
  FaGraduationCap,
  FaBriefcaseMedical,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import Head from "next/head";

const DoctorProfilePage = () => {
  const params = useParams();
  const { doctorSlug } = params;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const doctorId = extractDoctorIdFromSlug(doctorSlug);
        const res = await fetch(`/api/doctors/${doctorId}`);
        const data = await res.json();

        if (data.success) {
          setDoctor(data.doctor);
        } else {
          setError(data.message || "Doctor not found");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (doctorSlug) {
      fetchDoctor();
    }
  }, [doctorSlug]);

  // Generate SEO metadata
  const generateMetadata = () => {
    if (!doctor) return {};
    
    const title = `Dr. ${doctor.name} - ${doctor.specialization} | Healthcare Professional`;
    const description = doctor.about 
      ? doctor.about.substring(0, 160) + "..."
      : `Book an appointment with Dr. ${doctor.name}, ${doctor.specialization} specialist with ${doctor.experience} years of experience.`;
    
    return {
      title,
      description,
      keywords: `${doctor.name}, ${doctor.specialization}, doctor, healthcare, appointment, ${doctor.hospital}`,
      openGraph: {
        title,
        description,
        type: "profile",
        images: [doctor.image || "/default-doctor.png"],
      },
    };
  };

  const metadata = generateMetadata();

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Doctor Profile...</title>
        </Head>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
          <div className="max-w-6xl mx-auto">
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
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center p-4 bg-gray-100 rounded-lg">
                          <div className="h-6 w-6 bg-gray-300 rounded-full mr-3"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column Skeleton */}
                  <div className="lg:w-2/3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-gray-100 p-4 rounded-xl animate-pulse">
                          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error - Doctor Not Found</title>
        </Head>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Head>
          <title>Doctor Not Found</title>
        </Head>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h2>
              <p className="text-gray-600">The doctor you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const {
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
    phone,
    email,
    address,
    virtualConsultation,
    inPersonConsultation,
  } = doctor;

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0]} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.openGraph.images[0]} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Physician",
              "name": `Dr. ${name}`,
              "medicalSpecialty": specialization,
              "hospitalAffiliation": hospital,
              "description": about,
              "image": image || "/default-doctor.png",
              "url": typeof window !== "undefined" ? window.location.href : "",
            }),
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-3xl font-bold">{name}</h1>
                  <p className="text-blue-100">{specialization}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <FaStar className="text-yellow-300 mr-1" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-blue-100 ml-1">/5</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Doctor Image & Contact */}
                <div className="lg:w-1/3">
                  <div className="relative group mb-6">
                    <img
                      src={image || "/default-doctor.png"}
                      alt={name}
                      className="w-full h-auto rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-medium">{hospital}</span>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    {phone && (
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <FaPhone className="text-blue-500 text-xl mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{phone}</p>
                        </div>
                      </div>
                    )}

                    {email && (
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <FaEnvelope className="text-blue-500 text-xl mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{email}</p>
                        </div>
                      </div>
                    )}

                    {address && (
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <FaMapMarkerAlt className="text-blue-500 text-xl mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{address}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <FaRegClock className="text-blue-500 text-xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="font-medium">
                          {availability?.join(", ") || "Contact for availability"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <FaHospital className="text-blue-500 text-xl mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Hospital</p>
                        <p className="font-medium">{hospital}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Doctor Details */}
                <div className="lg:w-2/3">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center">
                        <FaBriefcaseMedical className="text-blue-500 mr-2" />
                        <span className="text-sm text-gray-500">Specialization</span>
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

                  {/* About Section */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      About Dr. {name}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {about || "No information available about this doctor."}
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
                            <span className="font-medium text-gray-800">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consultation Types */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Consultation Types
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {virtualConsultation && (
                        <div className="flex items-center p-4 bg-green-50 rounded-lg">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <FaPhone className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Virtual Consultation</p>
                            <p className="text-sm text-gray-600">Available</p>
                          </div>
                        </div>
                      )}
                      {inPersonConsultation && (
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <FaHospital className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">In-Person Consultation</p>
                            <p className="text-sm text-gray-600">Available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  {price && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        Consultation Fee
                      </h2>
                      <div className="bg-blue-50 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-gray-800">
                              Consultation Fee
                            </p>
                            <p className="text-sm text-gray-600">Per session</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-blue-600">₹{price}</p>
                            <p className="text-sm text-gray-600">Indian Rupees</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BookingChatBot doctorId={doctor._id} />
    </>
  );
};

export default DoctorProfilePage; 