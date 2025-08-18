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

const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const SignUpDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const [profileImage, setProfileImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

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

  if (UserExistsCheckIsLoading) return <Loading />;
  if (UserExistsCheckError) return <Error />;

  if (UserExistCheck?.exists) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-bl from-blue-400 to-blue-600 px-4">
        <div className="text-center text-2xl font-bold text-red-500 mb-6">
          You already have an account.
        </div>
        <p className="text-center mb-6 text-gray-700 text-lg">
          To modify your information, go to your profile update page.
        </p>
        <button
          onClick={() => navigate("/User/UserSettings?tab=Settings_Info")}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go to Profile Update
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-400 to-blue-600 px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white bg-opacity-90 shadow-lg p-8">
        <h4 className="text-3xl font-playfair font-bold text-center text-black mb-4">
          Details
        </h4>

        <div className="h-[1px] bg-black mb-8" />

        <form onSubmit={handleSubmit(confirmAndSubmit)} noValidate>
          <div className="flex ">
            <div className="space-y-6 w-2/5">
              <h3 className="text-black text-center font-semibold text-xl">
                Trainer Profile
              </h3>
              <ImageCropper
                onImageCropped={setProfileImage}
                register={register}
                errors={errors}
              />
            </div>

            <div className="w-3/5 space-y-6  border-l border-gray-300 px-2">
              <InputField
                label="Full Name"
                placeholder="John Doe"
                register={register}
                errors={errors}
                name="name"
                type="text"
              />

              <div>
                <label className="block text-black font-playfair font-semibold text-lg mb-2">
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

          <div className="flex justify-end mt-5">
            <button
              type="submit"
              disabled={loading}
              className={`w-[300px] bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 shadow-md transition disabled:opacity-60 ${
                loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
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
