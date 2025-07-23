"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  XCircle,
  Send,
  CreditCard,
  ChevronRight,
  Phone,
  Lock,
  Check,
  Calendar,
  Clock,
  Star,
  User,
} from "lucide-react";
import Script from "next/script";
import { useDoctorStore } from "@/store/doctorStore";
import { useUserStore } from "@/store/userStore";
import useBookingStore from "@/store/bookingStore";
import { handleBooking } from "@/lib/bookingUtils";

export default function BookingChatBot({ doctorId }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("greet");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const { user, clearUser } = useUserStore();
  const { setBookingDetails } = useBookingStore();
  // const doctor = useDoctorStore((state) => state);
  // const {
  //   _id,
  //   name,
  //   image,
  //   specialization,
  //   experience,
  //   price,
  //   availability,
  //   hospital,
  //   degree,
  //   about,
  //   status,
  //   slots,
  //   services,
  // } = doctor;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        if (doctorId) {
          // If doctorId is provided, fetch specific doctor
          const res = await fetch(`/api/doctors/${doctorId}`);
          const data = await res.json();

          if (data.success) {
            setDoctors([data.doctor]);
            setSelectedDoctor(data.doctor);
          } else {
            setError(data.message || "Failed to load doctor");
          }
        } else {
          // Otherwise fetch all doctors
          const res = await fetch("/api/doctor/getAll");
          const data = await res.json();

          if (data.success) {
            setDoctors(data.doctors);
          } else {
            setError(data.message || "Failed to load doctors");
          }
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, [doctorId]);

  useEffect(() => {
    setAnimateIn(open);
  }, [open]);

  // Only show the first doctor (Dr. Sarah Johnson)
  // const doctors = [
  //   {
  //     id: 1,
  //     name: name || "Dr. Sarah Johnson",
  //     image: image || "/doc1.png",
  //     specialization: specialization || "Cardiology",
  //     experience: experience || 12,
  //     degree: degree || "MD, FRCS",
  //     hospital: hospital || "Central Medical Center",
  //     rating: 4.8,
  //     availability: availability || "Mon, Wed, Fri",
  //     // slots: slots || ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
  //     slots:
  //       typeof slots === "object" && slots !== null
  //         ? slots
  //         : {
  //             Monday: ["9:00 AM"],
  //             Tuesday: ["11:30 AM"],
  //             Wednesday: ["2:00 PM"],
  //             Thursday: ["4:30 PM"],
  //             Friday: [],
  //             Saturday: [],
  //             Sunday: [],
  //           },

  //     price: price || 150,
  //     about:
  //       about ||
  //       "Dr. Johnson is a board-certified cardiologist with extensive experience in interventional procedures. She has published numerous papers on cardiovascular health and is known for her patient-centered approach.",
  //     services: services || [
  //       "Cardiac consultation",
  //       "Echocardiography",
  //       "Stress testing",
  //       "Angioplasty",
  //     ],
  //   },
  // ];

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/chatbot/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: { "Content-Type": "application/json" },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStep("verifyOtp");
        if (result.demoMode) {
          toast.success("OTP sent successfully! (Demo Mode - Check console for code)");
          console.log('DEMO MODE: Your OTP code is:', result.otpCode);
          setMessage("Demo Mode: Check browser console for OTP code. Any 6-digit code will work for verification.");
        } else {
          toast.success("OTP sent successfully!");
          setMessage("Please check your phone for the OTP.");
        }
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/chatbot/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, code: otp }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setIsVerified(true);
        toast.success("Phone verified successfully!");
        setMessage("Phone verified!");
        setStep("patientName");
      } else {
        setMessage(data.message || "Invalid OTP");
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientNameSubmit = () => {
    if (!patientName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (patientName.trim().length < 2) {
      toast.error("Please enter a valid name (at least 2 characters)");
      return;
    }

    setStep("showDoctors");
    toast.success(`Welcome, ${patientName}!`);
  };

  const selectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDetails(true);
  };

  const bookAppointment = (doctor, slot) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(slot);
    setStep("payment");
  };

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chatbot/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedDoctor.price * 100, // Razorpay expects amount in smallest currency unit (paise)
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      setRazorpayOrder(data);
      return data;
    } catch (error) {
      toast.error(error.message || "Failed to create payment order");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    try {
      // Create order first
      const orderData = await createRazorpayOrder();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID from environment variable
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Medical Services",
        description: `Appointment with ${selectedDoctor.name}`,
        order_id: orderData.id,
        prefill: {
          name: "Patient",
          contact: phone,
        },
        handler: function (response) {
          // Handle successful payment
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment canceled. You can try again.");
          },
        },
        theme: {
          color: "#3B82F6", // Blue to match your UI
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Payment initialization failed. Please try again.");
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentResponse) => {
    setIsLoading(true);
    try {
      // Verify payment with your backend
      const response = await fetch("/api/chatbot/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment verification failed");
      }

      // Save booking details
      await saveBookingDetails(paymentResponse.razorpay_payment_id);

      // Show confirmation
      setStep("confirmation");
      toast.success("Payment successful!");
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Payment verification failed. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save booking details using the enhanced handleBooking function
  const saveBookingDetails = async (paymentId) => {
    try {
      const appointmentDate = new Date();
      const { addBooking } = useBookingStore.getState();

      // Debug logging
      console.log("Selected Doctor:", selectedDoctor);
      console.log("Doctor ID:", selectedDoctor?._id);
      console.log("Patient Name:", patientName);
      console.log("Patient Phone:", phone);

      // Validate required data
      if (!selectedDoctor?._id) {
        console.error("Doctor data:", selectedDoctor);
        throw new Error("Doctor ID is missing. Please try selecting the doctor again.");
      }

      if (!patientName) {
        throw new Error("Patient name is required");
      }

      if (!phone) {
        throw new Error("Patient phone is required");
      }

      if (!selectedSlot) {
        throw new Error("Appointment slot is required");
      }

      const bookingData = {
        patientName,
        patientPhone: phone,
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        specialization: selectedDoctor.specialization,
        appointmentDate,
        slot: selectedSlot,
        price: selectedDoctor.price,
        paymentMethod: "razorpay",
        paymentStatus: "completed",
        paymentDetails: {
          paymentId,
          orderId: razorpayOrder?.id,
        },
        notes: `Payment ID: ${paymentId}`,
      };

      console.log("Booking Data:", bookingData);

      // Use the enhanced handleBooking function
      const booking = await handleBooking(
        bookingData,
        user, // Pass user if authenticated
        (booking) => {
          // Success callback
          const bookingToStore = {
            id: booking._id || paymentId,
            patientName: booking.patientName,
            patientPhone: booking.patientPhone,
            doctorName: booking.doctorName,
            appointmentDate: booking.appointmentDate,
            slot: booking.slot,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            paymentId,
            checked: false,
            bookingType: booking.bookingType,
          };

          addBooking(bookingToStore);
          console.log('Booking saved successfully:', booking);
          
          // Show success message with SMS confirmation
          toast.success(`Booking confirmed! SMS sent to ${phone}. Check your phone for appointment details.`);
          
          // Reset form and close chatbot
          setTimeout(() => {
            setOpen(false);
            setStep("greet");
            setPatientName("");
            setPhone("");
            setOtp("");
            setIsVerified(false);
            setSelectedDoctor(null);
            setSelectedSlot(null);
            setRazorpayOrder(null);
          }, 3000);
        },
        (error) => {
          // Error callback
          console.error('Booking failed:', error);
          const { addBooking } = useBookingStore.getState();

          addBooking({
            id: paymentId,
            patientName,
            patientPhone: phone,
            doctorName: selectedDoctor.name,
            appointmentDate: new Date(),
            slot: selectedSlot,
            status: "pending",
            paymentStatus: "completed",
            paymentId,
            checked: false,
            error: "Failed to save to server",
          });

          toast.warning(
            "Payment was successful but booking details couldn't be saved. Our team will contact you."
          );
        }
      );

      return booking;
    } catch (error) {
      console.error("Booking error:", error);
      throw error;
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }
        />
      ));
  };

  const [showDoctorDetails, setShowDoctorDetails] = useState(false);

  console.log("Selected Doctor:", selectedDoctor);

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="fixed bottom-6 right-6 z-50">
        {/* Toggle button */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </button>
        )}

        {/* Chat window */}
        {open && (
          <div
            className={`w-96 max-h-[600px] bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 ${
              animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Medical Assistant</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-red-200 transition"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <p className="text-sm text-blue-100 mt-1">
                Book appointments with top doctors
              </p>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 max-h-[470px]">
              {step === "greet" && (
                <div className="animate-fadeIn">
                  <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                    <p>
                      Hello! 👋 I'm your medical booking assistant. How can I
                      help you today?
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setStep("signup")}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                    >
                      <span>Book an Appointment</span>
                      <ChevronRight size={18} />
                    </button>
                    <button
                      onClick={() => setStep("signup")}
                      className="w-full bg-white text-blue-600 border border-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center space-x-2"
                    >
                      <Phone size={18} />
                      <span>Sign Up</span>
                    </button>
                  </div>
                </div>
              )}

              {step === "signup" && (
                <div className="animate-fadeIn">
                  <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                    <p>
                      To book an appointment, first let's verify your phone
                      number.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute top-3 left-3 text-gray-500"
                      />
                      <input
                        placeholder="Enter your 10-digit phone number"
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        className="border rounded-lg p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Send OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === "verifyOtp" && (
                <div className="animate-fadeIn">
                  <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                    <p>
                      {message || "Please enter the OTP sent to your phone."}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute top-3 left-3 text-gray-500"
                      />
                      <input
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className="border rounded-lg p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Verify OTP</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="w-full text-blue-600 text-sm hover:underline flex items-center justify-center"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}

              {step === "patientName" && isVerified && (
                <div className="animate-fadeIn">
                  <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                    <p>
                      Great! Your phone is verified. Now, please tell us your
                      name.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute top-3 left-3 text-gray-500"
                      />
                      <input
                        placeholder="Enter your full name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="border rounded-lg p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handlePatientNameSubmit();
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={handlePatientNameSubmit}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                    >
                      <span>Continue</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {step === "showDoctors" && isVerified && !showDoctorDetails && (
                <div className="animate-fadeIn">
                  <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                    <p>Available specialist for your appointment:</p>
                  </div>

                  <div className="space-y-4">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                        onClick={() => selectDoctor(doc)}
                      >
                        <div className="flex p-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                            <img
                              src={doc.image}
                              alt={doc.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-700">
                              {doc.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {doc.specialization} • {doc.experience} yrs exp
                            </p>
                            <div className="flex items-center mt-1 mb-1">
                              <div className="flex">
                                {renderStars(doc.rating)}
                              </div>
                              <span className="text-sm text-gray-600 ml-1">
                                {doc.rating}
                              </span>
                            </div>
                            <p className="text-sm text-green-600 font-medium">
                              ${doc.price} per consultation
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === "showDoctors" &&
                showDoctorDetails &&
                selectedDoctor && (
                  <div className="animate-fadeIn">
                    <button
                      onClick={() => setShowDoctorDetails(false)}
                      className="text-blue-600 mb-3 flex items-center text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to doctors
                    </button>

                    <div className="border rounded-lg overflow-hidden shadow-sm mb-4">
                      <div className="p-4">
                        <div className="flex items-start">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                            <img
                              src={selectedDoctor.image}
                              alt={selectedDoctor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-700">
                              {selectedDoctor.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {selectedDoctor.specialization} •{" "}
                              {selectedDoctor.degree}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedDoctor.hospital}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {renderStars(selectedDoctor.rating)}
                              </div>
                              <span className="text-sm text-gray-600 ml-1">
                                {selectedDoctor.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium text-gray-800">About</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedDoctor.about}
                          </p>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium text-gray-800">
                            Services
                          </h4>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {selectedDoctor.services.map((service, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium text-gray-800">Price</h4>
                          <p className="text-lg text-green-600 font-semibold mt-1">
                            ${selectedDoctor.price} per session
                          </p>
                        </div>

                        {/* Consultation Types */}
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-800">Consultation Types</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedDoctor.virtualConsultation && selectedDoctor.inPersonConsultation ? (
                              // Both consultation types available
                              <span key="both-available" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Both Available
                              </span>
                            ) : (
                              // Individual consultation types
                              <>
                                {selectedDoctor.virtualConsultation && (
                                  <span key="virtual-consultation" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Virtual
                                  </span>
                                )}
                                {selectedDoctor.inPersonConsultation && (
                                  <span key="in-person-consultation" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    In-Person
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t px-4 py-3">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Calendar size={16} className="mr-1" />
                          Available Slots
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {/* {selectedDoctor.slots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() =>
                                bookAppointment(selectedDoctor, slot)
                              }
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center"
                            >
                              <Clock size={14} className="mr-1" />
                              {slot}
                            </button>
                          ))} */}
                          {Object.entries(selectedDoctor.slots).map(
                            ([day, times]) => (
                              <div key={day} className="mb-4">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                  {day}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {times.map((slot) => (
                                    <button
                                      key={`${day}-${slot}`}
                                      onClick={() =>
                                        bookAppointment(
                                          selectedDoctor,
                                          slot,
                                          day
                                        )
                                      }
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center"
                                    >
                                      <Clock size={14} className="mr-1" />
                                      {slot}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {step === "payment" && selectedDoctor && selectedSlot && (
                <div className="animate-fadeIn">
                  <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                    <p>
                      Complete payment to confirm your appointment with{" "}
                      <strong>{selectedDoctor.name}</strong> at{" "}
                      <strong>{selectedSlot}</strong>.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Appointment Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">
                          {selectedDoctor.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Specialization:</span>
                        <span>{selectedDoctor.specialization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span>
                          {new Date().toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at {selectedSlot}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium text-base pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-green-600">
                          ${selectedDoctor.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <img
                        src="/razorpay-logo.png"
                        alt="Razorpay"
                        className="h-8 mr-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                      <h3 className="font-medium text-gray-800">
                        Secure Payment with Razorpay
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600">
                      You'll be redirected to Razorpay's secure payment gateway
                      to complete your transaction.
                    </p>

                    <button
                      onClick={handleRazorpayPayment}
                      disabled={isLoading}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 mt-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Pay ${selectedDoctor.price} Securely</span>
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === "confirmation" && (
                <div className="animate-fadeIn text-center py-8">
                  <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-600 mb-1">
                    Your appointment with{" "}
                    <span className="font-medium">{selectedDoctor.name}</span>{" "}
                    has been scheduled for:
                  </p>
                  <p className="text-blue-600 font-medium mb-3">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {selectedSlot}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    A confirmation has been sent to your phone.
                  </p>
                  <button
                    onClick={() => setStep("greet")}
                    className="text-blue-600 hover:underline"
                  >
                    Return to home
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
