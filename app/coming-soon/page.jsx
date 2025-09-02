"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const ComingSoon = () => {
  const [countdown, setCountdown] = useState({
    days: 20,
    hours: 22,
    minutes: 2,
    seconds: 52,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Coming Soon Heading */}
        <div className="mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-blue-500 mb-6">
            Coming Soon
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Just {countdown.days} days remaining until the big reveal of our new
            medical services platform!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-16">
          <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {countdown.days.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-500 font-medium">DAYS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {countdown.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-500 font-medium">HRS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {countdown.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-500 font-medium">MINS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {countdown.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-500 font-medium">SECS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
