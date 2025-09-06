import { useState, useEffect } from "react";

// Packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const EditProfileBiographyModal = ({ MentorData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      biography: MentorData?.biography || "",
    },
  });

  // Reset form when MentorData changes
  useEffect(() => {
    if (MentorData) {
      reset({
        biography: MentorData?.biography || "",
      });
    }
  }, [MentorData, reset]);

  // Close modal
  const handleClose = () => {
    document.getElementById("Edit_Profile_Biography")?.close();
    setErrorMessage("");
    setLoading(false);
    refetch();
  };

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      // PUT request to update biography
      await axiosPublic.put(`/Mentors/${MentorData._id}`, {
        biography: data.biography,
      });

      // On success
      setLoading(false);
      handleClose();
    } catch (error) {
      // On error
      console.error("Error updating biography:", error);
      setErrorMessage("Failed to update biography. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      id="Edit_Profile_Biography"
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
        Edit Profile Biography
      </h3>

      {/* Error */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Biography */}
        <div>
          <label className="font-medium text-sm mb-1">Biography</label>
          <textarea
            {...register("biography", {
              required: "Biography is required",
              minLength: {
                value: 10,
                message: "Biography must be at least 10 characters",
              },
            })}
            className="textarea textarea-bordered w-full bg-white text-black border-black"
            placeholder="Describe your Biography"
            rows={10}
          />
          {errors.biography && (
            <p className="text-red-500 text-xs mt-1">
              {errors.biography.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow ${
            loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Updating..." : "Update Biography"}
        </button>
      </form>
    </div>
  );
};

// Prop Types
EditProfileBiographyModal.propTypes = {
  MentorData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    biography: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default EditProfileBiographyModal;
