import { useEffect, useState } from "react";

// Packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Components
import CompanyProfileLogoUpload from "../../../(Employer_Pages)/ManageCompanyProfile/AddCompanyProfileModal/CompanyProfileLogoUpload/CompanyProfileLogoUpload";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const EditProfileBasicInformation = ({ MentorData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Initialize react-hook-form with default values from user.preferences or empty strings
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: MentorData?.name || "",
      position: MentorData?.position || "",
      description: MentorData?.description || "",
    },
  });

  useEffect(() => {
    if (MentorData) {
      reset({
        name: MentorData.name || "",
        position: MentorData.position || "",
        description: MentorData.description || "",
      });

      setPreview(MentorData.avatar || null);
      setProfileImage(null);
    }
  }, [MentorData, reset]);

  // Close modal, reset form, clear errors and change flags
  const handleClose = () => {
    document.getElementById("Edit_Profile_Basic_Information")?.close();
    setErrorMessage("");
    setLoading(false);
    refetch();
  };

  // Form submit handler - updates preferences on server
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    let uploadedImageUrl = preview; // default to existing avatar

    // Upload new image if selected
    if (profileImage) {
      try {
        const formData = new FormData();
        formData.append("image", profileImage);

        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = res.data.data.display_url;
      } catch (error) {
        setErrorMessage(`Image upload failed: ${error.message}`);
        setLoading(false);
        return;
      }
    }

    // Prepare payload
    const payload = {
      name: data.name,
      position: data.position,
      description: data.description,
      avatar: uploadedImageUrl,
    };

    try {
      // Replace this URL with your actual API endpoint
      await axiosPublic.put(`/Mentors/${MentorData._id}`, payload);

      setLoading(false);
      handleClose();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div
      id="Edit_Profile_Basic_Information"
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

      {/* Modal Title */}
      <h3 className="font-bold text-2xl mb-4 text-center">
        Edit Profile Basic Information
      </h3>

      {/* Server error message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Preference Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic information */}
        <div className="flex w-full gap-1">
          <div className="w-1/3 py-2 px-5">
            {/* Logo Title */}
            <p className="font-medium text-center text-sm mb-1">Mentor Image</p>

            {/* Logo Upload Container */}
            <CompanyProfileLogoUpload
              preview={preview}
              setPreview={setPreview}
              setProfileImage={setProfileImage}
            />
          </div>

          {/* Initial Information */}
          <div className="w-2/3 space-y-3 py-2">
            {/* Name */}
            <div>
              <label className="font-medium text-sm mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Company Name"
              />
              {errors.name && <p className="text-red-500 text-sm">Required</p>}
            </div>

            {/* Industries */}
            <div>
              <label className="font-medium text-sm mb-1">
                Industries <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("position", { required: true })}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Your position"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-medium text-sm mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            className="textarea textarea-bordered w-full bg-white text-black border-black"
            placeholder="Describe your self"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow ${
            loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Updating..." : "Update Mentor Profile Basic Information"}
        </button>
      </form>
    </div>
  );
};

// Prop Validation
EditProfileBasicInformation.propTypes = {
  MentorData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    position: PropTypes.string,
    description: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default EditProfileBasicInformation;
