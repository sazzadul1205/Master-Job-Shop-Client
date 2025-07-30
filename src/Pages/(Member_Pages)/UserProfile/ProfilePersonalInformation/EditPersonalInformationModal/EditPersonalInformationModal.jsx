import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { ImCross } from "react-icons/im";

import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

const EditPersonalInformationModal = ({ user, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // react-hook-form with default values from user or empty
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      phone: user?.phone || "",
      availability: user?.availability || "",
      experienceLevel: user?.experienceLevel || "",
      linkedin:
        user?.socials?.find((s) => s.platform === "linkedin")?.url || "",
      github: user?.socials?.find((s) => s.platform === "github")?.url || "",
      portfolio:
        user?.socials?.find((s) => s.platform === "portfolio")?.url || "",
    },
  });

  const allValues = watch();

  // Local states
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [serverError, setServerError] = useState("");

  // Reset form on user change
  useEffect(() => {
    reset({
      email: user?.email || "",
      phone: user?.phone || "",
      availability: user?.availability || "",
      experienceLevel: user?.experienceLevel || "",
      linkedin:
        user?.socials?.find((s) => s.platform === "linkedin")?.url || "",
      github: user?.socials?.find((s) => s.platform === "github")?.url || "",
      portfolio:
        user?.socials?.find((s) => s.platform === "portfolio")?.url || "",
    });
    setServerError("");
    setIsChanged(false);
  }, [user, reset]);

  // Detect if any value changed from initial user data
  useEffect(() => {
    if (!user) return;

    const socials = user.socials || [];
    const initial = {
      phone: user.phone || "",
      availability: user.availability || "",
      experienceLevel: user.experienceLevel || "",
      linkedin: socials.find((s) => s.platform === "linkedin")?.url || "",
      github: socials.find((s) => s.platform === "github")?.url || "",
      portfolio: socials.find((s) => s.platform === "portfolio")?.url || "",
    };

    const changed = Object.entries(initial).some(
      ([key, value]) =>
        (allValues[key] || "").toString().trim() !== value.toString().trim()
    );

    setIsChanged(changed);
  }, [allValues, user]);

  // Close modal & reset
  const handleClose = () => {
    document.getElementById("Edit_Personal_Information_Modal")?.close();
    reset();
    setServerError("");
    setIsChanged(false);
  };

  // Submit handler
  const onSubmit = async (data) => {
    // Check for missing user ID
    if (!user?._id) {
      setServerError("Missing user ID.");
      return;
    }

    // Reset server error
    setServerError("");
    setLoading(true);

    // Build socials array
    const updatedSocials = [
      { platform: "linkedin", url: data.linkedin },
      { platform: "github", url: data.github },
      { platform: "portfolio", url: data.portfolio },
    ];

    // Build payload
    const payload = {
      phone: data.phone,
      availability: data.availability,
      experienceLevel: data.experienceLevel,
      socials: updatedSocials,
    };

    try {
      // Update user
      const response = await axiosPublic.put(
        `/Users/EditPersonalInformation/${user._id}`,
        payload
      );

      // Success Alert
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Personal information updated successfully.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Reset form
        refetch();
        handleClose();
      } else {
        // Error Alert
        setServerError("Failed to update personal information.");
      }
    } catch (error) {
      // Error Alert
      setServerError(
        error.response?.data?.message ||
          "Failed to update personal information."
      );
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Edit_Personal_Information_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-3 right-3 z-50 p-2 rounded-full cursor-pointer hover:bg-gray-100"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      {/* Title */}
      <h3 className="font-bold text-2xl mb-4 text-center">
        Edit Personal Information
      </h3>

      {/* Server error */}
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email - disabled */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            disabled
            className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            placeholder="e.g. +8801XXXXXXXXX"
            {...register("phone")}
            onBlur={(e) => {
              if (e.target.value && !e.target.value.startsWith("+")) {
                e.target.value = "+" + e.target.value.replace(/^\+*/, "");
              }
            }}
            className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block font-medium mb-1">Experience Level</label>
          <select
            {...register("experienceLevel", {
              required: "Experience Level is required",
            })}
            className="w-full border px-3 py-2 rounded-md focus:outline-blue-500 bg-white"
          >
            <option value="">Select Experience Level</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Lead">Lead</option>
            <option value="Principal">Principal</option>
          </select>
          {errors.experienceLevel && (
            <p className="text-sm text-red-600 mt-1">
              {errors.experienceLevel.message}
            </p>
          )}
        </div>

        {/* Availability */}
        <div>
          <label className="block font-medium mb-1">Available From</label>
          <input
            type="text"
            placeholder="e.g. Immediately, August 2025"
            {...register("availability")}
            className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block font-medium mb-1">LinkedIn</label>
          <input
            type="url"
            placeholder="https://linkedin.com/your-username"
            {...register("linkedin")}
            className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block font-medium mb-1">GitHub</label>
          <input
            type="url"
            placeholder="https://github.com/your-username"
            {...register("github")}
            className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
          />
        </div>

        {/* Portfolio */}
        <div>
          <label className="block font-medium mb-1">Portfolio</label>
          <input
            type="url"
            placeholder="https://portfolio.com/your-username"
            {...register("portfolio")}
            className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <CommonButton
            type="submit"
            text={loading ? "Saving..." : "Save Changes"}
            bgColor="blue"
            px="px-10"
            py="py-2"
            borderRadius="rounded-lg"
            disabled={!isChanged || loading}
          />
        </div>
      </form>
    </div>
  );
};

EditPersonalInformationModal.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    availability: PropTypes.string,
    experienceLevel: PropTypes.string,
    socials: PropTypes.arrayOf(
      PropTypes.shape({
        platform: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default EditPersonalInformationModal;
