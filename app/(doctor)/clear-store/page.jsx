"use client";
import { useDoctorStore } from "@/store/doctorStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClearStore() {
  const { clearDoctorData } = useDoctorStore();
  const router = useRouter();

  useEffect(() => {
    // Force clear everything
    clearDoctorData();
    if (typeof window !== "undefined") {
      localStorage.removeItem("doctor-storage");
      sessionStorage.removeItem("doctor-storage");
      console.log("Store cleared manually");
    }
    
    // Redirect to login after a short delay
    setTimeout(() => {
      router.push("/doctor-login");
    }, 1000);
  }, [clearDoctorData, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Clearing Store...</h1>
        <p className="text-gray-600">Redirecting to login page...</p>
      </div>
    </div>
  );
} 