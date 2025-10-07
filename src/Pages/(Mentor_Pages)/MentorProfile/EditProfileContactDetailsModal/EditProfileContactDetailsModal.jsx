import { useEffect, useState } from "react";

// Packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import PhoneInput from "react-phone-input-2";
import FormInput from "../../../../Shared/FormInput/FormInput";

const EditProfileContactDetailsModal = ({ MentorData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(
    MentorData?.contact?.phone || ""
  );

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: MentorData?.contact?.email || "",
      linkedin: MentorData?.contact?.linkedin || "",
    },
  });

  // Reset form whenever MentorData changes
  useEffect(() => {
    if (MentorData) {
      reset({
        email: MentorData?.contact?.email || "",
        linkedin: MentorData?.contact?.linkedin || "",
      });
      setPhoneNumber(MentorData?.contact?.phone || "");
    }
  }, [MentorData, reset]);

  // Close modal, reset form, clear errors and refetch
  const handleClose = () => {
    document.getElementById("Edit_Profile_Contact_Details")?.close();
    setErrorMessage("");
    setLoading(false);
    refetch();
  };

  // Form submit handler - updates contact details
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    const payload = {
      contact: {
        email: data.email,
        phone: phoneNumber,
        linkedin: data.linkedin,
      },
    };

    // Prepare payload
    try {
      // Send PUT request
      await axiosPublic.put(`/Mentors/${MentorData._id}`, payload);

      setLoading(false);
      handleClose();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update contact details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Edit_Profile_Contact_Details"
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
      <h3 className="font-bold text-xl text-center mb-4">
        Edit Profile Contact Details
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Server error message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Contact Details Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            country="bd"
            value={phoneNumber}
            onChange={setPhoneNumber}
            inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-md"
            inputStyle={{ width: "100%", height: "40px" }}
          />
          {!phoneNumber && (
            <p className="text-red-500 text-sm">Phone is required</p>
          )}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow ${
            loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Updating..." : "Update Contact Details"}
        </button>
      </form>
    </div>
  );
};

EditProfileContactDetailsModal.propTypes = {
  MentorData: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default EditProfileContactDetailsModal;
