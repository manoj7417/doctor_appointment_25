"use client"; // Next.js app router client component

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const router = useRouter();

  const [resendTimer, setResendTimer] = useState(60); // 60 sec countdown
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for Resend OTP button
  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }

    const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);

    return () => clearTimeout(timerId);
  }, [resendTimer]);

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setIsVerifying(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpValue }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Phone verified successfully!");
        router.push("/login");
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      setMessage("Server error, try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        toast.success("OTP resent successfully!");
        setResendTimer(60);
        setCanResend(false);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch {
      setMessage("Server error, try again later.");
    }
  };

  // Handle input changes and auto-focus next input
  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        // Optional: Clear the previous input
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .substr(0, 6)
      .replace(/\D/g, "");

    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtp[i] = pastedData.charAt(i);
    }

    setOtp(newOtp);

    // Focus last filled input or next empty input
    const lastIndex = Math.min(pastedData.length, 6) - 1;
    if (lastIndex >= 0) {
      const nextInput = document.getElementById(`otp-${lastIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <div className="text-center mb-6">
            <svg
              className="mx-auto h-16 w-16 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              Verify your phone
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the 6-digit verification code sent to
            </p>
            <p className="font-medium text-indigo-600">{phone}</p>
          </div>

          <div className="mt-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(index, e.target.value.replace(/\D/g, ""))
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={handleVerifyOtp}
                disabled={otp.some((digit) => !digit) || isVerifying}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              >
                {isVerifying ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium 
                  ${
                    canResend
                      ? "text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                      : "text-gray-400 border-gray-300 cursor-not-allowed"
                  } 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
              >
                {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
              </button>
            </div>

            {message && (
              <div className="mt-4 text-sm text-center text-red-600">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
