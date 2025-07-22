"use client";

import { FaBell, FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useClientDoctorStore } from "@/lib/hooks/useClientStore";
import { useEffect } from "react";

export default function DoctorNavbar() {
  const { name, specialization, email, image, setDoctorData, isClient } = useClientDoctorStore();

  // Debug: Log current doctor data
  useEffect(() => {
    if (isClient) {
      console.log("Current doctor in navbar:", { name, specialization, email });
    }
  }, [name, specialization, email, isClient]);

  // Fetch doctor data if not available in store
  useEffect(() => {
    if (!isClient) return;

    const fetchDoctorData = async () => {
      try {
        const response = await fetch('/api/doctor/current', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.doctor) {
            setDoctorData(result.doctor);
            console.log("Updated doctor data in navbar:", result.doctor);
          }
        }
      } catch (error) {
        console.error("Error fetching doctor data in navbar:", error);
      }
    };

    // Only fetch if we don't have complete doctor data
    if (!name || !email) {
      fetchDoctorData();
    }
  }, [setDoctorData, name, email, isClient]);

  return (
    <div className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button className="md:hidden text-gray-500 focus:outline-none">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <FaBell className="h-5 w-5" />
          </button>

          {/* Profile Info */}
          <div className="flex items-center">
            {isClient && image ? (
              <img 
                src={image} 
                alt="Profile" 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="h-8 w-8 text-gray-500" />
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {isClient && name ? name : "Doctor Name"}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {isClient && specialization ? specialization : "Specialist"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
