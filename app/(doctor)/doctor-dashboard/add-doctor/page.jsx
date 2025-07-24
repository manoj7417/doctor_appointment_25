"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Upload,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Building2,
  Clock,
  Star,
  Edit,
  Plus,
  UserCheck,
} from "lucide-react";
import { upload } from "@imagekit/next";
import { useClientDoctorStore } from "@/lib/hooks/useClientStore";

// Available time slots
const timeSlots = [
  "8:00 am", "8:30 am", "9:00 am", "9:30 am", "10:00 am", "10:30 am",
  "11:00 am", "11:30 am", "12:00 pm", "12:30 pm", "2:00 pm", "2:30 pm",
  "3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm",
];

// Days of week for availability
const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

// Specializations for dropdown
const specializations = [
  "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics",
  "Psychiatry", "Radiology", "Surgery",
];

// Common medical services
const commonServices = [
  "General Consultation", "Health Check-up", "Vaccination", "Diagnostic Tests",
  "Minor Procedures", "Chronic Disease Management", "Emergency Care", "Telemedicine",
];

export default function AddDoctor() {
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    degree: "",
    hospital: "",
    about: "",
    feesPerConsultation: "",
    services: [],
    availability: {},
    hasWebsite: "",
    websiteUrl: "",
    virtualConsultation: false,
    inPersonConsultation: false,
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isNewDoctor, setIsNewDoctor] = useState(false);
  const [isExistingDoctor, setIsExistingDoctor] = useState(false);
  const { doctorData: currentDoctor } = useClientDoctorStore();

  // Image upload states
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors: formErrors, isSubmitting: formIsSubmitting },
  } = useForm();

  // Initialize availability structure for each day
  useEffect(() => {
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

  /**
   * Authenticates with the server to get ImageKit upload credentials
   */
  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        throw new Error("Failed to get upload credentials");
      }
      return await response.json();
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Automatically upload the image
      setUploading(true);
      try {
        const authParams = await authenticator();
        
        const result = await upload({
          file,
          fileName: `doctor-${Date.now()}-${file.name}`,
          ...authParams,
        });

        setImageUrl(result.url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Image upload failed. Please try again.");
        setPreviewImage(null);
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle input changes for formData
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
    setFormData((prev) => {
      // Ensure availability structure exists
      const currentAvailability = prev.availability || {};
      
      // Ensure the day structure exists
      const currentDay = currentAvailability[day] || { isAvailable: false, slots: [] };
      
      return {
        ...prev,
        availability: {
          ...currentAvailability,
          [day]: {
            ...currentDay,
            isAvailable: !currentDay.isAvailable,
          },
        },
      };
    });
  };

  // Toggle a time slot for a specific day
  const toggleTimeSlot = (day, slot) => {
    setFormData((prev) => {
      // Ensure availability structure exists
      const currentAvailability = prev.availability || {};
      
      // Ensure the day structure exists
      const currentDay = currentAvailability[day] || { isAvailable: false, slots: [] };
      
      const currentSlots = currentDay.slots || [];
      const updatedSlots = currentSlots.includes(slot)
        ? currentSlots.filter((s) => s !== slot)
        : [...currentSlots, slot];

      return {
        ...prev,
        availability: {
          ...currentAvailability,
          [day]: {
            ...currentDay,
            slots: updatedSlots,
          },
        },
      };
    });
  };

  const validateStep1 = () => {
    const newErrors = {};
    const basicData = watch();

    if (!basicData.name) newErrors.name = "Name is required";
    if (!basicData.email) newErrors.email = "Email is required";
    if (!basicData.phone) newErrors.phone = "Phone is required";
    if (!basicData.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    console.log("Validating Step 2 - formData:", formData);

    if (!formData.specialization) {
      newErrors.specialization = "Specialization is required";
      console.log("Specialization validation failed:", formData.specialization);
    }
    if (!formData.experience) {
      newErrors.experience = "Experience is required";
      console.log("Experience validation failed:", formData.experience);
    }
    if (!formData.degree) {
      newErrors.degree = "Degree is required";
      console.log("Degree validation failed:", formData.degree);
    }
    if (!formData.hospital) {
      newErrors.hospital = "Hospital is required";
      console.log("Hospital validation failed:", formData.hospital);
    }
    if (!formData.about) {
      newErrors.about = "About section is required";
      console.log("About validation failed:", formData.about);
    }
    if (!formData.feesPerConsultation) {
      newErrors.feesPerConsultation = "Fees are required";
      console.log("Fees validation failed:", formData.feesPerConsultation);
    }
    if (formData.services.length === 0) {
      newErrors.services = "Please select at least one service";
      console.log("Services validation failed:", formData.services);
    }
    if (!formData.hasWebsite) {
      newErrors.hasWebsite = "Please select whether you have a website";
      console.log("HasWebsite validation failed:", formData.hasWebsite);
    }

    // Validate website URL if user selected "yes"
    if (formData.hasWebsite === "yes" && !formData.websiteUrl.trim()) {
      newErrors.websiteUrl = "Website URL is required when you have a website";
      console.log("Website URL validation failed:", formData.websiteUrl);
    }

    // Basic URL validation if website URL is provided
    if (formData.websiteUrl.trim()) {
      const urlPattern = /^https?:\/\/.+\..+/;
      if (!urlPattern.test(formData.websiteUrl.trim())) {
        newErrors.websiteUrl =
          "Please enter a valid website URL (e.g., https://example.com)";
        console.log("Website URL format validation failed:", formData.websiteUrl);
      }
    }

    // Check if at least one day is available
    if (formData.availability) {
      const hasAvailableDays = Object.values(formData.availability).some(
        (day) => day && day.isAvailable
      );
      if (!hasAvailableDays) {
        newErrors.availability = "Please select at least one day";
        console.log("Availability validation failed - no available days");
      }

      // Check if each available day has at least one time slot
      let noSlotsError = false;
      Object.entries(formData.availability).forEach(([day, dayData]) => {
        if (
          dayData && dayData.isAvailable &&
          (!dayData.slots || dayData.slots.length === 0)
        ) {
          noSlotsError = true;
          console.log("Time slots validation failed for day:", day);
        }
      });

      if (noSlotsError) {
        newErrors.timeSlots =
          "Please select at least one time slot for each available day";
      }
    } else {
      newErrors.availability = "Please select at least one day";
      console.log("Availability validation failed - no availability object");
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (formStep === 1) {
      if (validateStep1()) {
        setFormStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = () => {
    setFormStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExistingDoctor = async () => {
    console.log("Scenario: Existing Doctor - checking store and fetching data");
    
    // First check if we have doctor data in the store
    console.log("Doctor data from store:", currentDoctor);
    
    // Check if we have basic info in the store
    const hasStoreData = currentDoctor && currentDoctor.name && currentDoctor.email;
    
    if (hasStoreData) {
      console.log("Found doctor data in store, pre-filling from store");
      
      // Pre-fill basic information from store
      setValue('name', currentDoctor.name || '');
      setValue('email', currentDoctor.email || '');
      setValue('phone', currentDoctor.phone || '');
      setValue('address', currentDoctor.address || '');
      
      // Initialize availability structure properly
      const initialAvailability = {};
      daysOfWeek.forEach((day) => {
        initialAvailability[day] = {
          isAvailable: false,
          slots: [],
        };
      });
      
      // Pre-fill professional information if available
      setFormData(prev => ({
        ...prev,
        specialization: currentDoctor.specialization || "",
        experience: currentDoctor.experience || "",
        degree: currentDoctor.degree || "",
        hospital: currentDoctor.hospital || "",
        about: currentDoctor.about || "",
        feesPerConsultation: currentDoctor.price || "",
        services: currentDoctor.services || [],
        hasWebsite: currentDoctor.hasWebsite ? "yes" : "no",
        websiteUrl: currentDoctor.websiteUrl || "",
        virtualConsultation: currentDoctor.virtualConsultation || false,
        inPersonConsultation: currentDoctor.inPersonConsultation || false,
        availability: currentDoctor.availability || initialAvailability,
      }));

      setShowForm(true);
      setIsNewDoctor(false);
      setIsExistingDoctor(true);
      setFormStep(1); // Start from step 1 but with pre-filled data
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    // If no store data, try to fetch from API
    console.log("No store data found, fetching from API");
    try {
      const response = await fetch('/api/doctor/dashboard', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Existing doctor data from API:", result);
        
        if (result.doctor && result.doctor.name && result.doctor.email) {
          // Check if doctor has basic information
          const hasBasicInfo = result.doctor.name && result.doctor.email && result.doctor.phone;
          
          if (hasBasicInfo) {
            // Pre-fill basic information
            setValue('name', result.doctor.name || '');
            setValue('email', result.doctor.email || '');
            setValue('phone', result.doctor.phone || '');
            setValue('address', result.doctor.address || '');
            
            // Initialize availability structure properly
            const initialAvailability = {};
            daysOfWeek.forEach((day) => {
              initialAvailability[day] = {
                isAvailable: false,
                slots: [],
              };
            });
            
            // Pre-fill professional information if available
            setFormData(prev => ({
              ...prev,
              specialization: result.doctor.specialization || "",
              experience: result.doctor.experience || "",
              degree: result.doctor.degree || "",
              hospital: result.doctor.hospital || "",
              about: result.doctor.about || "",
              feesPerConsultation: result.doctor.price || "",
              services: result.doctor.services || [],
              hasWebsite: result.doctor.hasWebsite ? "yes" : "no",
              websiteUrl: result.doctor.websiteUrl || "",
              virtualConsultation: result.doctor.virtualConsultation || false,
              inPersonConsultation: result.doctor.inPersonConsultation || false,
              availability: result.doctor.availability || initialAvailability,
            }));

            setShowForm(true);
            setIsNewDoctor(false);
            setIsExistingDoctor(true);
            setFormStep(1); // Start from step 1 but with pre-filled data
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            // Doctor exists but doesn't have basic info
            toast.error("No basic information found. Please use 'New Doctor' option instead.");
          }
        } else {
          // No doctor data found
          toast.error("No existing doctor profile found. Please use 'New Doctor' option to create a new profile.");
        }
      } else {
        toast.error("Failed to fetch existing doctor data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching existing doctor data:", error);
      toast.error("Failed to load existing doctor data. Please try again.");
    }
  };

  const handleNewDoctor = () => {
    console.log("Scenario: New Doctor - starting with empty form");
    
    // Initialize availability structure properly
    const initialAvailability = {};
    daysOfWeek.forEach((day) => {
      initialAvailability[day] = {
        isAvailable: false,
        slots: [],
      };
    });
    
    // Reset all form data for completely new doctor
    reset();
    setFormData({
      specialization: "",
      experience: "",
      degree: "",
      hospital: "",
      about: "",
      feesPerConsultation: "",
      services: [],
      availability: initialAvailability,
      hasWebsite: "",
      websiteUrl: "",
      virtualConsultation: false,
      inPersonConsultation: false,
      password: "",
    });
    
    // Reset image upload states
    setImageUrl(null);
    setPreviewImage(null);
    setUploading(false);
    
    setErrors({});
    setFormStep(1); // Start from step 1 for new doctor
    setShowForm(true);
    setIsNewDoctor(true);
    setIsExistingDoctor(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("Starting form submission...");
    console.log("isNewDoctor:", isNewDoctor);
    console.log("isExistingDoctor:", isExistingDoctor);

    // Check if image is uploaded for new doctors
    if (isNewDoctor && !imageUrl) {
      toast.error("Please upload a profile image");
      return;
    }

    if (!validateStep2()) {
      console.log("Step 2 validation failed");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for backend
      const availableDays = [];
      const formattedSlots = {};

      // Process availability data
      if (formData.availability) {
        Object.entries(formData.availability).forEach(([day, dayData]) => {
          if (dayData && dayData.isAvailable) {
            availableDays.push(day);

            // Format slots for this day
            if (dayData.slots && dayData.slots.length > 0) {
              formattedSlots[day] = dayData.slots;
            }
          }
        });
      }

      // Get basic data from form
      const basicData = watch();
      console.log("Basic form data:", basicData);

      // Format data according to backend schema
      const finalData = {
        name: basicData.name,
        email: basicData.email,
        phone: basicData.phone,
        address: basicData.address,
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

      // Add password only for new doctors
      if (isNewDoctor) {
        finalData.password = basicData.password;
      }

      // Add imageUrl only for new doctors
      if (isNewDoctor && imageUrl) {
        finalData.image = imageUrl;
      }

      console.log("Final data being sent:", finalData);

      // Determine endpoint based on scenario
      let endpoint, method;
      if (isNewDoctor) {
        endpoint = "/api/doctor/registration";
        method = "POST";
      } else {
        endpoint = "/api/doctor/update-profile";
        method = "PUT";
      }

      console.log("Making request to:", endpoint, "with method:", method);

      const res = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      const result = await res.json();
      console.log("Backend response:", result);

      if (res.ok) {
        // Show success message
        let successMessage = "Profile updated successfully!";
        if (isNewDoctor) {
          successMessage = "New doctor added successfully!";
        }
        toast.success(successMessage);
        // Redirect to dashboard
        window.location.href = "/doctor-dashboard";
      } else {
        // Show error message
        console.error("Backend error:", result);
        toast.error(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("An error occurred while saving the profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to count total selected slots
  const countSelectedSlots = () => {
    let count = 0;
    if (formData.availability) {
      Object.values(formData.availability).forEach((day) => {
        if (day && day.isAvailable && day.slots) {
          count += day.slots.length;
        }
      });
    }
    return count;
  };

  // If form is not shown yet, show the initial screen with two buttons
  if (!showForm) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-3xl font-bold text-white">
            Doctor Management
          </h2>
          <p className="text-blue-100 mt-2">
            Choose how you want to manage your doctor profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Existing Doctor Card */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="mb-6">
              <UserCheck className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Existing Doctor
              </h3>
              <p className="text-gray-600">
                Complete your profile with pre-filled basic information from registration.
              </p>
            </div>

            <button
              onClick={handleExistingDoctor}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md transition-colors font-medium shadow-sm flex items-center justify-center"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Complete Profile
            </button>
          </div>

          {/* New Doctor Card */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="mb-6">
              <Plus className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                New Doctor
              </h3>
              <p className="text-gray-600">
                Create a new doctor profile with complete professional details and availability settings.
              </p>
            </div>

            <button
              onClick={handleNewDoctor}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md transition-colors font-medium shadow-sm flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Doctor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 my-10">
      {/* Form header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-3xl font-bold text-white">
          {isNewDoctor ? "Add New Doctor" : "Complete Doctor Profile"}
        </h2>
        <p className="text-blue-100 mt-2">
          {formStep === 1 ? "Step 1: Basic Information" : "Step 2: Professional Details & Availability"}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-600">
            Basic Information
          </div>
          <div className="text-sm font-medium text-gray-600">
            Professional Details
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
              Basic Information
            </h3>

            <div className="space-y-6">
              {/* Profile Image Upload - Only for new doctors */}
              {isNewDoctor && (
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-blue-100">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                    <label
                      htmlFor="profile-image"
                      className={`absolute bottom-0 right-0 rounded-full p-2 cursor-pointer shadow-md transition-colors ${
                        uploading 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Upload size={16} className="text-white" />
                      )}
                    </label>
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                    <input
                      id="profile-image"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                      disabled={uploading}
                    />
                  </div>
                  
                  {/* Upload Status */}
                  <div className="text-center">
                    {uploading && (
                      <p className="text-sm text-blue-600 mb-2">
                        Uploading image...
                      </p>
                    )}
                    {imageUrl && !uploading && (
                      <p className="text-sm text-green-600 mb-2">
                        ✓ Image uploaded successfully
                      </p>
                    )}
                    {!previewImage && !uploading && (
                      <p className="text-sm text-gray-500 mb-2">
                        Click the camera icon to upload your photo
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Full Name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Email Address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Phone Number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("address", { required: "Address is required" })}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      formErrors.address ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Office Address"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.address.message}
                    </p>
                  )}
                </div>

                {/* Password - Only show for new doctors */}
                {isNewDoctor && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      {...register("password", { required: isNewDoctor ? "Password is required" : false })}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        formErrors.password ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Password"
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.password.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium shadow-sm flex items-center justify-center"
              >
                Continue to Professional Details
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
              Professional Details & Availability
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
                  Consultation Fee ($)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    id="feesPerConsultation"
                    name="feesPerConsultation"
                    type="number"
                    min="0"
                    placeholder="e.g. 100"
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
                          formData.availability && formData.availability[day]?.isAvailable || false
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
                      onChange={(e) => setFormData(prev => ({ ...prev, virtualConsultation: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="virtual-consultation" className="ml-2 text-sm text-gray-700">
                      Virtual Consultation (Video/Phone)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="in-person-consultation"
                      type="checkbox"
                      checked={formData.inPersonConsultation}
                      onChange={(e) => setFormData(prev => ({ ...prev, inPersonConsultation: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="in-person-consultation" className="ml-2 text-sm text-gray-700">
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

              {/* Time Slots Section */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">
                  Time Slots for Available Days
                </h4>
                <div className="space-y-6">
                  {daysOfWeek.map(
                    (day) =>
                      formData.availability && formData.availability[day]?.isAvailable && (
                        <div
                          key={day}
                          className="border-b border-gray-200 pb-6 last:border-0"
                        >
                          <h5 className="text-md font-medium text-gray-700 mb-3">
                            {day}
                          </h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {timeSlots.map((slot) => (
                              <button
                                key={`${day}-${slot}`}
                                type="button"
                                onClick={() => toggleTimeSlot(day, slot)}
                                className={`p-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                                  formData.availability && formData.availability[day]?.slots?.includes(slot)
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {slot}
                                {formData.availability && formData.availability[day]?.slots?.includes(
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
                          formData.availability && Object.values(formData.availability).filter(
                            (day) => day && day.isAvailable
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
              </div>
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
                    d="M12.707 5.293a1 1 0 010-1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
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
                    {isNewDoctor ? "Add Doctor" : "Save Profile"}
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