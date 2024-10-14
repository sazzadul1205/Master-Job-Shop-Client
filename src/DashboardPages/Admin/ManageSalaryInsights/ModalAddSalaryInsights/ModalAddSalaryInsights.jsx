import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalAddSalaryInsights = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formattedData = {
      jobTitle: data.jobTitle,
      postedBy: user.email,
      averageSalary: `${data.globalSalaryRange.US} USD/year`,
      globalSalaryRange: {
        US: data.globalSalaryRange.US,
        UK: data.globalSalaryRange.UK,
        EU: data.globalSalaryRange.EU,
        India: data.globalSalaryRange.India,
      },
      experienceLevel: data.experienceLevel,
      jobType: data.jobType,
      skillsRequired: data.skillsRequired,
      education: data.education,
      responsibilities: data.responsibilities,
      typicalChallenges: data.typicalChallenges,
      careerPath: data.careerPath,
      commonCertifications: data.commonCertifications,
      potentialIndustries: data.potentialIndustries,
      toolsAndTechnologies: data.toolsAndTechnologies,
      softSkills: data.softSkills,
    };

    try {
      const response = await axiosPublic.post("/Salary-Insight", formattedData);
      console.log(response.data);

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Salary Insights Added",
        text: "Your salary insight has been successfully posted!",
      });

      // Close the modal
      document.getElementById("Create_New_Salary_Insights").close();
      refetch();
      reset();
    } catch (error) {
      console.error("Error submitting data", error);

      // Error Alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while posting the salary insight.",
      });
    }
  };

  const renderFieldArray = (
    fields,
    registerFn,
    removeFn,
    addFn,
    label,
    name
  ) => (
    <div className="mb-3">
      <label className="font-bold ">{label}</label>
      {fields.map((item, index) => (
        <div key={item.id} className="flex space-x-2 mt-1">
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            {...registerFn(`${name}.${index}`)}
            defaultValue={item}
            placeholder={`Enter ${label.toLowerCase().slice(0, -1)}`}
          />
          <button
            type="button"
            className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
            onClick={() => removeFn(index)}
          >
            Remove
          </button>
        </div>
      ))}
      {fields.length === 0 && addFn("")}
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-2"
        onClick={() => addFn("")}
      >
        Add {label.slice(0, -1)}
      </button>
    </div>
  );

  // Dynamic input fields
  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: "skillsRequired" });
  const {
    fields: responsibilitiesFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({ control, name: "responsibilities" });
  const {
    fields: challengesFields,
    append: appendChallenge,
    remove: removeChallenge,
  } = useFieldArray({ control, name: "typicalChallenges" });
  const {
    fields: careerPathFields,
    append: appendCareerPath,
    remove: removeCareerPath,
  } = useFieldArray({ control, name: "careerPath" });
  const {
    fields: certificationsFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({ control, name: "commonCertifications" });
  const {
    fields: industriesFields,
    append: appendIndustry,
    remove: removeIndustry,
  } = useFieldArray({ control, name: "potentialIndustries" });
  const {
    fields: toolsFields,
    append: appendTool,
    remove: removeTool,
  } = useFieldArray({ control, name: "toolsAndTechnologies" });
  const {
    fields: softSkillsFields,
    append: appendSoftSkill,
    remove: removeSoftSkill,
  } = useFieldArray({ control, name: "softSkills" });

  return (
    <div className="modal-box bg-white max-w-[800px] p-0">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p>Add New Salary Insights</p>
        <button
          onClick={() =>
            document.getElementById("Create_New_Salary_Insights").close()
          }
        >
          <ImCross className="hover:text-black font-bold" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5">
        {/* Job Title */}
        <div className="mb-4">
          <label className="block text-black font-bold">Job Title:</label>
          <input
            type="text"
            {...register("jobTitle", { required: "Job Title is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.jobTitle ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.jobTitle && (
            <span className="text-red-500">{errors.jobTitle.message}</span>
          )}
        </div>

        {/* Job Type */}
        <div className="mb-4">
          <label className="block text-black font-bold">Job Type:</label>
          <input
            type="text"
            {...register("jobType", {
              required: "Job Type is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.jobType ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.jobType && (
            <span className="text-red-500">{errors.jobType.message}</span>
          )}
        </div>

        {/* Experience Level */}
        <div className="mb-4">
          <label className="block text-black font-bold">
            Experience Level:
          </label>
          <input
            type="text"
            {...register("experienceLevel", {
              required: "Experience Level is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.experienceLevel ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.experienceLevel && (
            <span className="text-red-500">
              {errors.experienceLevel.message}
            </span>
          )}
        </div>

        {/* Education */}
        <div className="mb-4">
          <label className="block text-black font-bold">Education:</label>
          <input
            type="text"
            {...register("education", {
              required: "Education is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.education ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.education && (
            <span className="text-red-500">{errors.education.message}</span>
          )}
        </div>

        {/* Global Salary Range */}
        <div className="mb-4">
          <label className="block text-black font-bold">
            Global Salary Range:
          </label>

          <div className="flex space-x-2 mt-2">
            <div className="w-1/2">
              <label className="block text-black">US:</label>
              <input
                type="text"
                {...register("globalSalaryRange.US")}
                placeholder="e.g. 120,000 - 150,000 USD/year"
                className="border p-2 w-full mt-2 bg-white border-gray-300"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-black">UK:</label>
              <input
                type="text"
                {...register("globalSalaryRange.UK")}
                placeholder="e.g. 80,000 - 100,000 GBP/year"
                className="border p-2 w-full mt-2 bg-white border-gray-300"
              />
            </div>
          </div>

          <div className="flex space-x-2 mt-2">
            <div className="w-1/2">
              <label className="block text-black">EU:</label>
              <input
                type="text"
                {...register("globalSalaryRange.EU")}
                placeholder="e.g. 90,000 - 110,000 EUR/year"
                className="border p-2 w-full mt-2 bg-white border-gray-300"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-black">India:</label>
              <input
                type="text"
                {...register("globalSalaryRange.India")}
                placeholder="e.g. 15,00,000 - 20,00,000 INR/year"
                className="border p-2 w-full mt-2 bg-white border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Skills Required */}
        {renderFieldArray(
          skillsFields,
          register,
          removeSkill,
          appendSkill,
          "Skills Required",
          "skillsRequired"
        )}

        {/* Responsibilities */}
        {renderFieldArray(
          responsibilitiesFields,
          register,
          removeResponsibility,
          appendResponsibility,
          "Responsibilities",
          "responsibilities"
        )}

        {/* Typical Challenges */}
        {renderFieldArray(
          challengesFields,
          register,
          removeChallenge,
          appendChallenge,
          "Typical Challenges",
          "typicalChallenges"
        )}

        {/* Career Path */}
        {renderFieldArray(
          careerPathFields,
          register,
          removeCareerPath,
          appendCareerPath,
          "Career Path",
          "careerPath"
        )}

        {/* Common Certifications */}
        {renderFieldArray(
          certificationsFields,
          register,
          removeCertification,
          appendCertification,
          "Common Certifications",
          "commonCertifications"
        )}

        {/* Potential Industries */}
        {renderFieldArray(
          industriesFields,
          register,
          removeIndustry,
          appendIndustry,
          "Potential Industries",
          "potentialIndustries"
        )}

        {/* Tools and Technologies */}
        {renderFieldArray(
          toolsFields,
          register,
          removeTool,
          appendTool,
          "Tools and Technologies",
          "toolsAndTechnologies"
        )}

        {/* Soft Skills */}
        {renderFieldArray(
          softSkillsFields,
          register,
          removeSoftSkill,
          appendSoftSkill,
          "Soft Skills",
          "softSkills"
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-14"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalAddSalaryInsights;

// PropTypes validation
ModalAddSalaryInsights.propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    refetch: PropTypes.func.isRequired, // Add refetch to prop types
  };
  