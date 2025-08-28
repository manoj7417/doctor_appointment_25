"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Sample doctor data (in a real app, this would come from an API)
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
  },
  {
    id: 2,
    name: "Dr. Emma Watson",
    image: "/doc1.png",
    specialization: "Neurology",
    experience: 8,
    degree: "MBBS, DM",
    hospital: "City General Hospital",
    rating: 4.5,
    availability: "Tue, Thu, Sat",
    virtualConsultation: true,
    inPersonConsultation: false,
  },
  {
    id: 3,
    name: "Dr. Rebecca Williams",
    image: "/doc1.png",
    specialization: "Dermatology",
    experience: 15,
    degree: "MD, DNB",
    hospital: "Skin & Care Clinic",
    rating: 4.9,
    availability: "Mon to Fri",
    virtualConsultation: false,
    inPersonConsultation: true,
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    image: "/doc1.png",
    specialization: "Orthopedics",
    experience: 20,
    degree: "MBBS, MS",
    hospital: "Joint & Bone Institute",
    rating: 4.7,
    availability: "Wed to Sun",
    virtualConsultation: true,
    inPersonConsultation: true,
  },
  {
    id: 5,
    name: "Dr. Emily Rodriguez",
    image: "/doc1.png",
    specialization: "Pediatrics",
    experience: 6,
    degree: "MD, DCH",
    hospital: "Children's Hospital",
    rating: 4.6,
    availability: "Mon, Tue, Fri",
    virtualConsultation: true,
    inPersonConsultation: true,
  },
  {
    id: 6,
    name: "Dr. David Kim",
    image: "/doc1.png",
    specialization: "Cardiology",
    experience: 10,
    degree: "MBBS, DM",
    hospital: "Heart Institute",
    rating: 4.4,
    availability: "Thu, Fri, Sat",
    virtualConsultation: false,
    inPersonConsultation: true,
  },
];

// List of specializations for filter
const specializations = [
  ...new Set(doctorsData.map((doctor) => doctor.specialization)),
];
// List of degrees for filter
const degrees = [...new Set(doctorsData.map((doctor) => doctor.degree))];

export default function DoctorPage() {
  const [doctors, setDoctors] = useState(doctorsData);
  const [filters, setFilters] = useState({
    specialization: "",
    degree: "",
    minExperience: 0,
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const router = useRouter();

  // Apply filters
  useEffect(() => {
    let filteredDoctors = doctorsData;

    if (filters.specialization) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.specialization === filters.specialization
      );
    }

    if (filters.degree) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.degree === filters.degree
      );
    }

    if (filters.minExperience > 0) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.experience >= filters.minExperience
      );
    }

    setDoctors(filteredDoctors);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      specialization: "",
      degree: "",
      minExperience: 0,
    });
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    router.push(`/find-doctor/${doctor.id}`);
  };

  // Close doctor details modal
  const closeModal = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 my-20 max-w-7xl mx-auto">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Find Your Doctor</h1>
          <p className="mt-2">
            Select from our network of qualified healthcare professionals
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Doctors</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <select
                name="degree"
                value={filters.degree}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Degrees</option>
                {degrees.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Experience (Years)
              </label>
              <select
                name="minExperience"
                value={filters.minExperience}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="0">Any Experience</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
                <option value="20">20+ Years</option>
              </select>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="mt-4 bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Reset Filters
          </button>
        </div>

        {/* Doctors Listing */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Available Doctors ({doctors.length})
          </h2>

          {doctors.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
              No doctors match your selected filters. Please try different
              criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="p-4 flex items-start space-x-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "/doc1.png";
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-lg">{doctor.name}</h3>
                      <p className="text-blue-600">{doctor.specialization}</p>
                      <p className="text-sm text-gray-600">{doctor.degree}</p>
                      <div className="mt-2 flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{doctor.rating}</span>
                        <span className="mx-2">•</span>
                        <span>{doctor.experience} years exp.</span>
                      </div>
                      {/* Consultation Types */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {doctor.virtualConsultation && doctor.inPersonConsultation ? (
                          // Both consultation types available
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Both Available
                          </span>
                        ) : (
                          // Individual consultation types
                          <>
                            {doctor.virtualConsultation && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                Virtual
                              </span>
                            )}
                            {doctor.inPersonConsultation && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                In-Person
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-b-lg">
                    <p className="text-sm">{doctor.hospital}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Doctor Detail Modal */}
      {/* {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-full rounded-lg"
                  />
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Available on
                    </h3>
                    <p>{selectedDoctor.availability}</p>
                    <button className="mt-4 bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700">
                      Book Appointment
                    </button>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="font-medium">
                        {selectedDoctor.specialization}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">
                        {selectedDoctor.experience} years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Degree</p>
                      <p className="font-medium">{selectedDoctor.degree}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-medium flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        {selectedDoctor.rating}/5
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">About Doctor</h3>
                    <p className="text-gray-700">
                      {selectedDoctor.name} is a highly qualified healthcare
                      professional specializing in{" "}
                      {selectedDoctor.specialization.toLowerCase()}. With{" "}
                      {selectedDoctor.experience} years of experience and a{" "}
                      {selectedDoctor.degree} degree, they provide excellent
                      care at {selectedDoctor.hospital}.
                    </p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">
                      Services
                    </h3>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>Consultations</li>
                      <li>Diagnostic procedures</li>
                      <li>Treatment planning</li>
                      <li>Follow-up care</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
