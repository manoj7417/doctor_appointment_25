"use client";
import { useState, useEffect } from "react";

export default function TestDomainPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testDomain, setTestDomain] = useState("www.shankarpolyclinic.com");
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/debug/doctors");
      const data = await response.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const testDomainLookup = async () => {
    if (!testDomain) return;

    try {
      setTestResult({ loading: true });
      const response = await fetch(
        `/api/doctor/by-domain?domain=${encodeURIComponent(testDomain)}`
      );
      const data = await response.json();
      setTestResult({
        success: response.ok,
        data: data,
        status: response.status,
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Domain Debug Tool
        </h1>

        {/* Domain Test Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Domain Lookup
          </h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={testDomain}
              onChange={(e) => setTestDomain(e.target.value)}
              placeholder="Enter domain to test (e.g., www.shankarpolyclinic.com)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={testDomainLookup}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test
            </button>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-lg ${
                testResult.loading
                  ? "bg-blue-50"
                  : testResult.success
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >
              {testResult.loading ? (
                <p className="text-blue-600">Testing domain...</p>
              ) : testResult.success ? (
                <div>
                  <p className="text-green-600 font-medium">✅ Domain found!</p>
                  <pre className="mt-2 text-sm bg-white p-3 rounded border overflow-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <p className="text-red-600 font-medium">
                    ❌ Domain not found
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: {testResult.status} -{" "}
                    {testResult.data?.message || testResult.error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Doctors List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Doctors in Database ({loading ? "Loading..." : doctors.length})
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <p className="text-gray-600">No doctors found in database.</p>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor, index) => (
                <div
                  key={doctor._id || index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600">{doctor.email}</p>
                      <p className="text-sm text-gray-500">
                        Status: {doctor.status}
                      </p>
                    </div>
                    <div className="text-right">
                      {doctor.hasWebsite ? (
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Has Website
                          </p>
                          <p className="text-xs text-gray-500">
                            Domain: {doctor.domain || "Not set"}
                          </p>
                          <p className="text-xs text-gray-500">
                            URL: {doctor.websiteUrl || "Not set"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No website</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Links
          </h2>
          <div className="space-y-2">
            <a
              href="/doctor-domain/www.shankarpolyclinic.com"
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              Test Doctor Domain Page
            </a>
            <a
              href="/"
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
