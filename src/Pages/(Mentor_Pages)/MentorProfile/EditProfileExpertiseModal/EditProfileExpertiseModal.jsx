import { useState, useEffect } from "react";

// Packages
import PropTypes from "prop-types";
import { useForm, useFieldArray } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import TagInput from "../../../../Shared/TagInput/TagInput";

const EditProfileExpertiseModal = ({ MentorData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize react-hook-form
  const { reset, control, handleSubmit } = useForm({
    defaultValues: {
      expertise: MentorData?.expertise?.map((e) => ({ value: e })) || [],
      skills: MentorData?.skills?.map((s) => ({ value: s })) || [],
    },
  });

  // Reset whenever MentorData changes
  useEffect(() => {
    if (MentorData) {
      reset({
        expertise: MentorData?.expertise?.map((e) => ({ value: e })) || [],
        skills: MentorData?.skills?.map((s) => ({ value: s })) || [],
      });
    }
  }, [MentorData, reset]);

  //  Expertise Field Arrays
  const {
    fields: expertiseFields,
    append: appendExpertise,
    remove: removeExpertise,
  } = useFieldArray({ control, name: "expertise" });

  //  Skills Field Arrays
  const {
    fields: skillsFields,
    append: appendSkills,
    remove: removeSkills,
  } = useFieldArray({ control, name: "skills" });

  // Close modal
  const handleClose = () => {
    document.getElementById("Edit_Profile_Expertise")?.close();
    setErrorMessage("");
    setLoading(false);
    refetch();
  };

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    // Prepare payload and send to server
    try {
      // Prepare payload
      const payload = {
        expertise: data.expertise.map((e) => e.value),
        skills: data.skills.map((s) => s.value),
      };

      // Send PUT request
      await axiosPublic.put(`/Mentors/${MentorData._id}`, payload);

      // On success
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error updating expertise:", error);
      setErrorMessage("Failed to update expertise. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Edit_Profile_Expertise"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
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
        Edit Profile Expertise & Skills
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Server error message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow ${
            loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Updating..." : "Update Expertise & Skills"}
        </button>
      </form>
    </div>
  );
};

// Prop Validation
EditProfileExpertiseModal.propTypes = {
  MentorData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    expertise: PropTypes.arrayOf(PropTypes.string),
    skills: PropTypes.arrayOf(PropTypes.string),
  }),
  refetch: PropTypes.func.isRequired,
};

export default EditProfileExpertiseModal;
