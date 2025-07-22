"use client";
import { useParams } from "next/navigation";
import React from "react";
import {
  FaStar,
  FaRegClock,
  FaHospital,
  FaGraduationCap,
  FaBriefcaseMedical,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";

// const doctorsData = [
//   {
//     id: 1,
//     name: "Dr. Sarah Johnson",
//     image: "/doc1.png",
//     specialization: "Cardiology",
//     experience: 12,
//     degree: "MD, FRCS",
//     hospital: "Central Medical Center",
//     rating: 4.8,
//     availability: "Mon, Wed, Fri",
//   },
//   {
//     id: 2,
//     name: "Dr. Emma Watson",
//     image: "/doc2.png",
//     specialization: "Neurology",
//     experience: 8,
//     degree: "MBBS, DM",
//     hospital: "City General Hospital",
//     rating: 4.5,
//     availability: "Tue, Thu, Sat",
//   },
//   {
//     id: 3,
//     name: "Dr. Rebecca Williams",
//     image: "/doc3.png",
//     specialization: "Dermatology",
//     experience: 15,
//     degree: "MD, DNB",
//     hospital: "Skin & Care Clinic",
//     rating: 4.9,
//     availability: "Mon to Fri",
//   },
//   {
//     id: 4,
//     name: "Dr. James Wilson",
//     image: "/doc4.png",
//     specialization: "Orthopedics",
//     experience: 20,
//     degree: "MBBS, MS",
//     hospital: "Joint & Bone Institute",
//     rating: 4.7,
//     availability: "Wed to Sun",
//   },
//   {
//     id: 5,
//     name: "Dr. Emily Rodriguez",
//     image: "/doc5.png",
//     specialization: "Pediatrics",
//     experience: 6,
//     degree: "MD, DCH",
//     hospital: "Children's Hospital",
//     rating: 4.6,
//     availability: "Mon, Tue, Fri",
//   },
//   {
//     id: 6,
//     name: "Dr. David Kim",
//     image: "/doc6.png",
//     specialization: "Cardiology",
//     experience: 10,
//     degree: "MBBS, DM",
//     hospital: "Heart Institute",
//     rating: 4.4,
//     availability: "Thu, Fri, Sat",
//   },
// ];

const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    image: "/doc1.png",
    specialization: "Cardiology",
    experience: 12,
    degree: "MD, FRCS",
    hospital: "Central Medical Center",
    rating: 4.8,
    availability: "Mon, Wed, Fri",
    virtualConsultation: true,
    inPersonConsultation: true,
    about:
      "Dr. Johnson is a board-certified cardiologist with extensive experience in interventional procedures. She has published numerous papers on cardiovascular health and is known for her patient-centered approach. Her expertise includes complex coronary interventions and preventive cardiology.",
    services: [
      "Cardiac consultation",
      "Echocardiography",
      "Stress testing",
      "Angioplasty",
      "Pacemaker implantation",
      "Holter monitoring",
    ],
  },
  {
    id: 2,
    name: "Dr. Emma Watson",
    image: "/doc2.png",
    specialization: "Neurology",
    experience: 8,
    degree: "MBBS, DM",
    hospital: "City General Hospital",
    rating: 4.5,
    availability: "Tue, Thu, Sat",
    virtualConsultation: true,
    inPersonConsultation: false,
    about:
      "Dr. Watson specializes in treating complex neurological disorders with a focus on minimally invasive techniques. Her research on neurodegenerative diseases has been internationally recognized. She takes a holistic approach to neurological care.",
    services: [
      "Neurological assessment",
      "EEG and EMG testing",
      "Migraine management",
      "Stroke rehabilitation",
      "Epilepsy treatment",
      "Memory disorder evaluation",
    ],
  },
  {
    id: 3,
    name: "Dr. Rebecca Williams",
    image: "/doc3.png",
    specialization: "Dermatology",
    experience: 15,
    degree: "MD, DNB",
    hospital: "Skin & Care Clinic",
    rating: 4.9,
    availability: "Mon to Fri",
    virtualConsultation: false,
    inPersonConsultation: true,
    about:
      "With over 15 years of experience, Dr. Williams is a leading dermatologist specializing in cosmetic and medical dermatology. She's known for her gentle approach and expertise in treating skin conditions across all age groups.",
    services: [
      "Acne treatment",
      "Skin cancer screening",
      "Chemical peels",
      "Laser therapy",
      "Psoriasis management",
      "Anti-aging treatments",
    ],
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    image: "/doc4.png",
    specialization: "Orthopedics",
    experience: 20,
    degree: "MBBS, MS",
    hospital: "Joint & Bone Institute",
    rating: 4.7,
    availability: "Wed to Sun",
    virtualConsultation: true,
    inPersonConsultation: true,
    about:
      "Dr. Wilson is a renowned orthopedic surgeon with expertise in joint replacements and sports medicine. His patient outcomes consistently rank among the best in the region, and he's passionate about helping patients regain mobility.",
    services: [
      "Joint replacement surgery",
      "Arthroscopic procedures",
      "Fracture treatment",
      "Sports injury management",
      "Spinal disorders",
      "Custom orthotics",
    ],
  },
  {
    id: 5,
    name: "Dr. Emily Rodriguez",
    image: "/doc5.png",
    specialization: "Pediatrics",
    experience: 6,
    degree: "MD, DCH",
    hospital: "Children's Hospital",
    rating: 4.6,
    availability: "Mon, Tue, Fri",
    virtualConsultation: true,
    inPersonConsultation: true,
    about:
      "Dr. Rodriguez is a compassionate pediatrician dedicated to providing comprehensive care for infants, children, and adolescents. She emphasizes preventive care and family education in her practice.",
    services: [
      "Well-child visits",
      "Vaccinations",
      "Developmental screenings",
      "Asthma management",
      "Nutrition counseling",
      "Behavioral assessments",
    ],
  },
  {
    id: 6,
    name: "Dr. David Kim",
    image: "/doc6.png",
    specialization: "Cardiology",
    experience: 10,
    degree: "MBBS, DM",
    hospital: "Heart Institute",
    rating: 4.4,
    availability: "Thu, Fri, Sat",
    virtualConsultation: false,
    inPersonConsultation: true,
    about:
      "Dr. Kim is an interventional cardiologist specializing in advanced cardiac procedures. His research focuses on innovative treatments for heart failure and he's known for his meticulous approach to patient care.",
    services: [
      "Cardiac catheterization",
      "Angiography",
      "Heart failure management",
      "Cholesterol management",
      "Electrophysiology studies",
      "Preventive cardiology",
    ],
  },
];
const DoctorDescriptionPage = () => {
  const { id } = useParams();

  const filteredDoctor = doctorsData.find((doctor) => doctor.id === Number(id));
  console.log("filteredDoctor", filteredDoctor);

  return (
    // <div>
    //   <div className="flex items-center justify-center p-4 mt-10">
    //     <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
    //       <div className="p-6">
    //         <div className="flex justify-between items-start mb-4">
    //           <h2 className="text-2xl font-bold">{filteredDoctor.name}</h2>
    //         </div>

    //         <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
    //           <div className="md:w-1/3">
    //             <img
    //               src={filteredDoctor.image}
    //               alt={filteredDoctor.name}
    //               className="w-full rounded-lg"
    //             />
    //             <div className="mt-4 bg-blue-50 p-4 rounded-lg">
    //               <h3 className="font-semibold text-blue-800 mb-2">
    //                 Available on
    //               </h3>
    //               <p>{filteredDoctor.availability}</p>
    //               <button className="mt-4 bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700">
    //                 Book Appointment
    //               </button>
    //             </div>
    //           </div>

    //           <div className="md:w-2/3">
    //             <div className="grid grid-cols-2 gap-4 mb-6">
    //               <div>
    //                 <p className="text-sm text-gray-500">Specialization</p>
    //                 <p className="font-medium">
    //                   {filteredDoctor.specialization}
    //                 </p>
    //               </div>
    //               <div>
    //                 <p className="text-sm text-gray-500">Experience</p>
    //                 <p className="font-medium">
    //                   {filteredDoctor.experience} years
    //                 </p>
    //               </div>
    //               <div>
    //                 <p className="text-sm text-gray-500">Degree</p>
    //                 <p className="font-medium">{filteredDoctor.degree}</p>
    //               </div>
    //               <div>
    //                 <p className="text-sm text-gray-500">Rating</p>
    //                 <p className="font-medium flex items-center">
    //                   <span className="text-yellow-500 mr-1">★</span>
    //                   {filteredDoctor.rating}/5
    //                 </p>
    //               </div>
    //             </div>

    //             <div>
    //               <h3 className="font-semibold text-lg mb-2">About Doctor</h3>
    //               <p className="text-gray-700">
    //                 {filteredDoctor.name} is a highly qualified healthcare
    //                 professional specializing in{" "}
    //                 {filteredDoctor.specialization.toLowerCase()}. With{" "}
    //                 {filteredDoctor.experience} years of experience and a{" "}
    //                 {filteredDoctor.degree} degree, they provide excellent care
    //                 at {filteredDoctor.hospital}.
    //               </p>

    //               <h3 className="font-semibold text-lg mt-4 mb-2">Services</h3>
    //               <ul className="list-disc pl-5 text-gray-700">
    //                 <li>Consultations</li>
    //                 <li>Diagnostic procedures</li>
    //                 <li>Treatment planning</li>
    //                 <li>Follow-up care</li>
    //               </ul>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Doctor Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold">{filteredDoctor.name}</h1>
                <p className="text-blue-100">{filteredDoctor.specialization}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FaStar className="text-yellow-300 mr-1" />
                <span className="font-semibold">{filteredDoctor.rating}</span>
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
                    src={filteredDoctor.image}
                    alt={filteredDoctor.name}
                    className="w-full h-auto rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">
                      {filteredDoctor.hospital}
                    </span>
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <FaRegClock className="text-blue-500 text-xl mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium">
                        {filteredDoctor.availability}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <FaHospital className="text-blue-500 text-xl mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Hospital</p>
                      <p className="font-medium">{filteredDoctor.hospital}</p>
                    </div>
                  </div>
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
                      {filteredDoctor.specialization}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <FaGraduationCap className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Degree</span>
                    </div>
                    <p className="font-semibold mt-1">
                      {filteredDoctor.degree}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <MdHealthAndSafety className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-500">Experience</span>
                    </div>
                    <p className="font-semibold mt-1">
                      {filteredDoctor.experience} years
                    </p>
                  </div>
                </div>

                {/* Consultation Types */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Consultation Types
                  </h3>
                  
                  {filteredDoctor.virtualConsultation && filteredDoctor.inPersonConsultation ? (
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
                      {filteredDoctor.virtualConsultation && (
                        <div className="flex items-center bg-green-50 p-3 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-green-800 font-medium">Virtual Consultation Available</span>
                        </div>
                      )}
                      {filteredDoctor.inPersonConsultation && (
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
                    About Dr. {filteredDoctor.name.split(" ")[2]}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {filteredDoctor.about}
                  </p>
                </div>

                {/* Services Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Services Offered
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDoctor.services.map((service, index) => (
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
                        {filteredDoctor.rating}/5
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
