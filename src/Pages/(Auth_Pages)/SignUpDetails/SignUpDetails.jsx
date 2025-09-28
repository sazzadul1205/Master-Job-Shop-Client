import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Phone Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Selection Field
import { GenderSelectField } from "./GenderSelectField/GenderSelectField";

// Image Cropper
import ImageCropper from "./ImageCropper/ImageCropper";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const SignUpDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Form Handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // ------------- User Exists Check -------------
  const {
    data: UserExistCheck,
    isLoading: UserExistsCheckIsLoading,
    error: UserExistsCheckError,
  } = useQuery({
    queryKey: ["UserExistsCheck"],
    queryFn: () =>
      axiosPublic
        .get(`/Users/CheckEmail?email=${user?.email}`)
        .then((res) => res.data),
  });

  // Confirm and Submit
  const confirmAndSubmit = async (data) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create your account with the provided details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create my account",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return;

    onSubmit(data);
  };

  // Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);

    let uploadedImageUrl = null;

    if (profileImage) {
      const formData = new FormData();
      formData.append("image", profileImage);
      try {
        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImageUrl = res.data.data.display_url;
      } catch (error) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: `Failed to upload image. ${
            error?.response?.data?.message ||
            error.message ||
            "Please try again."
          }`,
        });
        return;
      }
    }

    const creationTime = new Date().toISOString().slice(0, 19);

    const Payload = {
      email: user?.email,
      fullname: data.name,
      phone: phoneNumber,
      role: "Member",
      ...data,
      profileImage: uploadedImageUrl,
      creationTime,
      description: "No description provided.",
    };

    try {
      await axiosPublic.post("/Users", Payload);
      setLoading(false);
      navigate("/", { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to create the account:", error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Account Creation Failed",
        text:
          error.response?.data?.message ||
          "Failed to create the account. Please try again.",
      });
    }
  };

  // Wait until the user existence check is finished
  if (UserExistsCheckIsLoading) {
    // Show nothing OR a loader while checking
    return <Loading />;
  }

  if (UserExistsCheckError) {
    // Show error if the check fails
    return <Error />;
  }

  // If user already has an account
  if (UserExistCheck?.exists) {
    return (
      // If user already has an account
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-500 to-blue-700 px-4 py-10">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg text-center">
          {/* Title */}
          <h3 className="text-3xl font-playfair font-bold text-red-600 mb-4">
            You already have an account
          </h3>

          {/* Message */}
          <p className="text-gray-700 text-lg mb-6">
            To modify your information or update details, please visit your
            profile update page.
          </p>

          {/* Go to Profile Button */}
          <button
            onClick={() => navigate("/MyProfile")}
            className="w-full max-w-md py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 shadow-md transition duration-300 hover:shadow-2xl cursor-pointer"
          >
            Go to Profile Update
          </button>
        </div>
      </div>
    );
  }

  // If user doesn't have an account
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-500 to-blue-700 px-4 py-10">
      {/* Main Card Container */}
      <div className="w-full max-w-6xl rounded-3xl bg-white bg-opacity-95 shadow-2xl p-10 md:p-12">
        {/* Title */}
        <h4 className="text-3xl md:text-4xl font-playfair font-bold text-center text-gray-900 mb-6">
          Account Details
        </h4>

        {/* Divider */}
        <div className="h-[2px] bg-gray-300 w-24 mx-auto mb-10 rounded-full" />

        {/* Form */}
        <form onSubmit={handleSubmit(confirmAndSubmit)} noValidate>
          {/* Flex container: Left = Profile, Right = Inputs */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side: Profile Image */}
            <div className="w-full md:w-2/5 flex flex-col items-center space-y-6">
              {/* Section Title */}
              <h3 className="text-gray-900 text-center font-semibold text-xl">
                Profile Image
              </h3>

              {/* Image Cropper Component */}
              <ImageCropper
                onImageCropped={setProfileImage}
                register={register}
                errors={errors}
              />

              {/* Instruction Text */}
              <p className="text-gray-500 text-sm text-center">
                Upload a clear profile image. Supported formats: JPG, PNG.
              </p>
            </div>

            {/* Right Side: Input Fields */}
            <div className="w-full md:w-3/5 flex flex-col space-y-6 border-l border-gray-200 pl-0 md:pl-6">
              {/* Full Name */}
              <InputField
                label="Full Name"
                placeholder="John Doe"
                register={register}
                errors={errors}
                name="name"
                type="text"
              />

              {/* Phone Input */}
              <div className="flex flex-col">
                <label className="block text-gray-900 font-semibold text-lg mb-2">
                  Phone
                </label>
                <PhoneInput
                  country={"bd"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-md"
                  inputStyle={{ width: "100%", height: "44px" }}
                />
              </div>

              {/* Date of Birth */}
              <InputField
                label="Date of Birth"
                placeholder=""
                register={register}
                errors={errors}
                name="dob"
                type="date"
              />

              {/* Gender Selection */}
              <GenderSelectField
                register={register}
                errors={errors}
                control={control}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center md:justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-md py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 shadow-md transition duration-300 hover:shadow-2xl cursor-pointer"
            >
              {loading ? "Creating Account ..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpDetails;

// Input Field
export const InputField = ({
  label,
  placeholder,
  register,
  errors,
  name,
  type,
}) => (
  <div>
    <label className="block text-black font-playfair font-semibold text-lg mb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-400 transition"
      {...register(name, { required: `${label} is required` })}
      aria-invalid={errors[name] ? "true" : "false"}
      aria-describedby={`${name}-error`}
    />
    {errors[name] && (
      <p
        id={`${name}-error`}
        className="text-red-600 text-sm mt-1"
        role="alert"
      >
        {errors[name].message}
      </p>
    )}
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};
