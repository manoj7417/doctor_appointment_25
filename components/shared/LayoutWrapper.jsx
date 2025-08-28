"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Check if current route is doctor dashboard
  const isDoctorDashboard = pathname.startsWith("/doctor-dashboard");

  return (
    <>
      {!isDoctorDashboard && <Navbar />}
      {children}
      {!isDoctorDashboard && <Footer />}
    </>
  );
}
