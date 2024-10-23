/* eslint-disable react/prop-types */
import { useContext, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import Swal from "sweetalert2";

const ModalNewCourse = ({ refetch }) => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      batches: [{ batchName: "", batchDate: "", batchDetails: "" }],
      prerequisites: [""],
      learningOutcomes: [""],
      schedule: [{ week: "", topic: "", scheduleDetails: "" }],
      assessments: [""],
      targetAudience: [""],
    },
  });

  // Field arrays setup
  const {
    fields: fieldsBatches,
    append: appendBatches,
    remove: removeBatches,
  } = useFieldArray({
    control,
    name: "batches",
  });

  const {
    fields: fieldsPrerequisites,
    append: appendPrerequisites,
    remove: removePrerequisites,
  } = useFieldArray({
    control,
    name: "prerequisites",
  });

  const {
    fields: fieldsLearningOutcomes,
    append: appendLearningOutcomes,
    remove: removeLearningOutcomes,
  } = useFieldArray({
    control,
    name: "learningOutcomes",
  });

  const {
    fields: fieldsSchedule,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: "schedule",
  });

  const {
    fields: fieldsAssessments,
    append: appendAssessments,
    remove: removeAssessments,
  } = useFieldArray({
    control,
    name: "assessments",
  });

  const {
    fields: fieldsTargetAudience,
    append: appendTargetAudience,
    remove: removeTargetAudience,
  } = useFieldArray({
    control,
    name: "targetAudience",
  });

  useEffect(() => {
    if (fieldsBatches.length === 0) {
      appendBatches({ batchName: "", batchDate: "", batchDetails: "" });
    }
    if (fieldsPrerequisites.length === 0) {
      appendPrerequisites("");
    }
    if (fieldsLearningOutcomes.length === 0) {
      appendLearningOutcomes("");
    }
    if (fieldsSchedule.length === 0) {
      appendSchedule({ week: "", topic: "", scheduleDetails: "" });
    }
    if (fieldsAssessments.length === 0) {
      appendAssessments("");
    }
    if (fieldsTargetAudience.length === 0) {
      appendTargetAudience("");
    }
  }, [
    fieldsBatches,
    appendBatches,
    fieldsPrerequisites,
    appendPrerequisites,
    fieldsLearningOutcomes,
    appendLearningOutcomes,
    fieldsSchedule,
    appendSchedule,
    fieldsAssessments,
    appendAssessments,
    fieldsTargetAudience,
    appendTargetAudience,
  ]);

  const onSubmit = async (data) => {
    const structuredData = {
      courseTitle: data.courseTitle,
      instructor: data.instructor,
      duration: data.duration,
      level: data.level,
      postedBy: user.email,
      description: data.description,
      format: data.format,
      batches: data.batches, // Assuming it's an array of objects
      prerequisites: data.prerequisites, // Assuming it's an array
      learningOutcomes: data.learningOutcomes, // Assuming it's an array
      schedule: data.schedule, // Assuming it's an array of objects
      assessments: data.assessments, // Assuming it's an array
      targetAudience: data.targetAudience, // Assuming it's an array
      certification: data.certification,
      support: {
        officeHours: data.officeHours,
        discussionForum: data.discussionForum,
        emailSupport: data.emailSupport,
        careerGuidance: data.careerGuidance,
      },
      applicants: [], // Empty array for now
    };

    try {
      // Sending POST request
      const response = await axiosPublic.post("/Courses", structuredData);

      if (response.data.insertedId) {
        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Course has been created successfully!",
          icon: "success",
          button: "OK",
        });
      }
      document.getElementById("Create_New_Course").close();
      refetch();
    } catch (error) {
      console.error("Error creating course:", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to create the course. Please try again.",
        icon: "error",
        button: "OK",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white">
        <p className="text-xl">Create New Course</p>
        <button
          onClick={() => document.getElementById("Create_New_Course").close()}
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        {/* Course Title */}
        <FormInput
          label="Course Title"
          register={register("courseTitle", {
            required: "Course Title is required",
          })}
          errors={errors.courseTitle}
          placeholder="Enter Course Title"
        />

        {/* Instructor */}
        <FormInput
          label="Instructor"
          register={register("instructor", {
            required: "Instructor is required",
          })}
          errors={errors.instructor}
          placeholder="Enter Instructor Name"
        />

        {/* Duration */}
        <FormInput
          label="Duration"
          register={register("duration", { required: "Duration is required" })}
          errors={errors.duration}
          placeholder="Enter Duration in weeks"
        />

        {/* Level */}
        <FormInput
          label="Level"
          register={register("level", { required: "Level is required" })}
          errors={errors.level}
          placeholder="Enter Level"
        />

        {/* Description */}
        <FormInput
          label="Description"
          type="textarea"
          register={register("description", { required: true })}
          placeholder="Enter Description"
        />

        {/* Format */}
        <FormInput
          label="Format"
          register={register("format", { required: "Format is required" })}
          errors={errors.format}
          placeholder="Enter Format"
        />

        {/* Batches */}
        <div className="space-y-2 border border-gray-300 p-3">
          <label className="font-bold text-xl">Batches:</label>
          {fieldsBatches.map((item, index) => (
            <div key={item.id} className="flex flex-col md:flex-row">
              {/* Batch Name */}
              <input
                className="input input-bordered w-full bg-white border-black rounded-none"
                {...register(`batches.${index}.batchName`)}
                type="text"
                placeholder="Batch Name"
                defaultValue={item.batchname}
              />
              {/* Batch Date */}
              <input
                className="input input-bordered w-full bg-white border-black rounded-none"
                {...register(`batches.${index}.batchDate`)}
                type="date"
                placeholder="Date"
                defaultValue={item.date}
              />
              {/* Batch Details */}
              <input
                className="input input-bordered w-full bg-white border-black rounded-none"
                {...register(`batches.${index}.batchDetails`)}
                type="text"
                placeholder="Details"
                defaultValue={item.details}
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
                onClick={() => removeBatches(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-5"
            onClick={() =>
              appendBatches({ batchName: "", batchDate: "", batchDetails: "" })
            }
          >
            Add Batches
          </button>
          {errors.batches && (
            <span className="text-red-500">{errors.batches.message}</span>
          )}
        </div>

        {/* Prerequisites */}
        <DynamicFieldList
          label="Prerequisites"
          fields={fieldsPrerequisites}
          register={register}
          remove={removePrerequisites}
          append={appendPrerequisites}
          fieldName="prerequisites"
          placeholder="Enter Prerequisites"
          errors={errors.prerequisites}
        />

        {/* Learning Outcomes */}
        <DynamicFieldList
          label="Learning Outcomes"
          fields={fieldsLearningOutcomes}
          register={register}
          remove={removeLearningOutcomes}
          append={appendLearningOutcomes}
          fieldName="learningOutcomes"
          placeholder="Enter Learning Outcome"
          errors={errors.learningOutcomes}
        />

        {/* Schedule */}
        <div className="space-y-2 border border-gray-300 p-3">
          <label className="font-bold text-xl">Schedule:</label>
          {fieldsSchedule.map((item, index) => (
            <div key={item.id} className="flex flex-col md:flex-row">
              {/* Week */}
              <input
                className="input input-bordered bg-white p-2 border-black rounded-none md:w-[50px]"
                {...register(`schedule.${index}.week`)}
                type="number"
                placeholder="Week"
              />
              {/* Topic */}
              <input
                className="input input-bordered bg-white border-black rounded-none md:w-[250px]"
                {...register(`schedule.${index}.topic`)}
                type="text"
                placeholder="Topic"
                defaultValue={item.topic}
              />
              {/* Schedule Details */}
              <input
                className="input input-bordered bg-white border-black rounded-none md:w-[350px]"
                {...register(`schedule.${index}.scheduleDetails`)}
                type="text"
                placeholder="Schedule Details"
                defaultValue={item.scheduleDetails}
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
                onClick={() => removeSchedule(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-5"
            onClick={() =>
              appendSchedule({ week: "", topic: "", scheduleDetails: "" })
            }
          >
            Add Schedule
          </button>
          {errors.schedule && (
            <span className="text-red-500">{errors.schedule.message}</span>
          )}
        </div>

        {/* Assessments */}
        <DynamicFieldList
          label="Assessments"
          fields={fieldsAssessments}
          register={register}
          remove={removeAssessments}
          append={appendAssessments}
          fieldName="assessments"
          placeholder="Enter Assessments"
          errors={errors.assessments}
        />

        {/* Target Audience */}
        <DynamicFieldList
          label="Target Audience"
          fields={fieldsTargetAudience}
          register={register}
          remove={removeTargetAudience}
          append={appendTargetAudience}
          fieldName="targetAudience"
          placeholder="Enter Target Audience"
          errors={errors.targetAudience}
        />

        {/* Certification */}
        <FormInput
          label="Certification"
          register={register("certification", {
            required: "Certification is required",
          })}
          errors={errors.certification}
          placeholder="Enter Certification"
        />

        <p className="text-xl font-bold text-center">Support</p>

        {/* Office Hours */}
        <FormInput
          label="Office Hours"
          register={register("officeHours", {
            required: "Office Hours is required",
          })}
          errors={errors.officeHours}
          placeholder="Enter Office Hours"
        />

        {/* discussion Forum */}
        <FormInput
          label="discussion Forum"
          register={register("discussionForum", {
            required: "discussion Forum is required",
          })}
          errors={errors.discussionForum}
          placeholder="Enter discussion Forum"
        />

        {/* Email Support */}
        <FormInput
          label="Email Support"
          register={register("emailSupport", {
            required: "Email Support is required",
          })}
          errors={errors.emailSupport}
          placeholder="Enter Email Support"
        />

        {/* Career Guidance */}
        <FormInput
          label="Career Guidance"
          register={register("careerGuidance", {
            required: "Career Guidance is required",
          })}
          errors={errors.careerGuidance}
          placeholder="Enter Career Guidance"
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 font-bold text-white px-5 py-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable FormInput component
const FormInput = ({ label, type = "text", register, errors, placeholder }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2">
    <label className="font-bold w-48 text-xl">{label}:</label>
    {type === "textarea" ? (
      <textarea
        className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36 text-lg"
        {...register}
        placeholder={placeholder}
      />
    ) : (
      <input
        className="input input-bordered w-full bg-white border-black rounded-none"
        type={type}
        {...register}
        placeholder={placeholder}
      />
    )}
    {errors && <span className="text-red-500">{errors.message}</span>}
  </div>
);

// Reusable DynamicFieldList component
const DynamicFieldList = ({
  label,
  fields,
  register,
  remove,
  append,
  fieldName,
  placeholder,
  errors,
}) => (
  <div className="border border-gray-300 p-3">
    <label className="font-bold w-48 text-xl">{label}</label>
    {fields.map((item, index) => (
      <div key={item.id} className="flex flex-col md:flex-row mb-1">
        <input
          className="input input-bordered w-full bg-white border-black rounded-none"
          {...register(`${fieldName}.${index}`)}
          defaultValue={item}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
          onClick={() => remove(index)}
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-5"
      onClick={() => append("")}
    >
      Add {label}
    </button>
    {errors && errors[fieldName] && (
      <span className="text-red-500">{errors[fieldName].message}</span>
    )}
  </div>
);

export default ModalNewCourse;
