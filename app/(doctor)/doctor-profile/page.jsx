"use client";
import { useState } from "react";
import { useDoctorStore } from "@/store/doctorStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Available time slots with 15-minute intervals
const timeSlots = [
  "8:00 am",
  "8:15 am",
  "8:30 am",
  "8:45 am",
  "9:00 am",
  "9:15 am",
  "9:30 am",
  "9:45 am",
  "10:00 am",
  "10:15 am",
  "10:30 am",
  "10:45 am",
  "11:00 am",
  "11:15 am",
  "11:30 am",
  "11:45 am",
  "12:00 pm",
  "12:15 pm",
  "12:30 pm",
  "12:45 pm",
  "1:00 pm",
  "1:15 pm",
  "1:30 pm",
  "1:45 pm",
  "2:00 pm",
  "2:15 pm",
  "2:30 pm",
  "2:45 pm",
  "3:00 pm",
  "3:15 pm",
  "3:30 pm",
  "3:45 pm",
  "4:00 pm",
  "4:15 pm",
  "4:30 pm",
  "4:45 pm",
  "5:00 pm",
  "5:15 pm",
  "5:30 pm",
  "5:45 pm",
  "6:00 pm",
  "6:15 pm",
  "6:30 pm",
  "6:45 pm",
  "7:00 pm",
  "7:15 pm",
  "7:30 pm",
  "7:45 pm",
];

// Days of week for availability
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Specializations for dropdown
const specializations = [
  "General Physician",
  "Pediatrician",
  "Cardiologist",
  "Neurologist",
  "Psychiatrist",
  "Dermatologist",
  "Orthopedic Surgeon",
  "ENT Specialist",
  "Ophthalmologist",
  "Dentist",
  "Gynecologist / Obstetrician",
  "Oncologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Nephrologist",
  "Urologist",
  "Rheumatologist",
  "Allergist / Immunologist",
  "Hematologist",
  "Radiologist",
  "Anesthesiologist",
  "Plastic / Cosmetic Surgeon",
  "Psychologist",
  "Physiotherapist",
  "Dietitian / Nutritionist",
];

// Common medical services
const commonServices = [
  "General Consultation",
  "Health Check-up",
  "Vaccination",
  "Diagnostic Tests",
  "Minor Procedures",
  "Chronic Disease Management",
  "Emergency Care",
  "Telemedicine",
];

export default function DoctorProfileForm() {
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    degree: "",
    hospital: "",
    about: "",
    feesPerConsultation: "",
    services: [],
    availability: {},
    hasWebsite: "", // New field for website option
    websiteUrl: "", // Optional website URL
    virtualConsultation: false,
    inPersonConsultation: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const { setProfileInfo, setDoctorData } = useDoctorStore();
  const router = useRouter();

  // Initialize availability structure for each day
  useState(() => {
    const initialAvailability = {};
    daysOfWeek.forEach((day) => {
      initialAvailability[day] = {
        isAvailable: false,
        slots: [],
      };
    });
    setFormData((prev) => ({
      ...prev,
      availability: initialAvailability,
    }));
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear website URL if user selects "No" for website
    if (name === "hasWebsite" && value === "no") {
      setFormData((prev) => ({ ...prev, websiteUrl: "" }));
    }

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle checkbox changes for services
  const handleServiceChange = (service) => {
    setFormData((prev) => {
      if (prev.services.includes(service)) {
        return {
          ...prev,
          services: prev.services.filter((s) => s !== service),
        };
      } else {
        return {
          ...prev,
          services: [...prev.services, service],
        };
      }
    });
  };

  // Handle checkbox changes for availability days
  const handleDayChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          isAvailable: !prev.availability[day].isAvailable,
        },
      },
    }));
  };

  // Toggle a time slot for a specific day
  const toggleTimeSlot = (day, slot) => {
    setFormData((prev) => {
      const currentSlots = prev.availability[day].slots || [];
      const updatedSlots = currentSlots.includes(slot)
        ? currentSlots.filter((s) => s !== slot)
        : [...currentSlots, slot];

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...prev.availability[day],
            slots: updatedSlots,
          },
        },
      };
    });
  };

  function addMinutesToTime(timeStr, minutesToAdd) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    let newHours = date.getHours();
    const newMinutes = date.getMinutes().toString().padStart(2, "0");
    const newModifier = newHours >= 12 ? "pm" : "am";

    if (newHours === 0) newHours = 12;
    else if (newHours > 12) newHours -= 12;

    return `${newHours}:${newMinutes} ${newModifier}`;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.degree) newErrors.degree = "Degree is required";
    if (!formData.hospital) newErrors.hospital = "Hospital is required";
    if (!formData.about) newErrors.about = "About section is required";
    if (!formData.feesPerConsultation)
      newErrors.feesPerConsultation = "Fees are required";
    if (formData.services.length === 0)
      newErrors.services = "Please select at least one service";
    if (!formData.hasWebsite)
      newErrors.hasWebsite = "Please select whether you have a website";

    // Validate website URL if user selected "yes"
    if (formData.hasWebsite === "yes" && !formData.websiteUrl.trim()) {
      newErrors.websiteUrl = "Website URL is required when you have a website";
    }

    // Basic URL validation if website URL is provided
    if (formData.websiteUrl.trim()) {
      const urlPattern = /^https?:\/\/.+\..+/;
      if (!urlPattern.test(formData.websiteUrl.trim())) {
        newErrors.websiteUrl =
          "Please enter a valid website URL (e.g., https://example.com)";
      }
    }

    // Check if at least one day is available
    const hasAvailableDays = Object.values(formData.availability).some(
      (day) => day.isAvailable
    );
    if (!hasAvailableDays) {
      newErrors.availability = "Please select at least one day";
    }

    // If on step 2, check if each available day has at least one time slot
    if (formStep === 2) {
      let noSlotsError = false;

      Object.entries(formData.availability).forEach(([day, dayData]) => {
        if (
          dayData.isAvailable &&
          (!dayData.slots || dayData.slots.length === 0)
        ) {
          noSlotsError = true;
        }
      });

      if (noSlotsError) {
        newErrors.timeSlots =
          "Please select at least one time slot for each available day";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setFormStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Format data for backend
      const availableDays = [];
      const formattedSlots = {};

      // Process availability data
      Object.entries(formData.availability).forEach(([day, dayData]) => {
        if (dayData.isAvailable) {
          availableDays.push(day);

          // Format slots for this day
          if (dayData.slots && dayData.slots.length > 0) {
            formattedSlots[day] = dayData.slots;
          }
        }
      });

      // Format data according to backend schema
      const finalData = {
        specialization: formData.specialization,
        experience: formData.experience,
        degree: formData.degree,
        hospital: formData.hospital,
        about: formData.about,
        price: formData.feesPerConsultation,
        services: formData.services,
        availability: availableDays,
        slots: formattedSlots,
        hasWebsite: formData.hasWebsite === "yes",
        websiteUrl: formData.hasWebsite === "yes" ? formData.websiteUrl : null,
        virtualConsultation: formData.virtualConsultation,
        inPersonConsultation: formData.inPersonConsultation,
      };

      console.log("Sending data to backend:", finalData);

      const res = await fetch("/api/doctor/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const result = await res.json();
      console.log("Backend response:", result);

      setProfileInfo(result.doctor);
      setDoctorData(result.doctor);

      if (res.ok) {
        // Show success message
        toast.success("Profile updated successfully!");
        router.push("/doctor-dashboard");
      } else {
        // Show error message
        toast.error(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("An error occurred while updating the profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to count total selected slots
  const countSelectedSlots = () => {
    let count = 0;
    Object.values(formData.availability).forEach((day) => {
      if (day.isAvailable && day.slots) {
        count += day.slots.length;
      }
    });
    return count;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-10">
      {/* Form header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-3xl font-bold text-white">
          Complete Your Doctor Profile
        </h2>
        <p className="text-blue-100 mt-2">
          Set up your availability and professional details
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-600">
            Basic Information
          </div>
          <div className="text-sm font-medium text-gray-600">
            Availability Settings
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: formStep === 1 ? "50%" : "100%" }}
          ></div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {formStep === 1 ? (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Professional Details
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="specialization"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Specialization
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.specialization}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="degree"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Degree
                </label>
                <input
                  id="degree"
                  name="degree"
                  type="text"
                  placeholder="e.g. MD, MBBS, PhD"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-600">{errors.degree}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="hospital"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hospital/Clinic
                </label>
                <input
                  id="hospital"
                  name="hospital"
                  type="text"
                  placeholder="Where you practice"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.hospital && (
                  <p className="mt-1 text-sm text-red-600">{errors.hospital}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Years of Experience
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  placeholder="e.g. 5"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="feesPerConsultation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Consultation Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₹
                  </span>
                  <input
                    id="feesPerConsultation"
                    name="feesPerConsultation"
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={formData.feesPerConsultation}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-8 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                {errors.feesPerConsultation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.feesPerConsultation}
                  </p>
                )}
              </div>

              {/* Website Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you have a website?
                </label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="website-yes"
                      name="hasWebsite"
                      type="radio"
                      value="yes"
                      checked={formData.hasWebsite === "yes"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="website-yes"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="website-no"
                      name="hasWebsite"
                      type="radio"
                      value="no"
                      checked={formData.hasWebsite === "no"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="website-no"
                      className="ml-2 text-sm text-gray-700"
                    >
                      No
                    </label>
                  </div>
                </div>
                {errors.hasWebsite && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.hasWebsite}
                  </p>
                )}
              </div>

              {/* Website URL field - only show if user selected "Yes" */}
              {formData.hasWebsite === "yes" && (
                <div>
                  <label
                    htmlFor="websiteUrl"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Website URL
                  </label>
                  <input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="url"
                    placeholder="https://your-website.com"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {errors.websiteUrl && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.websiteUrl}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Days
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        id={`day-${day}`}
                        type="checkbox"
                        checked={
                          formData.availability[day]?.isAvailable || false
                        }
                        onChange={() => handleDayChange(day)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`day-${day}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.availability}
                  </p>
                )}
              </div>

              {/* Consultation Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Consultation Types
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      id="virtual-consultation"
                      type="checkbox"
                      checked={formData.virtualConsultation}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          virtualConsultation: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="virtual-consultation"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Virtual Consultation (Video/Phone)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="in-person-consultation"
                      type="checkbox"
                      checked={formData.inPersonConsultation}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          inPersonConsultation: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="in-person-consultation"
                      className="ml-2 text-sm text-gray-700"
                    >
                      In-Person Consultation
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Services Offered
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {commonServices.map((service) => (
                    <div key={service} className="flex items-center">
                      <input
                        id={`service-${service}`}
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceChange(service)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`service-${service}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.services && (
                  <p className="mt-1 text-sm text-red-600">{errors.services}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  About You
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows="4"
                  placeholder="Tell patients about your experience, approach, etc."
                  value={formData.about}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                ></textarea>
                {errors.about && (
                  <p className="mt-1 text-sm text-red-600">{errors.about}</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium shadow-sm flex items-center justify-center"
              >
                Continue to Time Slots
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Time Slots for Available Days
            </h3>

            <div className="space-y-8">
              {daysOfWeek.map(
                (day) =>
                  formData.availability[day]?.isAvailable && (
                    <div
                      key={day}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <h4 className="text-lg font-medium text-gray-700 mb-3">
                        {day}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={`${day}-${slot}`}
                            type="button"
                            onClick={() => toggleTimeSlot(day, slot)}
                            className={`p-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                              formData.availability[day]?.slots?.includes(slot)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {slot}
                            {formData.availability[day]?.slots?.includes(
                              slot
                            ) && (
                              <svg
                                className="ml-1 h-4 w-4"
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
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
              )}

              {/* Summary of selections */}
              {countSelectedSlots() > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Summary:</span> You have
                    selected {countSelectedSlots()} time slots across{" "}
                    {
                      Object.values(formData.availability).filter(
                        (day) => day.isAvailable
                      ).length
                    }{" "}
                    days.
                  </p>
                </div>
              )}

              {errors.timeSlots && (
                <p className="mt-2 text-sm text-red-600">{errors.timeSlots}</p>
              )}
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors font-medium shadow-sm flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium shadow-sm flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Saving...
                  </>
                ) : (
                  <>
                    Save Profile
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
