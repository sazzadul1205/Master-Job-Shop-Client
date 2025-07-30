import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Icons
import { FaPlus, FaTimes } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const ProfileSkills = ({ user }) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState(user?.skills || []);

  // Add Skill Handler
  const handleAddSkill = async () => {
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;

    // Optimistic update
    const previousSkills = [...skills];
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill("");

    try {
      await axiosPublic.put(`/Users/AddSkill/${user._id}`, { skill: trimmed });
    } catch (err) {
      // Revert on error
      setSkills(previousSkills);
      // Add Skill
      Swal.fire({
        icon: "error",
        title: "Failed to add skill",
        text: err.response?.data?.message || "An error occurred.",
      });
      console.error("Add skill error:", err);
    }
  };

  // Remove Skill Handler
  const handleRemoveSkill = async (skillToRemove) => {
    // Optimistic update
    const previousSkills = [...skills];
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));

    try {
      await axiosPublic.delete(`/Users/DeleteSkill/${user._id}`, {
        data: { skill: skillToRemove },
      });
    } catch (err) {
      // Revert on error
      setSkills(previousSkills);
      // Remove Skill
      Swal.fire({
        icon: "error",
        title: "Failed to remove skill",
        text: err.response?.data?.message || "An error occurred.",
      });
      console.error("Remove skill error:", err);
    }
  };

  // Handle Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 max-w-7xl mx-auto mt-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Skills & Expertise
      </h2>

      {/* Skill list */}
      {skills.length > 0 ? (
        // Display skills if any
        <div className="flex flex-wrap gap-3 mb-4">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              onClick={() => handleRemoveSkill(skill)}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm border border-blue-300 cursor-pointer"
            >
              <span className="font-medium">{skill}</span>
              <button
                className="hover:text-red-600 cursor-pointer"
                title="Remove skill"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Fallback when no skills
        <div className="flex items-center gap-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 mb-4">
          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {/* Content */}
          <div>
            {/* Text */}
            <p className="text-gray-700 font-semibold mb-1">
              No skills added yet
            </p>

            {/* Description */}
            <p className="text-sm text-gray-500">
              Showcase your technical expertise. Add relevant skills to stand
              out to employers.
            </p>
          </div>
        </div>
      )}

      {/* Add new skill */}
      <div className="flex gap-2 justify-end">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new skill..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-sm text-black"
        />
        <button
          onClick={handleAddSkill}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Add Skill
        </button>
      </div>
    </div>
  );
};

// Prop Validation
ProfileSkills.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ProfileSkills;
