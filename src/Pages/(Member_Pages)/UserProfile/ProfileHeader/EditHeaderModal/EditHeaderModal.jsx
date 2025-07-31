import { useState, useEffect } from "react";

// Packages
import { useForm, useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Modals
import ImageCropper from "../../../../(Auth_Pages)/SignUpDetails/ImageCropper/ImageCropper";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const EditHeaderModal = ({ user, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Initialize react-hook-form with default values from user
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      title: user?.title || "",
      location: user?.location || "",
      bio: user?.bio || "",
    },
  });

  // State Management
  const [initialPayload, setInitialPayload] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Watch form data live for change detection
  const watchFields = useWatch({ control });

  // Set initial payload for change detection on mount
  useEffect(() => {
    setInitialPayload({
      bio: user?.bio || "",
      title: user?.title || "",
      fullName: user?.fullName || "",
      location: user?.location || "",
      profileImage: user?.profileImage || "",
    });
  }, [user]);

  // Check if form or image has changed from initial payload
  const isChanged = () => {
    if (!initialPayload) return false;

    const formChanged =
      watchFields.fullName !== initialPayload.fullName ||
      (watchFields.title || "") !== (initialPayload.title || "") ||
      (watchFields.location || "") !== (initialPayload.location || "") ||
      (watchFields.bio || "") !== (initialPayload.bio || "");

    // For image, just check if a new blob is selected or not
    const imageChanged = profileImage !== null;

    return formChanged || imageChanged;
  };

  // Handle form submission
  const onSubmit = async (data) => {
    // If no changes detected, do nothing
    if (!isChanged()) return;

    // Show loading state
    try {
      // Set loading state
      setIsLoading(true);
      setServerError("");

      // Handle image upload if a new profile image is selected
      let uploadedImageUrl = null;

      // If a new profile image is selected, upload it
      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = res?.data?.data?.display_url;
      }

      // Construct payload
      const payload = {
        fullName: data.fullName,
        title: data.title || "",
        location: data.location || "",
        bio: data.bio || "",
        profileImage: uploadedImageUrl || user?.profileImage || "",
      };

      // Update user header information
      await axiosPublic.put(`/Users/EditHeader/${user._id}`, payload);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Profile header updated",
        timer: 1500,
        showConfirmButton: false,
      });

      // Refetch user data and close modal
      refetch();
      handleClose();
    } catch (error) {
      // Handle errors
      console.error("Update failed:", error);
      setServerError(error?.response?.data?.message || "Something went wrong.");
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  // Handle modal close and reset state
  const handleClose = () => {
    document.getElementById("Edit_Header_Modal")?.close();
    setServerError("");
    reset();
    setProfileImage(null);
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

      {/* Modal Title */}
      <h3 className="font-bold text-2xl mb-4 text-center">
        Edit Profile Header
      </h3>

      {/* Server error message */}
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Profile Image */}
        <div>
          <label className="block font-medium mb-1">Profile Image</label>
          <ImageCropper
            onImageCropped={setProfileImage}
            defaultImageUrl={user?.profileImage}
            register={register}
            errors={errors}
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            {...register("fullName", { required: "Full name is required" })}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Frontend Developer"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            {...register("location")}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Dhaka, Bangladesh"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block font-medium mb-1">Bio</label>
          <textarea
            rows={4}
            {...register("bio")}
            className="w-full border rounded px-3 py-2"
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <CommonButton
            type="submit"
            text={isLoading ? "Saving..." : "Save Changes"}
            bgColor="blue"
            px="px-10"
            py="py-2"
            textColor="text-white"
            borderRadius="rounded-lg"
            disabled={!isChanged() || isLoading}
          />
        </div>
      </form>
    </div>
  );
};

// Prop Types
EditHeaderModal.propTypes = {
  user: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default EditHeaderModal;
