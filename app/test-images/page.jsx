"use client";

import { useState, useEffect } from "react";

export default function TestImages() {
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
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testImage = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ success: true, url: imageUrl });
      img.onerror = () => resolve({ success: false, url: imageUrl });
      img.src = imageUrl;
    });
  };

  const [imageTests, setImageTests] = useState({});

  const runImageTests = async () => {
    const results = {};
    for (const doctor of doctors) {
      if (doctor.image) {
        const result = await testImage(doctor.image);
        results[doctor._id] = result;
      }
    }
    setImageTests(results);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>

      <button
        onClick={runImageTests}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Test All Images
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{doctor.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Image URL: {doctor.image || "No image"}
            </p>

            {doctor.image && (
              <div className="space-y-2">
                <div className="relative h-32 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    onLoad={() =>
                      console.log(`✅ Image loaded: ${doctor.image}`)
                    }
                    onError={() =>
                      console.log(`❌ Image failed: ${doctor.image}`)
                    }
                  />
                </div>

                {imageTests[doctor._id] && (
                  <div
                    className={`text-sm p-2 rounded ${
                      imageTests[doctor._id].success
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {imageTests[doctor._id].success
                      ? "✅ Image loads successfully"
                      : "❌ Image fails to load"}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
