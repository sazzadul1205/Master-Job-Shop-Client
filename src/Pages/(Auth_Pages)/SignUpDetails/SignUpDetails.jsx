import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Import Packages
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

// import Phone
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Selection Field
import { GenderSelectField } from "./GenderSelectField/GenderSelectField";

// Common Button
import CommonButton from "../../../Shared/CommonButton/CommonButton";

// Image Cropping Modal
import ImageCropper from "./ImageCropper/ImageCropper";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const SignUpDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // State hooks for form data and image
  const [profileImage, setProfileImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Query to check if the user already exists
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

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // Confirm before creating the account
  const confirmAndSubmit = async (data) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create your account with the provided details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create my account",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) {
      return; // If the user cancels, stop the process
    }

    // Proceed with account creation if confirmed
    onSubmit(data);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    // Set loading to true when submission starts
    setLoading(true);

    let uploadedImageUrl = null;

    // Image upload logic
    if (profileImage) {
      const formData = new FormData();
      formData.append("image", profileImage);
      try {
        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Get image URL
        uploadedImageUrl = res.data.data.display_url;
      } catch (error) {
        // Stop loading on error
        setLoading(false);

        // Error Message
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: `Failed to upload the image. ${
            error?.response?.data?.message ||
            error.message ||
            "Please try again."
          }`,
        });
        return;
      }
    }

    // Prepare form data for submission
    const creationTime = new Date().toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"

    // Payload
    const Payload = {
      email: user?.email,
      phone: phoneNumber,
      ...data,
      profileImage: uploadedImageUrl,
      creationTime,
      description: "No description provided.",
    };

    console.log(Payload);

    // Post the data to the server
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

  // Handle loading and error states
  if (UserExistsCheckIsLoading) {
    return <Loading />;
  }

  if (UserExistsCheckError) {
    return <Error />;
  }

  // If user already exists
  if (UserExistCheck?.exists) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-300 to-white">
        <div className="text-center text-2xl font-bold text-red-500 mb-6">
          You already have an account.
        </div>
        <div className="text-center mb-6">
          <p className="text-lg text-gray-700">
            To modify your information, go to your profile update page.
          </p>
        </div>
        <button
          onClick={() => navigate("/User/UserSettings?tab=Settings_Info")}
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
        >
          Go to Profile Update
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-100">
      {/* Login card container */}
      <div className="w-full max-w-4xl rounded-2xl shadow-md px-3 py-10 md:px-10 md:py-10 space-y-3 bg-linear-to-bl from-blue-500/80 to-blue-100/80">
        {/* Heading section */}
        <h4 className="text-3xl playfair font-bold text-center text-white">
          Details
        </h4>

        <div className="p-[2px] w-full bg-white" />

        {/* Forms */}
        <form onSubmit={handleSubmit(confirmAndSubmit)}>
          {/* Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10 items-center">
            {/* Left Side Data */}
            <div className="space-y-4">
              {/* Title */}
              <h3 className="text-black text-center font-semibold text-xl">
                Trainer Profile
              </h3>

              {/* Cropper Component */}
              <ImageCropper
                onImageCropped={setProfileImage}
                register={register}
                errors={errors}
              />
            </div>

            {/* Right Side Data */}
            <div className="space-y-4">
              <InputField
                label="Full Name"
                placeholder="John Doe"
                register={register}
                errors={errors}
                name="name"
                type="text"
              />

              <div>
                <label className="block text-black playfair font-semibold text-lg">
                  Phone
                </label>
                <PhoneInput
                  country={"bd"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-lg "
                  inputStyle={{ width: "100%", height: "40px" }}
                />
              </div>

              <InputField
                label="Date of Birth"
                placeholder=""
                register={register}
                errors={errors}
                name="dob"
                type="date"
              />
              <GenderSelectField
                register={register}
                errors={errors}
                control={control}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <CommonButton
              type="none"
              text="Create Account"
              isLoading={loading}
              loadingText="Submitting..."
              textColor="text-blue-600"
              bgColor="white"
              width="[300px]"
              px="px-5"
              py="py-3"
              className="playfair"
              cursorStyle="cursor-pointer"
              borderRadius="rounded-xl text-xl"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpDetails;

// Reusable Input Field Component
export const InputField = ({
  label,
  placeholder,
  register,
  errors,
  name,
  type,
}) => (
  <div>
    <label className="block text-black playfair font-semibold text-lg">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="input w-full text-black bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
      {...register(name, { required: `${label} is required` })}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

// Add PropTypes for InputField
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};
