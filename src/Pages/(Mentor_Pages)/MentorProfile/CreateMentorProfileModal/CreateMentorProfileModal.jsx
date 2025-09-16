import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

// Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Components
import CompanyProfileLogoUpload from "../../../(Employer_Pages)/ManageCompanyProfile/AddCompanyProfileModal/CompanyProfileLogoUpload/CompanyProfileLogoUpload";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const CreateMentorProfileModal = ({ refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States
  const [loading, setLoading] = useState(null);
  const [preview, setPreview] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // New Field Values
  const [newFieldValues, setNewFieldValues] = useState({
    expertise: "",
    skills: "",
  });

  // Form Handling
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Expertise Field Array
  const {
    fields: expertiseFields,
    append: appendExpertise,
    remove: removeExpertise,
  } = useFieldArray({
    control,
    name: "expertise",
  });

  // Skills Field Array
  const {
    fields: skillsFields,
    append: appendSkills,
    remove: removeSkills,
  } = useFieldArray({
    control,
    name: "skills",
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
        avatar: uploadedImageUrl,
        name: data.name,
        position: data.position,
        description: data.description,
        email: user.email,
        contact: {
          email: data.email, // from form
          phone: phoneNumber,
          linkedin: data.linkedin,
        },
        expertise: data.expertise
          .map((t) => t.value.trim())
          .filter((t) => t !== ""),
        skills: data.skills.map((t) => t.value.trim()).filter((t) => t !== ""),
        biography: data.biography,
      };

      // POST Request
      await axiosPublic.post("/Mentors", formattedData);

      // Close Modal after success
      document.getElementById("Create_Mentor_Profile_Modal").close();

      // Reset states after modal is closed
      reset();
      refetch();
      setPreview("");
      setPhoneNumber("+880 ");
      setErrorMessage("");
      setProfileImage("");
      setNewFieldValues({
        expertise: "",
        skills: "",
      });

      // Success Message
      Swal.fire({
        icon: "success",
        title: "Mentor Profile Created",
        text: "Your Mentor profile was saved successfully.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err) {
      setErrorMessage("Failed to save Mentor profile.");
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Create_Mentor_Profile_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("Create_Mentor_Profile_Modal").close();
          reset();
          refetch();
          setPreview("");
          setPhoneNumber("+880 ");
          setErrorMessage("");
          setProfileImage("");
          setNewFieldValues({
            expertise: "",
            skills: "",
          });
        }}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        Create Mentor Profile
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Alert Messages */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Modal Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        {/* Contact Information */}
        <div>
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-800">
            Contact Information
          </h3>

          {/* Divider */}
          <hr className="bg-blue-500 h-[3px] my-2" />

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email */}
            <div>
              <label className="font-medium text-sm mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="e.g. Psazzadul@gmail.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-medium text-sm mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country={"bd"}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-md"
                inputStyle={{ width: "100%", height: "40px" }}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="font-medium text-sm mb-1">
                LinkedIn <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                {...register("linkedin")}
                className="input input-bordered w-full bg-white text-black border-black"
                placeholder="e.g. linkedin.com/in/Adam"
              />
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div className="mb-3">
          {/* Label */}
          <label
            htmlFor="expertise-input"
            className="block font-semibold text-sm mb-2 capitalize"
          >
            Expertise
          </label>

          {/* Expertise Fields */}
          <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3 px-2 py-2">
            {expertiseFields.length > 0 ? (
              expertiseFields.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => removeExpertise(index)}
                  className="flex items-center border border-gray-600 font-semibold text-gray-800 gap-2 px-5 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-200 text-sm"
                >
                  {item.value || `Expertise #${index + 1}`} <RxCross2 />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm px-5 py-2">
                No Expertise added yet.
              </p>
            )}
          </div>

          {/* Add New Expertise */}
          <div className="flex justify-end gap-2">
            {/* Input */}
            <input
              id="expertise-input"
              type="text"
              value={newFieldValues.expertise}
              onChange={(e) =>
                setNewFieldValues((prev) => ({
                  ...prev,
                  expertise: e.target.value,
                }))
              }
              placeholder="Add new expertise"
              className="input input-bordered bg-white text-black border-black w-3/7"
            />

            {/* Add Button */}
            <button
              type="button"
              onClick={() => {
                const value = newFieldValues.expertise.trim();
                if (value) {
                  appendExpertise({ value }); // must be object
                  setNewFieldValues((prev) => ({ ...prev, expertise: "" }));
                }
              }}
              className="flex items-center gap-2 border border-blue-600 font-semibold text-blue-600 rounded shadow-xl hover:shadow-2xl px-5 py-1 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-500"
            >
              Add
            </button>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-3">
          {/* Label */}
          <label
            htmlFor="skills-input"
            className="block font-semibold text-sm mb-2 capitalize"
          >
            Skills
          </label>

          {/* Skills Fields */}
          <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3 px-2 py-2">
            {skillsFields.length > 0 ? (
              skillsFields.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => removeSkills(index)}
                  className="flex items-center border border-gray-600 font-semibold text-gray-800 gap-2 px-5 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-200 text-sm"
                >
                  {item.value || `Skill #${index + 1}`} <RxCross2 />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm px-5 py-2">
                No Skills added yet.
              </p>
            )}
          </div>

          {/* Add New Skill */}
          <div className="flex justify-end gap-2">
            {/* Input */}
            <input
              id="skills-input"
              type="text"
              value={newFieldValues.skills}
              onChange={(e) =>
                setNewFieldValues((prev) => ({
                  ...prev,
                  skills: e.target.value,
                }))
              }
              placeholder="Add new skills"
              className="input input-bordered bg-white text-black border-black w-3/7"
            />

            {/* Add Button */}
            <button
              type="button"
              onClick={() => {
                const value = newFieldValues.skills.trim();
                if (value) {
                  appendSkills({ value }); // must be object
                  setNewFieldValues((prev) => ({ ...prev, skills: "" }));
                }
              }}
              className="flex items-center gap-2 border border-blue-600 font-semibold text-blue-600 rounded shadow-xl hover:shadow-2xl px-5 py-1 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-500"
            >
              Add
            </button>
          </div>
        </div>

        {/* Biography */}
        <div>
          <label className="font-medium text-sm mb-1">Biography</label>
          <textarea
            {...register("biography")}
            className="textarea textarea-bordered w-full bg-white text-black border-black"
            placeholder="Describe your Biography"
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
          {loading ? "Creating..." : "Create Mentor Profile"}
        </button>
      </form>
    </div>
  );
};

// Prop Validation
CreateMentorProfileModal.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default CreateMentorProfileModal;
