import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const EditJobPreferenceModal = ({ user, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      desiredRole: user?.preferences?.desiredRole || "",
      jobType: user?.preferences?.jobType || "",
      preferredLocation: user?.preferences?.preferredLocation || "",
      salaryFrom: user?.preferences?.salaryFrom || "",
      salaryTo: user?.preferences?.salaryTo || "",
    },
  });

  const allValues = watch();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isChanged, setIsChanged] = useState(false);

  // Reset form whenever user.preferences changes
  useEffect(() => {
    reset({
      desiredRole: user?.preferences?.desiredRole || "",
      jobType: user?.preferences?.jobType || "",
      preferredLocation: user?.preferences?.preferredLocation || "",
      salaryFrom: user?.preferences?.salaryFrom || "",
      salaryTo: user?.preferences?.salaryTo || "",
    });
    setServerError("");
    setIsChanged(false);
  }, [user?.preferences, reset]);

  // Detect changes between form values and initial user.preferences
  useEffect(() => {
    const initialPreferences = user?.preferences || {};

    // Check if any field is different
    const changed = Object.entries(initialPreferences).some(
      ([key, value]) =>
        (allValues[key]?.toString().trim() || "") !==
        (value?.toString().trim() || "")
    );

    // If no preferences exist initially, check if user entered any value
    const hasInitialData = Object.keys(initialPreferences).length > 0;
    const hasInputData = Object.values(allValues).some(
      (v) => v && v.toString().trim() !== ""
    );

    setIsChanged(hasInitialData ? changed : hasInputData);
  }, [allValues, user?.preferences]);

  const handleClose = () => {
    document.getElementById("Edit_Job_Preference_Modal")?.close();
    reset();
    setServerError("");
    setIsChanged(false);
  };

  const onSubmit = async (data) => {
    if (!user?._id) {
      setServerError("Missing user ID. Please try again.");
      return;
    }

    try {
      setLoading(true);
      setServerError("");

    //   
      const response = await axiosPublic.put(
        `Users/EditPreferences/${user._id}`,
        data
      );

      if (response?.data?.modifiedCount > 0 || response?.data?.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Job preferences updated successfully.",
          confirmButtonColor: "#2563eb",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        handleClose();
        refetch();
      } else {
        setServerError("No changes were made.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setServerError(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box min-w-3xl relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-3 right-3 z-50 p-2 rounded-full cursor-pointer hover:bg-gray-100"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      <h3 className="font-bold text-2xl mb-4 text-center">
        Edit Job Preference
      </h3>

      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Desired Role */}
        <div>
          <label className="block font-medium mb-1">Desired Role</label>
          <input
            {...register("desiredRole", { required: "This field is required" })}
            className="input input-bordered w-full bg-white border border-black"
          />
          {errors.desiredRole && (
            <p className="text-sm text-red-600 mt-1">
              {errors.desiredRole.message}
            </p>
          )}
        </div>

        {/* Job Type */}
        <div>
          <label className="block font-medium mb-1">Job Type</label>
          <select
            {...register("jobType", { required: true })}
            className="select select-bordered w-full bg-white border border-black"
          >
            <option value="">Select Job Type</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Preferred Location */}
        <div>
          <label className="block font-medium mb-1">Preferred Location</label>
          <input
            {...register("preferredLocation", {
              required: "This field is required",
            })}
            className="input input-bordered w-full bg-white border border-black"
          />
          {errors.preferredLocation && (
            <p className="text-sm text-red-600 mt-1">
              {errors.preferredLocation.message}
            </p>
          )}
        </div>

        {/* Salary Range */}
        <div>
          <label className="block font-medium mb-1">Salary Range ($)</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                {...register("salaryFrom", {
                  required: "Required",
                  min: { value: 0, message: "Must be positive" },
                })}
                className="input input-bordered w-full bg-white border border-black"
                placeholder="From"
              />
              {errors.salaryFrom && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.salaryFrom.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                {...register("salaryTo", {
                  required: "Required",
                  min: {
                    value: parseInt(allValues.salaryFrom || "0") + 1,
                    message: "Must be greater than 'From'",
                  },
                })}
                className="input input-bordered w-full bg-white border border-black"
                placeholder="To"
              />
              {errors.salaryTo && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.salaryTo.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <CommonButton
            type="submit"
            text={loading ? "Saving..." : "Save Changes"}
            bgColor="blue"
            px="px-10"
            py="py-2"
            textColor="text-white"
            borderRadius="rounded-lg"
            disabled={!isChanged || loading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditJobPreferenceModal;
