"use client";
import { useDoctorStore } from "@/store/doctorStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
  FaCogs,
} from "react-icons/fa";

export default function DoctorSidebar() {
  const { clearDoctorData } = useDoctorStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/doctor/logout");
    } catch (err) {
      console.error("Error clearing cookie:", err);
    }

    // Force clear both store and localStorage
    clearDoctorData();
    if (typeof window !== "undefined") {
      localStorage.removeItem("doctor-storage");
      sessionStorage.removeItem("doctor-storage");
    }
    router.push("/doctor-login");
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-full">
        <div className="flex items-center justify-center h-16 bg-blue-600">
          <span className="text-white font-bold text-xl">MediCare</span>
        </div>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-4 space-y-1">
            <Link
              href="/doctor-dashboard"
              className="flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
            >
              <FaHome className="mr-3 text-gray-500 group-hover:text-gray-500" />
              Dashboard
            </Link>
            <Link
              href="/doctor-dashboard/appointment"
              className="flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
            >
              <FaCalendarAlt className="mr-3 text-gray-500 group-hover:text-gray-500" />
              Appointments
            </Link>
            <Link
              href="/doctor-dashboard/patients"
              className="flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
            >
              <FaUserMd className="mr-3 text-gray-500 group-hover:text-gray-500" />
              Patients
            </Link>
            <Link
              href="/doctor-dashboard/analytics"
              className="flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
            >
              <FaChartLine className="mr-3 text-gray-500 group-hover:text-gray-500" />
              Analytics
            </Link>
            <Link
              href="/doctor-dashboard/settings"
              className="flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
            >
              <FaCog className="mr-3 text-gray-500 group-hover:text-gray-500" />
              Settings
            </Link>
            
            {/* Add Doctors Link */}
            <Link
              href="/doctor-dashboard/add-doctor"
              className="flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
            >
              <FaUserPlus className="mr-3 text-gray-500 group-hover:text-gray-500" />
              Add Doctors
            </Link>
            
            {/* Services Link */}
            <Link
              href="/doctor-dashboard/services"
              className="flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
            >
              <FaCogs className="mr-3 text-gray-500 group-hover:text-gray-500" />
              Services
            </Link>
          </div>
          <div className="px-4 py-4">
            <button
              className="flex items-center w-full px-2 py-3 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3 text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
