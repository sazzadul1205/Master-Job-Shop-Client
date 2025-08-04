import { useState } from "react";

// Packages
import { useFieldArray, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Icons
import { RxCross2 } from "react-icons/rx";
import { ImCross } from "react-icons/im";

// Components
import CompanyProfileLogoUpload from "./CompanyProfileLogoUpload/CompanyProfileLogoUpload";

// Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const AddCompanyProfileModal = ({ CompanyRefetch }) => {
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
  } = useForm();

  // Field Array Handling
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  // Form Submission
  const onSubmit = async (data) => {
    // Loading & Error Message Reinstate
    setLoading(true);
    setErrorMessage("");

    // Image Upload URL
    let uploadedImageUrl = null;

    // Image Upload
    try {
      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = res.data.data.display_url;
      }

      // formatted Data Payload
      const formattedData = {
        name: data.name,
        tagline: data.tagline,
        founded: Number(data.founded) || null,
        size: data.size,
        industry: data.industry,
        overview: data.overview,
        tags: data.tags.map((t) => t.trim()).filter((t) => t !== ""),
        logo: uploadedImageUrl || "",
        website: data.website,
        headquarters: {
          city: data.headquarters?.city || "",
          state: data.headquarters?.state || "",
          country: data.headquarters?.country || "",
          address: data.headquarters?.address || "",
        },
        contact: {
          email: data.contact?.email || "",
          phone: data.contact?.phone || "",
        },
        socialLinks: {
          linkedin: data.socialLinks?.linkedin || "",
        },
        email: user?.email,
        createdAt: new Date().toISOString(),
      };

      // POST Request
      await axiosPublic.post("/Company", formattedData);

      // Success Message
      Swal.fire({
        icon: "success",
        title: "Profile Created",
        text: "Your company profile was saved successfully.",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        // Close Modal
        () => document.getElementById("Add_Company_Profile_Modal ").close();
        reset();
        CompanyRefetch();
        setPreview(null);
        setErrorMessage("");
        setProfileImage(null);
        setNewFieldValues({ tags: "" });
      });
    } catch (error) {
      setErrorMessage("Failed to save company profile.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("Add_Company_Profile_Modal ").close();
          reset();
          setPreview(null);
          CompanyRefetch();
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
        Create Company Profile
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
        {/* Basic information */}
        <div className="flex w-full gap-1">
          <div className="w-1/3 py-2 px-5">
            {/* Logo Title */}
            <p className="font-medium text-center text-sm mb-1">Company Logo</p>

            {/* Logo Upload Container */}
            <CompanyProfileLogoUpload
              preview={preview}
              setPreview={setPreview}
              setProfileImage={setProfileImage}
            />
          </div>

          {/* Initial Information */}
          <div className="w-2/3 space-y-3 py-2">
            {/* Company Name */}
            <div>
              <label className="font-medium text-sm mb-1">Company Name</label>
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
              <label className="font-medium text-sm mb-1">Industries</label>
              <input
                type="text"
                {...register("tagline")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Your tagline"
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Founded Year */}
          <div>
            <label className="font-medium text-sm mb-1">Founded Year</label>
            <input
              type="number"
              {...register("founded")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="e.g. 2015"
            />
          </div>

          {/* Company Size */}
          <div>
            <label className="font-medium text-sm mb-1">Company Size</label>
            <input
              type="text"
              {...register("size")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="e.g. 101-250 employees"
            />
          </div>

          {/* Industries */}
          <div>
            <label className="font-medium text-sm mb-1">Industry</label>
            <input
              type="text"
              {...register("industry")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="e.g. HealthTech"
            />
          </div>
        </div>

        {/* Headquarters */}
        <div>
          {/* Title */}
          <h4 className="font-semibold text-gray-700 mb-2">Headquarters</h4>

          {/* Divider */}
          <div className="p-[1px] bg-blue-500 mb-2" />

          {/* Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="label font-semibold text-sm text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register("headquarters.city")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="City"
              />
            </div>

            {/* State */}
            <div>
              <label className="label font-semibold text-sm text-gray-700">
                State
              </label>
              <input
                type="text"
                {...register("headquarters.state")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="State"
              />
            </div>

            {/* Country */}
            <div>
              <label className="label font-semibold text-sm text-gray-700">
                Country
              </label>
              <input
                type="text"
                {...register("headquarters.country")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Country"
              />
            </div>

            {/* Address */}
            <div>
              <label className="label font-semibold text-sm text-gray-700">
                Full Address
              </label>
              <input
                type="text"
                {...register("headquarters.address")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Full Address"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          {/* Title */}
          <h4 className="font-semibold text-gray-700 mb-2">Contact</h4>

          {/* Divider */}
          <div className="p-[1px] bg-blue-500 mb-2" />

          {/* Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="label font-semibold text-sm text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                {...register("contact.email")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Contact Email"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="label font-semibold text-sm text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                {...register("contact.phone")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="Phone Number"
              />
            </div>

            {/* Website */}
            <div>
              <label className="label font-semibold text-sm text-gray-700">
                Website
              </label>
              <input
                type="url"
                {...register("website")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="https://company.com"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="label font-semibold text-sm text-gray-700">
                LinkedIn
              </label>
              <input
                type="url"
                {...register("socialLinks.linkedin")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="https://linkedin.com/company/xyz"
              />
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
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

// Prop Vallation
AddCompanyProfileModal.propTypes = {
  CompanyRefetch: PropTypes.func.isRequired,
};

export default AddCompanyProfileModal;
