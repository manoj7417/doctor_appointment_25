"use client";

import { useState, useEffect } from "react";

export default function TestDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/debug/doctors");
      const data = await response.json();

      if (data.success) {
        setDoctors(data.doctors);
        console.log("All doctors:", data.doctors);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Doctor Database Test</h1>

      <div className="space-y-4">
        {doctors.map((doctor, index) => (
          <div key={doctor._id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">
              {index + 1}. {doctor.name}
            </h3>
            <p className="text-sm text-gray-600">Status: {doctor.status}</p>
            <p className="text-sm text-gray-600">
              Image: {doctor.image || "No image"}
            </p>
            <p className="text-sm text-gray-600">
              Specialization: {doctor.specialization || "Not set"}
            </p>
            <p className="text-sm text-gray-600">
              Experience: {doctor.experience || "Not set"} years
            </p>
            <p className="text-sm text-gray-600">
              Hospital: {doctor.hospital || "Not set"}
            </p>
            <p className="text-sm text-gray-600">
              Price: ₹{doctor.price || "Not set"}
            </p>

            {doctor.image && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div className="hidden w-20 h-20 bg-red-100 border border-red-300 rounded flex items-center justify-center text-xs text-red-600">
                  Failed to load
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No doctors found in database
        </div>
      )}
    </div>
  );
}
