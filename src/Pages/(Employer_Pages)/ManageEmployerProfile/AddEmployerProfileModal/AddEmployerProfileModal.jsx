import { useState } from "react";

// Packages
import { useFieldArray, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Icons
import { RxCross2 } from "react-icons/rx";
import { ImCross } from "react-icons/im";

// Components
import CompanyProfileLogoUpload from "../../ManageCompanyProfile/AddCompanyProfileModal/CompanyProfileLogoUpload/CompanyProfileLogoUpload";

// Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const AddEmployerProfileModal = ({ refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Logo States
  const [preview, setPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // Loading State
  const [loading, setLoading] = useState(null);

  // Tag States
  const [newFieldValues, setNewFieldValues] = useState({ tags: "" });

  // Error State
  const [errorMessage, setErrorMessage] = useState("");

  // Form Handling
  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contact: {
        email: "",
        phone: "",
        location: "",
        city: "",
        country: "",
        address: "",
      },
      onlinePresence: {
        website: "",
        linkedin: "",
        twitter: "",
        facebook: "",
      },
      tags: [],
    },
  });

  // Field Array Handling for Tags
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  // Form Submission
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      let uploadedImageUrl = null;

      // Upload image if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = res.data?.data?.display_url || null;
      }

      // Build the payload
      const formattedData = {
        name: data.name,
        email: user?.email || "",
        industry: data.industry,
        overview: data.overview || "",
        logo: uploadedImageUrl,
        contact: {
          email: data.contact.email,
          phone: data.contact.phone,
          location: data.contact.location,
          city: data.contact.city,
          country: data.contact.country,
          address: data.contact.address || "",
        },
        onlinePresence: {
          website: data.onlinePresence.website,
          linkedin: data.onlinePresence.linkedin,
          twitter: data.onlinePresence.twitter || "",
          facebook: data.onlinePresence.facebook || "",
        },
        tags: data.tags || [],
        createdBy: user?.email || "",
      };

      // Send to backend
      await axiosPublic.post("/Employers", formattedData);

      // Success
      await Swal.fire({
        icon: "success",
        title: "Profile Created",
        text: "Your Employer profile was saved successfully.",
        confirmButtonColor: "#2563eb",
      });

      // Close modal & reset
      document.getElementById("Add_Employer_Profile_Modal").close();
      reset();
      refetch();
      setPreview(null);
      setErrorMessage("");
      setProfileImage(null);
      setNewFieldValues({ tags: "" });
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save Employer profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Add_Employer_Profile_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("Add_Employer_Profile_Modal").close();
          reset();
          refetch();
          setPreview(null);
          setErrorMessage("");
          setProfileImage(null);
          setNewFieldValues({ tags: "" });
        }}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        Create Employer Profile
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Alert Messages */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex w-full gap-1">
          <div className="w-1/3 py-2 px-5">
            <p className="font-medium text-center text-sm mb-1">
              Employer Avatar
            </p>
            <CompanyProfileLogoUpload
              preview={preview}
              setPreview={setPreview}
              setProfileImage={setProfileImage}
            />
          </div>

          {/* Initial Information */}
          <div className="w-2/3 space-y-3 py-2">
            {/* Employer Name */}
            <div>
              <label className="font-medium text-sm mb-1">Employer Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Employer Name"
              />
              {errors.name && <p className="text-red-500 text-sm">Required</p>}
            </div>

            {/* Industries */}
            <div>
              <label className="font-medium text-sm mb-1">Industries</label>
              <input
                type="text"
                {...register("industry", { required: true })}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Your industry"
              />
              {errors.name && <p className="text-red-500 text-sm">Required</p>}
            </div>
          </div>
        </div>

        {/* Overview */}
        <div>
          <label className="font-medium text-sm mb-1">Company Overview</label>
          <textarea
            {...register("overview")}
            className="textarea textarea-bordered w-full bg-white text-black border-black"
            placeholder="Describe your company..."
            rows={4}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          {/* Title */}
          <h5 className="text-xl font-semibold text-gray-800 mb-2">
            Contact Information
          </h5>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="font-medium text-sm mb-1"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="Email"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("contact.email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.contact?.email && (
                <p className="text-red-600 text-sm">
                  {errors.contact.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="contact-phone"
                className="font-medium text-sm mb-1"
              >
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="Phone Number"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("contact.phone", {
                  required: "Phone number is required",
                })}
              />
              {errors.contact?.phone && (
                <p className="text-red-600 text-sm">
                  {errors.contact.phone.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="contact-location"
                className="font-medium text-sm mb-1"
              >
                Location
              </label>
              <input
                id="contact-location"
                type="text"
                placeholder="Location"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("contact.location", {
                  required: "Location is required",
                })}
              />
              {errors.contact?.location && (
                <p className="text-red-600 text-sm">
                  {errors.contact.location.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="contact-city"
                className="font-medium text-sm mb-1"
              >
                City
              </label>
              <input
                id="contact-city"
                type="text"
                placeholder="City"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("contact.city", { required: "City is required" })}
              />
              {errors.contact?.city && (
                <p className="text-red-600 text-sm">
                  {errors.contact.city.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="contact-country"
                className="font-medium text-sm mb-1"
              >
                Country
              </label>
              <input
                id="contact-country"
                type="text"
                placeholder="Country"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("contact.country", {
                  required: "Country is required",
                })}
              />
              {errors.contact?.country && (
                <p className="text-red-600 text-sm">
                  {errors.contact.country.message}
                </p>
              )}
            </div>

            {/* Address (Optional) */}
            <div>
              <label
                htmlFor="contact-address"
                className="font-medium text-sm mb-1"
              >
                Address (Optional)
              </label>
              <input
                id="contact-address"
                type="text"
                placeholder="Address (Optional)"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("contact.address")}
              />
            </div>
          </div>
        </div>

        {/* Online Presence */}
        <div className="space-y-3">
          {/* Title */}
          <h5 className="text-xl font-semibold text-gray-800 mb-2">
            Online Presence
          </h5>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Website URL */}
            <div>
              <label htmlFor="website-url" className="font-medium text-sm mb-1">
                Website URL
              </label>
              <input
                id="website-url"
                type="url"
                placeholder="Website URL"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("onlinePresence.website", {
                  required: "Website URL is required",
                  pattern: {
                    message: "Invalid URL",
                  },
                })}
              />
              {errors.onlinePresence?.website && (
                <p className="text-red-600 text-sm">
                  {errors.onlinePresence.website.message}
                </p>
              )}
            </div>

            {/* LinkedIn Profile URL */}
            <div>
              <label
                htmlFor="linkedin-url"
                className="font-medium text-sm mb-1"
              >
                LinkedIn Profile URL
              </label>
              <input
                id="linkedin-url"
                type="url"
                placeholder="LinkedIn Profile URL"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("onlinePresence.linkedin", {
                  required: "LinkedIn URL is required",
                  pattern: {
                    message: "Invalid LinkedIn URL",
                  },
                })}
              />
              {errors.onlinePresence?.linkedin && (
                <p className="text-red-600 text-sm">
                  {errors.onlinePresence.linkedin.message}
                </p>
              )}
            </div>

            {/* Twitter Profile URL (Optional) */}
            <div>
              <label htmlFor="twitter-url" className="font-medium text-sm mb-1">
                Twitter Profile URL (Optional)
              </label>
              <input
                id="twitter-url"
                type="url"
                placeholder="Twitter Profile URL (Optional)"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("onlinePresence.twitter", {
                  pattern: {
                    message: "Invalid Twitter URL",
                  },
                })}
              />
              {errors.onlinePresence?.twitter && (
                <p className="text-red-600 text-sm">
                  {errors.onlinePresence.twitter.message}
                </p>
              )}
            </div>

            {/* Facebook Profile URL (Optional) */}
            <div>
              <label
                htmlFor="facebook-url"
                className="font-medium text-sm mb-1"
              >
                Facebook Profile URL (Optional)
              </label>
              <input
                id="facebook-url"
                type="url"
                placeholder="Facebook Profile URL (Optional)"
                className="input input-bordered w-full bg-white text-black border-black"
                {...register("onlinePresence.facebook", {
                  pattern: {
                    message: "Invalid Facebook URL",
                  },
                })}
              />
              {errors.onlinePresence?.facebook && (
                <p className="text-red-600 text-sm">
                  {errors.onlinePresence.facebook.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          {/* Label */}
          <label
            htmlFor="tags-input"
            className="block font-semibold text-sm mb-2 capitalize"
          >
            Tags
          </label>

          {/* Tag Display */}
          <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3 px-2 py-2">
            {fields.length > 0 ? (
              fields.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => remove(index)}
                  className="flex items-center border border-blue-700 font-semibold text-blue-800 gap-2 px-3 py-1 rounded cursor-pointer hover:bg-blue-100 transition-all duration-200 text-sm "
                >
                  {watch(`tags.${index}`) || `Tag #${index + 1}`} <RxCross2 />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm px-5 py-2">
                No tags added yet.
              </p>
            )}
          </div>

          {/* Add Field Input */}
          <div className="flex justify-end gap-2">
            <input
              id="tags-input"
              type="text"
              value={newFieldValues.tags || ""}
              onChange={(e) =>
                setNewFieldValues((prev) => ({
                  ...prev,
                  tags: e.target.value,
                }))
              }
              placeholder="Add new tag"
              className="input input-bordered bg-white text-black border-black w-2/3"
            />
            <button
              type="button"
              onClick={() => {
                const value = newFieldValues.tags?.trim();
                if (value) {
                  append(value);
                  setNewFieldValues((prev) => ({ ...prev, tags: "" }));
                }
              }}
              className="flex items-center gap-2 border-2 border-blue-600 font-semibold text-blue-600 rounded shadow-xl px-5 py-1 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-500"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow ${
            loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Creating..." : "Creating Employer Profile"}
        </button>
      </form>
    </div>
  );
};

// Prop Vallation
AddEmployerProfileModal.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AddEmployerProfileModal;
