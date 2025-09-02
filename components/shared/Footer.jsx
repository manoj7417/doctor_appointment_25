"use client";

import { BriefcaseMedicalIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Logo Section - Centered */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BriefcaseMedicalIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Doctor<span className="text-blue-500">App</span>
            </span>
          </Link>
        </div>

        {/* Navigation Menu - Centered */}
        <div className="flex justify-center mb-12">
          <nav className="flex flex-wrap justify-center gap-8 text-gray-600">
            <Link
              href="/coming-soon"
              className="hover:text-blue-500 transition-colors font-medium"
            >
              Medicine
            </Link>

            <Link
              href="/coming-soon"
              className="hover:text-blue-500 transition-colors font-medium"
            >
              Labs
            </Link>
            <Link
              href="/coming-soon"
              className="hover:text-blue-500 transition-colors font-medium"
            >
              Prescription
            </Link>
          </nav>
        </div>

        {/* Copyright - Centered */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © 2025 DoctorApp, All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
