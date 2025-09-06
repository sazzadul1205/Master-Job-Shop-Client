import { useState, useEffect } from "react";

// Packages
import PropTypes from "prop-types";
import { useForm, useFieldArray } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const EditProfileExpertiseModal = ({ MentorData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newFieldValues, setNewFieldValues] = useState({
    expertise: "",
    skills: "",
  });

  // Initialize react-hook-form
  const { reset, control, register, handleSubmit } = useForm({
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
      // On error
      console.error("Error updating expertise:", error);
      setErrorMessage("Failed to update expertise. Please try again.");
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
      <h3 className="font-bold text-2xl mb-4 text-center">
        Edit Profile Expertise
      </h3>

      {/* Server error message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Expertise */}
        <div className="mb-3">
          {/* Label */}
          <label className="block font-semibold text-sm mb-2 capitalize">
            Expertise
          </label>

          {/* Expertise fields */}
          <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3 px-2 py-2">
            {expertiseFields.length > 0 ? (
              expertiseFields.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => removeExpertise(index)}
                  className="flex items-center border border-gray-600 font-semibold text-gray-800 gap-2 px-5 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-200 text-sm"
                >
                  <input
                    type="hidden"
                    {...register(`expertise.${index}.value`)}
                  />
                  {item.value} <RxCross2 />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm px-5 py-2">
                No Expertise added yet.
              </p>
            )}
          </div>

          {/* Add new expertise */}
          <div className="flex justify-end gap-2">
            {/* Input */}
            <input
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

            {/* Add button */}
            <button
              type="button"
              onClick={() => {
                const value = newFieldValues.expertise.trim();
                if (value) {
                  appendExpertise({ value });
                  setNewFieldValues((prev) => ({ ...prev, expertise: "" }));
                }
              }}
              className="flex items-center gap-2 border border-blue-600 font-semibold text-blue-600 rounded shadow px-5 py-1 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-3">
          {/* Label */}
          <label className="block font-semibold text-sm mb-2 capitalize">
            Skills
          </label>

          {/* Skills fields */}
          <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3 px-2 py-2">
            {skillsFields.length > 0 ? (
              skillsFields.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => removeSkills(index)}
                  className="flex items-center border border-gray-600 font-semibold text-gray-800 gap-2 px-5 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-200 text-sm"
                >
                  <input type="hidden" {...register(`skills.${index}.value`)} />
                  {item.value} <RxCross2 />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm px-5 py-2">
                No Skills added yet.
              </p>
            )}
          </div>

          {/* Add new skill */}
          <div className="flex justify-end gap-2">
            {/* Input */}
            <input
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

            {/* Add button */}
            <button
              type="button"
              onClick={() => {
                const value = newFieldValues.skills.trim();
                if (value) {
                  appendSkills({ value });
                  setNewFieldValues((prev) => ({ ...prev, skills: "" }));
                }
              }}
              className="flex items-center gap-2 border border-blue-600 font-semibold text-blue-600 rounded shadow px-5 py-1 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
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
          {loading ? "Updating..." : "Update Expertise"}
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
