"use client";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
} from "lucide-react";
import { useDoctorStore } from "@/store/doctorStore";
import { upload } from "@imagekit/next";

const DoctorRegistration = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { setBasicInfo, clearDoctorData } = useDoctorStore();
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Clear doctor store when registration page loads to ensure fresh state
  useEffect(() => {
    // Force clear both store and localStorage
    clearDoctorData();
    if (typeof window !== "undefined") {
      localStorage.removeItem("doctor-storage");
      sessionStorage.removeItem("doctor-storage");
    }
  }, [clearDoctorData]);

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

  const onSubmit = async (data) => {
    if (!imageUrl) {
      toast.error("Please upload a profile image");
      return;
    }

    if (!data.virtualConsultation && !data.inPersonConsultation) {
      toast.error("Please select at least one consultation type");
      return;
    }

    try {
      const res = await fetch("/api/doctor/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, image: imageUrl }),
      });

      const result = await res.json();

      if (res.ok) {
        // Force clear any existing data first, then set new doctor data
        clearDoctorData();
        if (typeof window !== "undefined") {
          localStorage.removeItem("doctor-storage");
          sessionStorage.removeItem("doctor-storage");
        }

        setBasicInfo(result.doctor);
        toast.success("Registration successful! Please login to continue.");

        // Always redirect to login page after registration
        setTimeout(() => {
          router.push("/doctor-login");
        }, 1500);
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left side (Image) */}
        <div className="lg:w-2/5 relative">
          <div className="hidden lg:block h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
            <img
              src="/doctor-img.jpg"
              alt="Doctor"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white z-10">
              <h2 className="text-3xl font-bold mb-6">
                Join Our Medical Network
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Register today to connect with patients and provide quality
                healthcare services.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Manage your appointments</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Connect with patients</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Grow your practice</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side (Form) */}
        <div className="lg:w-3/5 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Clinic Registration
            </h2>
            <p className="text-gray-600 mt-2">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Profile Image Upload */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-indigo-100">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="profile-image"
                  className={`absolute bottom-0 right-0 rounded-full p-2 cursor-pointer shadow-md transition-colors ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
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
                  <p className="text-sm text-indigo-600 mb-2">
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

              {errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

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
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Full Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
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
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Email Address"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
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
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Phone Number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="mt-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register("address", { required: "Address is required" })}
                className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Office Address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Consultation Types */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Consultation Types <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    id="virtual-consultation"
                    type="checkbox"
                    {...register("virtualConsultation")}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                    {...register("inPersonConsultation")}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="in-person-consultation"
                    className="ml-2 text-sm text-gray-700"
                  >
                    In-Person Consultation
                  </label>
                </div>
              </div>
              {!watch("virtualConsultation") &&
                !watch("inPersonConsultation") && (
                  <p className="text-red-500 text-xs mt-1">
                    Please select at least one consultation type
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg text-white font-medium transition-colors ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Creating your account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/doctor-login"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;
