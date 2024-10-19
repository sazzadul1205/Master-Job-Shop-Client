import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalEditCourse = ({ CourseData, refetch }) => {
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
    if (CourseData) {
      reset({
        courseTitle: CourseData?.courseTitle,
        instructor: CourseData?.instructor,
        duration: CourseData?.duration,
        level: CourseData?.level,
        postedBy: CourseData?.postedBy,
        description: CourseData?.description,
        format: CourseData?.format,
        batches: CourseData?.batches || [],
        prerequisites: CourseData?.prerequisites || [],
        learningOutcomes: CourseData?.learningOutcomes || [],
        schedule: CourseData?.schedule || [],
        assessments: CourseData?.assessments || [],
        targetAudience: CourseData?.targetAudience || [],
        certification: CourseData?.certification,
        officeHours: CourseData?.support?.officeHours,
        discussionForum: CourseData?.support?.discussionForum,
        emailSupport: CourseData?.support?.emailSupport,
        careerGuidance: CourseData?.support?.careerGuidance,
        applicants: CourseData?.applicants || [],
      });
    }
  }, [CourseData, reset]);

  const onSubmit = async (data) => {
    try {
      // Make the PUT request to update the course by ID
      await axiosPublic.put(`/Courses/${CourseData._id}`, data);

      // Show a success alert
      Swal.fire({
        title: "Success!",
        text: "Course updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      document.getElementById("Edit_Course_Modal").close();
      refetch();
      // Optionally, handle successful response or redirect
    } catch (error) {
      // Show an error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to update course. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      {/* Top section */}
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white ">
        <p className="text-xl">Edit My Course</p>
        <button
          onClick={() => document.getElementById("Edit_Course_Modal").close()}
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
        <div className="space-y-2">
          <label className="font-bold w-48 text-xl">Batches:</label>
          {fieldsBatches.map((item, index) => (
            <div key={item.id} className="flex gap-2">
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
        <div className="space-y-2">
          <label className="font-bold w-48 text-xl">Schedule:</label>
          {fieldsSchedule.map((item, index) => (
            <div key={item.id} className="flex gap-2">
              {/* Week */}
              <input
                className="input input-bordered bg-white p-2 border-black rounded-none w-[50px]"
                {...register(`schedule.${index}.week`)}
                type="number"
                placeholder="Week"
              />
              {/* Topic */}
              <input
                className="input input-bordered bg-white border-black rounded-none w-[250px]"
                {...register(`schedule.${index}.topic`)}
                type="text"
                placeholder="Topic"
                defaultValue={item.topic}
              />
              {/* Schedule Details */}
              <input
                className="input input-bordered bg-white border-black rounded-none w-[350px]"
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

const FormInput = ({ label, type = "text", register, errors, placeholder }) => (
  <div className="flex items-center gap-2">
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

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  register: PropTypes.object.isRequired,
  errors: PropTypes.object,
  placeholder: PropTypes.string,
};

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
  <div className="space-y-2">
    <label className="font-bold w-48 text-xl">{label}:</label>
    {fields.map((item, index) => (
      <div key={item.id} className="flex mb-1">
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

DynamicFieldList.propTypes = {
  label: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  append: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  errors: PropTypes.object,
};

export default ModalEditCourse;

ModalEditCourse.propTypes = {
  CourseData: PropTypes.shape({
    _id: PropTypes.string,
    courseTitle: PropTypes.string,
    instructor: PropTypes.string,
    duration: PropTypes.string,
    level: PropTypes.string,
    postedBy: PropTypes.string,
    description: PropTypes.string,
    format: PropTypes.string,
    batches: PropTypes.array,
    prerequisites: PropTypes.array,
    learningOutcomes: PropTypes.array,
    schedule: PropTypes.array,
    assessments: PropTypes.array,
    targetAudience: PropTypes.array,
    certification: PropTypes.string,
    support: PropTypes.shape({
      officeHours: PropTypes.string,
      discussionForum: PropTypes.string,
      emailSupport: PropTypes.string,
      careerGuidance: PropTypes.string,
    }),
    applicants: PropTypes.array,
  }),
  reset: PropTypes.func.isRequired,
};

// PropTypes validation
ModalEditCourse.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
