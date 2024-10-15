import { ImCross } from "react-icons/im";
import { useForm, useFieldArray } from "react-hook-form";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalAddCourses = ({ refetch }) => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      batches: [{ batchName: "", batchDate: "", batchDetails: "" }],
      schedule: [{ week: "", topic: "", scheduleDetails: "" }],
      prerequisites: [""],
      learningOutcomes: [""],
      assessments: [""],
      targetAudience: [""],
    },
  });

  // Field Arrays
  const {
    fields: batchFields,
    append: appendBatch,
    remove: removeBatch,
  } = useFieldArray({
    control,
    name: "batches",
  });

  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: "schedule",
  });

  const {
    fields: prerequisiteFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({
    control,
    name: "prerequisites",
  });

  const {
    fields: learningOutcomeFields,
    append: appendLearningOutcome,
    remove: removeLearningOutcome,
  } = useFieldArray({
    control,
    name: "learningOutcomes",
  });

  const {
    fields: assessmentFields,
    append: appendAssessment,
    remove: removeAssessment,
  } = useFieldArray({
    control,
    name: "assessments",
  });

  const {
    fields: targetAudienceFields,
    append: appendTargetAudience,
    remove: removeTargetAudience,
  } = useFieldArray({
    control,
    name: "targetAudience",
  });

  // Handlers for removing batch and schedule
  const handleRemoveBatch = (index) => {
    removeBatch(index);
    if (batchFields.length === 1) {
      appendBatch({ batchName: "", batchDate: "", batchDetails: "" });
    }
  };

  const handleRemoveSchedule = (index) => {
    removeSchedule(index);
    if (scheduleFields.length === 1) {
      appendSchedule({ week: "", topic: "", scheduleDetails: "" });
    }
  };

  // Batch Fields Rendering
  const renderBatchFields = () => (
    <div className="mb-3">
      <div className="border-b-2 border-black">
        <p className="font-bold py-3">Batches</p>
      </div>
      {batchFields.map((item, index) => (
        <div
          key={item.id}
          className="space-y-3 mb-4 pt-3 border border-gray-300 p-5"
        >
          <div className="flex items-center">
            <p className="font-bold w-28">Batch Name:</p>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none"
              {...register(`batches.${index}.batchName`)}
              placeholder="Enter batch name"
            />
          </div>
          <div className="flex items-center">
            <p className="font-bold w-28">Batch Date:</p>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none"
              {...register(`batches.${index}.batchDate`)}
              placeholder="Enter batch date"
            />
          </div>
          <div className="flex">
            <p className="font-bold w-28">Batch Details:</p>
            <textarea
              className="input input-bordered w-full bg-white border-black rounded-none p-2 h-32"
              {...register(`batches.${index}.batchDetails`)}
              placeholder="Enter batch details"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
              onClick={() => handleRemoveBatch(index)}
            >
              Remove Batch
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-2"
        onClick={() =>
          appendBatch({ batchName: "", batchDate: "", batchDetails: "" })
        }
      >
        Add Batch
      </button>
    </div>
  );

  // Schedule Fields Rendering
  const renderScheduleFields = () => (
    <div className="mb-3">
      <div className="border-b-2 border-black">
        <p className="font-bold py-3">Schedule</p>
      </div>
      {scheduleFields.map((item, index) => (
        <div
          key={item.id}
          className="space-y-2 mb-4 pt-3 border border-gray-300 p-5"
        >
          <div className="flex items-center">
            <p className="font-bold w-36">Week:</p>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none"
              {...register(`schedule.${index}.week`)}
              placeholder="Enter week"
            />
          </div>
          <div className="flex items-center">
            <p className="font-bold w-36">Topic:</p>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none"
              {...register(`schedule.${index}.topic`)}
              placeholder="Enter topic"
            />
          </div>
          <div className="flex">
            <p className="font-bold w-36">Schedule Details:</p>
            <textarea
              className="input input-bordered w-full bg-white border-black rounded-none p-2 h-32"
              {...register(`schedule.${index}.scheduleDetails`)}
              placeholder="Enter schedule details"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
              onClick={() => handleRemoveSchedule(index)}
            >
              Remove Schedule
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-2"
        onClick={() =>
          appendSchedule({ week: "", topic: "", scheduleDetails: "" })
        }
      >
        Add Schedule
      </button>
    </div>
  );

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

  const onSubmit = async (data) => {
    const formattedData = {
      courseTitle: data.courseTitle,
      instructor: data.instructor,
      duration: data.duration,
      postedBy: user.email,
      level: data.level,
      description: data.description,
      format: data.format,
      batches: data.batches.map((batch) => ({
        batchName: batch.batchName,
        batchDate: batch.batchDate,
        batchDetails: batch.batchDetails,
      })),
      prerequisites: data.prerequisites,
      learningOutcomes: data.learningOutcomes,
      schedule: data.schedule.map((scheduleItem) => ({
        week: scheduleItem.week,
        topic: scheduleItem.topic,
        scheduleDetails: scheduleItem.scheduleDetails,
      })),
      assessments: data.assessments,
      targetAudience: data.targetAudience,
      certification: data.certification,
      support: {
        officeHours: data.officeHours,
        discussionForum: data.discussionForum,
      },
      applicants: [],
    };

    console.log(formattedData);

    try {
      const response = await axiosPublic.post("/Courses", formattedData);

      // Success alert
      Swal.fire({
        icon: "success",
        title: "Event Added",
        text: "The event has been added successfully!",
      });

      document.getElementById("Create_New_Courses").close();
      refetch();
      reset();
      console.log(response);
    } catch (error) {
      console.error("Error adding event:", error);

      // Error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add the event. Please try again later.",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p>Add New Course</p>
        <button
          onClick={() => document.getElementById("Create_New_Courses").close()}
        >
          <ImCross className="hover:text-black font-bold" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5">
        {/* Course Title */}
        <div className="mb-4">
          <label className="block text-black font-bold">Course Title:</label>
          <input
            type="text"
            {...register("courseTitle", {
              required: "Course Title is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.courseTitle ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.courseTitle && (
            <span className="text-red-500">{errors.courseTitle.message}</span>
          )}
        </div>

        {/* Instructor */}
        <div className="mb-4">
          <label className="block text-black font-bold">Instructor:</label>
          <input
            type="text"
            {...register("instructor", { required: "Instructor is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.instructor ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.instructor && (
            <span className="text-red-500">{errors.instructor.message}</span>
          )}
        </div>

        {/* Duration */}
        <div className="mb-4">
          <label className="block text-black font-bold">Duration:</label>
          <input
            type="text"
            {...register("duration", { required: "Duration is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.duration ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.duration && (
            <span className="text-red-500">{errors.duration.message}</span>
          )}
        </div>

        {/* Level */}
        <div className="mb-4">
          <label className="block text-black font-bold">Level:</label>
          <input
            type="text"
            {...register("level", { required: "Level is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.level ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.level && (
            <span className="text-red-500">{errors.level.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-black font-bold">Description:</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>

        {/* Format */}
        <div className="mb-4">
          <label className="block text-black font-bold">Format:</label>
          <input
            type="text"
            {...register("format", { required: "Format is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.format ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.format && (
            <span className="text-red-500">{errors.format.message}</span>
          )}
        </div>

        {/* Batches */}
        <div>{renderBatchFields()}</div>

        {/* prerequisites */}
        <div className="mb-4">
          {renderFieldArray(
            prerequisiteFields,
            register,
            removePrerequisite,
            appendPrerequisite,
            "Prerequisites",
            "prerequisites"
          )}
        </div>

        {/* learningOutcomes */}
        <div className="mb-4">
          {renderFieldArray(
            learningOutcomeFields,
            register,
            removeLearningOutcome,
            appendLearningOutcome,
            "Learning Outcomes",
            "learningOutcomes"
          )}
        </div>

        {/* Schedule */}
        <div>{renderScheduleFields()}</div>

        {/* assessments */}
        <div className="mb-4">
          {renderFieldArray(
            assessmentFields,
            register,
            removeAssessment,
            appendAssessment,
            "Assessments",
            "assessments"
          )}
        </div>

        {/* targetAudience */}
        <div className="mb-4">
          {renderFieldArray(
            targetAudienceFields,
            register,
            removeTargetAudience,
            appendTargetAudience,
            "Target Audience",
            "targetAudience"
          )}
        </div>

        {/* Certification */}
        <div className="mb-4">
          <label className="block text-black font-bold">Certification:</label>
          <input
            type="text"
            {...register("certification", {
              required: "Certification is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.certification ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.certification && (
            <span className="text-red-500">{errors.certification.message}</span>
          )}
        </div>

        {/* Support */}
        <div className="mb-4">
          <label className="block text-black font-bold">Support:</label>
          <div className="mb-2 mt-5">
            <label>Office Hours:</label>
            <input
              type="text"
              {...register("officeHours")}
              className="border p-2 w-full mt-1 bg-white border-gray-300"
            />
          </div>
          <div>
            <label>Discussion Forum:</label>
            <input
              type="text"
              {...register("discussionForum")}
              className="border p-2 w-full mt-1 bg-white border-gray-300"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-14"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalAddCourses;

// PropTypes validation
ModalAddCourses.propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    refetch: PropTypes.func.isRequired, // Add refetch to prop types
  };