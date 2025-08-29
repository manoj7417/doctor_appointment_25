'use client'
import { useState, useEffect } from "react";
import HeroSection from "@/components/shared/HeroSection";
import DoctorsSection from "@/components/shared/DoctorsSection";

export default function Home() {
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if this is a custom domain
    const hostname = window.location.hostname;
    const mainDomains = [
      'localhost',
      'localhost:3000',
      'localhost:3001',
      '127.0.0.1',
      '127.0.0.1:3000',
      'yourdomain.com',
      'www.yourdomain.com',
      // Add your main production domains here
    ];

    const isCustom = !mainDomains.includes(hostname);
    
    if (isCustom) {
      console.log('🎯 Custom domain detected:', hostname);
      setIsCustomDomain(true);
      setCustomDomain(hostname);
      
      // Redirect to the custom domain page
      window.location.href = `/doctor-domain/${hostname}`;
    } else {
      console.log('🏠 Main domain detected:', hostname);
      setIsCustomDomain(false);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If it's a custom domain, show a loading message while redirecting
  if (isCustomDomain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to doctor's page...</p>
        </div>
      </div>
    );
  }

  // Show the main landing page for main domains
  return (
    <div>
      <HeroSection />
      <DoctorsSection />
    </div>
  );
}
