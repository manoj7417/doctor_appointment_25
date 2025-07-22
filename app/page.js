'use client'
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/shared/HeroSection";
import Navbar from "@/components/shared/Navbar";
import DoctorHomePage from "./(doctor)/doctor-homepage/page";
import { useDoctorStore } from "@/store/doctorStore";

export default function Home() {
  // const { hasWebsite } = useDoctorStore();
  const hasWebsite = true

  return (
    <div>
      <Navbar />
      {
        hasWebsite === true ? <DoctorHomePage /> : <HeroSection />
      }
      <Footer />
    </div>
  );
}
