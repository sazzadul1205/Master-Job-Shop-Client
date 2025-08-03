import { useForm } from "react-hook-form";

import { ImCross } from "react-icons/im";
import CompanyProfileLogoUpload from "./CompanyProfileLogoUpload/CompanyProfileLogoUpload";
import { useState } from "react";

const AddCompanyProfileModal = () => {
  const [preview, setPreview] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Submitted Company Profile:", data);
    // Submit to backend logic here
  };

  return (
    <div className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={() =>
          document.getElementById("Add_Company_Profile_Modal").close()
        }
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

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic information */}
        <div className="flex w-full gap-1">
          <div className="w-1/3 py-2 px-5">
            <p className="font-medium text-center text-sm mb-1">Company Logo</p>

            <CompanyProfileLogoUpload
              preview={preview}
              setPreview={setPreview}
            />
          </div>
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
          <div>
            <label className="font-medium text-sm mb-1">Founded Year</label>
            <input
              type="number"
              {...register("founded")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="e.g. 2015"
            />
          </div>
          <div>
            <label className="font-medium text-sm mb-1">Company Size</label>
            <input
              type="text"
              {...register("size")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="e.g. 101-250 employees"
            />
          </div>
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
          <h4 className="font-semibold text-gray-700 mb-1">Headquarters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              {...register("headquarters.city")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="City"
            />
            <input
              type="text"
              {...register("headquarters.state")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="State"
            />
            <input
              type="text"
              {...register("headquarters.country")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="Country"
            />
            <input
              type="text"
              {...register("headquarters.address")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="Full Address"
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              {...register("contact.email")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="Contact Email"
            />
            <input
              type="text"
              {...register("contact.phone")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* Website & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-sm mb-1">Website</label>
            <input
              type="url"
              {...register("website")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="https://company.com"
            />
          </div>
          <div>
            <label className="font-medium text-sm mb-1">LinkedIn</label>
            <input
              type="url"
              {...register("socialLinks.linkedin")}
              className="input input-bordered w-full bg-white text-black border-black"
              placeholder="https://linkedin.com/company/xyz"
            />
          </div>
        </div>

        {/* Overview */}
        <div>
          <label className="font-medium text-sm mb-1">Company Overview</label>
          <textarea
            {...register("overview")}
            className="textarea textarea-bordered w-full"
            placeholder="Describe your company..."
            rows={4}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="font-medium text-sm mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            {...register("tags")}
            className="input input-bordered w-full bg-white text-black border-black"
            placeholder="e.g. HealthTech, Remote Friendly"
          />
        </div>

        {/* Submit Button */}
        <div className="text-end">
          <button
            type="submit"
            className="btn bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyProfileModal;
