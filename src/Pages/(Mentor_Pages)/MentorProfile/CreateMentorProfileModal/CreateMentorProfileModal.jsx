import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";
import { QueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import TagInput from "../../../../Shared/TagInput/TagInput";
import FormInput from "../../../../Shared/FormInput/FormInput";

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
  const [setNewFieldValues] = useState({
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

  // Close Modal
  const handleClose = () => {
    document.getElementById("Create_Mentor_Profile_Modal").close();

    // Reset States
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
  };

  // Form Submission
  const onSubmit = async (data) => {
    // Loading & Error Message Reinstate
    setLoading(true);
    setErrorMessage("");

    // Image Upload URL
    let uploadedImageUrl = null;

    // Image Upload
    try {
      // Image Upload
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
          email: data.email,
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

      // Close Modal
      handleClose();

      // Automatically refetch MentorData everywhere
      QueryClient.invalidateQueries(["MentorData"]);

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
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Create_Mentor_Profile_Modal"
      className="modal-box min-w-4xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={handleClose}
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
        <div className="flex w-full gap-3">
          {/* Avatar Section */}
          <div className="w-1/3 p-2">
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
          <div className="w-2/3 space-y-3 py-2 pl-3 border-l border-gray-300">
            {/* Name */}
            <FormInput
              label="Name"
              required
              placeholder="My Name"
              register={register("name", { required: true })}
              error={errors.name}
            />

            {/* Industries */}
            <FormInput
              label="Industries"
              required
              placeholder="Your position"
              register={register("position", { required: true })}
              error={errors.position}
            />
          </div>
        </div>

        {/* Description */}
        <FormInput
          label="Description"
          required
          rows={4}
          as="textarea"
          placeholder="Describe Your Self ......"
          register={register("description", { required: true })}
          error={errors.position}
        />

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
            <FormInput
              label="Email"
              type="email"
              required
              placeholder="YourEmail@example.com"
              register={register("email", { required: true })}
              error={errors.email}
            />

            {/* Phone */}
            <div>
              <label className="font-medium text-sm mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country={"bd"}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                inputStyle={{ width: "100%", height: "40px" }}
              />
            </div>

            {/* LinkedIn */}
            <FormInput
              label="LinkedIn"
              type="url"
              required
              placeholder="Your LinkedIn URL"
              register={register("linkedin", { required: true })}
              error={errors.linkedin}
            />
          </div>
        </div>

        {/* Expertise */}
        <TagInput
          label="Expertise"
          items={expertiseFields}
          appendItem={appendExpertise}
          removeItem={removeExpertise}
          placeholder="Add new expertise"
          showNumbers={false}
        />

        {/* Expertise */}
        <TagInput
          label="Skills"
          items={skillsFields}
          appendItem={appendSkills}
          removeItem={removeSkills}
          placeholder="Add new Skills"
          showNumbers={false}
        />

        {/* Biography */}
        <FormInput
          label="Biography"
          rows={4}
          as="textarea"
          placeholder="Make a Biography ......"
          register={register("biography")}
          error={errors.position}
        />

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
