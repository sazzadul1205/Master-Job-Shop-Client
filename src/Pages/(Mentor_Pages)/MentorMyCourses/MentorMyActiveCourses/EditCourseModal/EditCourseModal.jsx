import { useEffect, useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { FaChevronRight } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import TagInput from "../../../../../Shared/TagInput/TagInput";
import FormInput from "../../../../../Shared/FormInput/FormInput";

// Shared Lists
import { TypeOptions } from "../../../../../Shared/Lists/TypeOptions";
import { LevelOptions } from "../../../../../Shared/Lists/LevelOptions ";
import { CategoryOptions } from "../../../../../Shared/Lists/CategoryOptions";
import { CurrencyOptions } from "../../../../../Shared/Lists/CurrencyOptions";
import { LanguageOptions } from "../../../../../Shared/Lists/LanguageOptions";
import { confirmationType } from "../../../../../Shared/Lists/confirmationType";
import { PaymentMethodOptions } from "../../../../../Shared/Lists/PaymentMethodOptions";

// Helper: format yyyy-mm-dd -> yyyy-mm-dd
const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const EditCourseModal = ({
  refetch,
  selectedCourseID,
  setSelectedCourseID,
}) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [loading, setLoading] = useState(null);
  const [subOptions, setSubOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Course Data
  const {
    data: CourseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedCourseData", selectedCourseID],
    queryFn: () =>
      axiosPublic.get(`/Course?id=${selectedCourseID}`).then((res) => res.data),
    enabled: !!selectedCourseID,
  });

  // Form Management
  const {
    handleSubmit,
    register,
    control,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: CourseData?.title || "",
      subTitle: CourseData?.subTitle || "",
      description: CourseData?.description || "",
      category: CourseData?.category || "",
      subCategory: CourseData?.subCategory || "",
      level: CourseData?.level || "",
      language: CourseData?.language || "",
      certificateAvailability: CourseData?.certificateAvailability || false,
      durationHours: CourseData?.durationHours || "",
      modulesNumber: CourseData?.modulesNumber || "",
      type: CourseData?.type || "",
      sessionsPerWeek: CourseData?.sessionsPerWeek || "",
      sessionDays: CourseData?.sessionDays || [],
      startTime: CourseData?.startTime || "",
      endTime: CourseData?.endTime || "",
      startDate: formatDateForInput(CourseData?.startDate),
      endDate: formatDateForInput(CourseData?.endDate),
      fee: CourseData?.fee || {
        isFree: false,
        amount: "",
        discount: "",
        currency: "",
        paymentMethod: "",
        confirmationType: "",
        negotiable: false,
        paymentLink: "",
      },
      tags: CourseData?.tags || [],
      modules: CourseData?.modules || [],
      skillsCovered: CourseData?.skillsCovered || [],
      learningActivity: CourseData?.learningActivity || [],
      prerequisites: CourseData?.prerequisites || [],
      status: CourseData?.status || "",
      postedAt: CourseData?.postedAt || "",
      Mentor: CourseData?.Mentor || {
        name: "",
        email: "",
        profileImage: "",
        bio: "",
        rating: "",
        position: "",
      },
      archived: CourseData?.archived || false,
    },
  });

  // Tags
  const {
    fields: tagsFields,
    append: appendTags,
    remove: removeTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  // Modules
  const {
    fields: modulesFields,
    append: appendModules,
    remove: removeModules,
  } = useFieldArray({
    control,
    name: "modules",
  });

  // Skills Covered
  const {
    fields: skillsCoveredFields,
    append: appendSkillsCovered,
    remove: removeSkillsCovered,
  } = useFieldArray({
    control,
    name: "skillsCovered",
  });

  // Learning Activity
  const {
    fields: learningActivityFields,
    append: appendLearningActivity,
    remove: removeLearningActivity,
  } = useFieldArray({
    control,
    name: "learningActivity",
  });

  // Prerequisites
  const {
    fields: PrerequisitesFields,
    append: appendPrerequisites,
    remove: removePrerequisites,
  } = useFieldArray({
    control,
    name: "prerequisites",
  });

  // Re-run reset whenever CourseData changes
  useEffect(() => {
    if (CourseData) {
      reset({
        title: CourseData?.title || "",
        subTitle: CourseData?.subTitle || "",
        description: CourseData?.description || "",
        category: CourseData?.category || "",
        subCategory: CourseData?.subCategory || "",
        level: CourseData?.level || "",
        language: CourseData?.language || "",
        certificateAvailability: CourseData?.certificateAvailability || false,
        durationHours: CourseData?.durationHours || "",
        modulesNumber: CourseData?.modulesNumber || "",
        type: CourseData?.type || "",
        sessionsPerWeek: CourseData?.sessionsPerWeek || "",
        sessionDays: CourseData?.sessionDays || [],
        startTime: CourseData?.startTime || "",
        endTime: CourseData?.endTime || "",
        startDate: formatDateForInput(CourseData?.startDate),
        endDate: formatDateForInput(CourseData?.endDate),
        fee: CourseData?.fee || {
          isFree: false,
          amount: "",
          discount: "",
          currency: "",
          paymentMethod: "",
          confirmationType: "",
          negotiable: false,
          paymentLink: "",
        },
        tags: CourseData?.tags?.map((tag) => ({ value: tag })) || [],
        modules: CourseData?.modules?.map((mod) => ({ value: mod })) || [],
        skillsCovered:
          CourseData?.skillsCovered?.map((skill) => ({ value: skill })) || [],
        learningActivity:
          CourseData?.learningActivity?.map((act) => ({ value: act })) || [],
        prerequisites:
          CourseData?.prerequisites?.map((req) => ({ value: req })) || [],
        status: CourseData?.status || "",
        postedAt: CourseData?.postedAt || "",
        Mentor: CourseData?.Mentor || {
          name: "",
          email: "",
          profileImage: "",
          bio: "",
          rating: "",
          position: "",
        },
        archived: CourseData?.archived || false,
      });
    }
  }, [CourseData, reset]);

  // Watch category selection
  const selectedCategory = watch("category");

  // Update subcategory options based on selected category
  useEffect(() => {
    const category = CategoryOptions.find((c) => c.value === selectedCategory);
    setSubOptions(
      category
        ? category.subcategories.map((sub) => ({ value: sub, label: sub }))
        : []
    );
  }, [selectedCategory]);

  // Close Modal
  const handleClose = () => {
    setSelectedCourseID("");
    document.getElementById("Edit_Course_Modal")?.close();
  };

  // If loading
  if (isLoading)
    return (
      <div className="min-w-[600px] max-h-[90vh] relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Loading />
      </div>
    );

  // If error
  if (error)
    return (
      <div className="min-w-[600px] max-h-[90vh] relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Error />
      </div>
    );

  // If no Data
  if (!CourseData)
    return (
      <div
        id="Course_Details_Modal"
        className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white text-black rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center text-center py-16">
          {/* Icon */}
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-6 shadow-sm">
            <ImCross className="text-4xl text-gray-400" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Data Found
          </h3>

          {/* Subtitle */}
          <p className="text-gray-500 max-w-sm">
            We couldn’t find any Course details to display right now. Please
            check back later or refresh the page.
          </p>
        </div>
      </div>
    );

  // Form Submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");

      // Convert TagInput/FieldArray fields back to simple arrays
      const formattedData = {
        ...data,
        tags: data.tags.map((t) => t.value),
        modules: data.modules.map((m) => m.value),
        skillsCovered: data.skillsCovered.map((s) => s.value),
        learningActivity: data.learningActivity.map((a) => a.value),
        prerequisites: data.prerequisites.map((p) => p.value),
      };

      // Send PUT request to update Course
      await axiosPublic.put(`/Courses/${selectedCourseID}`, formattedData);

      // Success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Course updated successfully.",
        confirmButtonColor: "#2563eb",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Close modal and refresh data
      handleClose();
      refetch();
    } catch (err) {
      console.error("Error updating Course:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to update Course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Edit_Course_Modal"
      className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh] text-black"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => handleClose()}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        Create New Mentorship
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
      {/* Modal Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/*  Basic Info Section  */}
        <div className="space-y-4">
          {/* Title */}
          <FormInput
            label="Title"
            required
            placeholder="Course Title..."
            register={register("title", { required: "Title is required" })}
            error={errors.title}
          />

          {/* Sub Title */}
          <FormInput
            label="Sub Title"
            required
            placeholder="Course Sub Title..."
            register={register("subTitle", {
              required: "Sub Title is required",
            })}
            error={errors.subTitle}
          />

          {/* Description */}
          <FormInput
            as="textarea"
            label="Description"
            required
            placeholder="Enter Course description..."
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.description}
            rows={6}
          />

          {/* Category & Subcategory */}
          <div className="flex gap-4">
            {/* Category */}
            <FormInput
              as="select"
              label="Category"
              required
              placeholder="Select a Category"
              options={CategoryOptions.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
              register={register("category", {
                required: "Category is required",
              })}
              error={errors.category}
            />

            {/* Subcategory */}
            <FormInput
              as="select"
              label="Sub Category"
              required
              placeholder="Select a Sub Category"
              options={subOptions}
              register={register("subCategory", {
                required: "Sub Category is required",
              })}
              error={errors.subCategory}
            />
          </div>

          {/* Level & Language */}
          <div className="flex gap-4">
            {/* Level */}
            <FormInput
              as="select"
              label="Level"
              required
              placeholder="Select a Level"
              options={LevelOptions}
              register={register("level", {
                required: "Level is required",
              })}
              error={errors.level}
            />

            {/* Language */}
            <FormInput
              as="select"
              label="Language"
              required
              placeholder="Select a Language"
              options={LanguageOptions}
              register={register("language", {
                required: "Language is required",
              })}
              error={errors.language}
            />
          </div>

          {/* Tags TagInput */}
          <TagInput
            items={tagsFields}
            appendItem={appendTags}
            removeItem={removeTags}
            label="Tags"
            placeholder="Add a Tag"
          />

          {/* Certificate Availability */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Label */}
            <label className="block font-medium text-gray-700 md:w-48">
              Certificate Available <span className="text-red-500">*</span>
            </label>

            {/* Toggle */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-600">No</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("certificateAvailability")}
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md peer-checked:translate-x-6 transition-transform duration-300"></div>
              </label>

              <span className="font-semibold text-gray-600">Yes</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

        {/* Course Structure */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center gap-2 text-lg font-semibold pb-0 mb-0">
            <FaChevronRight className="text-gray-500s" /> Course Structure
          </h3>

          {/* Divider */}
          <p className="bg-gray-500 p-[1px] mt-2 mb-5" />

          {/* Duration & Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {/* Total Duration (In Hours) */}
            <FormInput
              label="Total Duration (In Hours)"
              type="number"
              required
              placeholder="Enter total Hours"
              register={register("durationHours", {
                required: "Total duration is required",
                min: { value: 1, message: "Duration must be at least 1 hour" },
              })}
              error={errors.durationHours}
            />

            {/* Number Of Modules */}
            <FormInput
              label="Number Of Modules"
              type="number"
              required
              placeholder="Enter Number of Modules"
              register={register("modulesNumber", {
                required: "Modules are required",
                min: { value: 1, message: "There must be at least 1 module" },
              })}
              error={errors.modules}
            />
          </div>

          {/* Modules TagInput */}
          <TagInput
            items={modulesFields}
            appendItem={appendModules}
            removeItem={removeModules}
            showNumbers={true}
            label="Modules Name"
            placeholder="Add a Module"
          />

          {/* Skills Covered TagInput */}
          <TagInput
            items={skillsCoveredFields}
            appendItem={appendSkillsCovered}
            removeItem={removeSkillsCovered}
            showNumbers={true}
            label="Skills Covered"
            placeholder="Add a Covered Skilled"
          />

          {/* Learning Activity TagInput */}
          <TagInput
            items={learningActivityFields}
            appendItem={appendLearningActivity}
            removeItem={removeLearningActivity}
            showNumbers={true}
            label="Learning Activity"
            placeholder="Add a Learning Activity"
          />

          {/* Prerequisites TagInput */}
          <TagInput
            items={PrerequisitesFields}
            appendItem={appendPrerequisites}
            removeItem={removePrerequisites}
            showNumbers={true}
            label="Prerequisites"
            placeholder="Add a Prerequisite"
          />
        </div>

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

        {/* Schedule */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center gap-2 text-lg font-semibold pb-0 mb-0">
            <FaChevronRight className="text-gray-500s" /> Course Schedule
          </h3>

          {/* Divider */}
          <p className="bg-gray-500 p-[1px] mt-2 mb-5" />

          {/* Type & Sessions Per Week */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <FormInput
              as="select"
              label="Type"
              required
              placeholder="Select a Type"
              options={TypeOptions}
              register={register("type", {
                required: "Type is required",
              })}
              error={errors.type}
            />

            {/* Sessions Per Week */}
            <FormInput
              label="Sessions Per Week"
              type="number"
              placeholder="e.g., 2"
              required
              register={register("sessionsPerWeek", {
                required: "Required",
                min: { value: 1, message: "Must be at least 1" },
                max: { value: 7, message: "Cannot exceed 7 sessions per week" },
              })}
              error={errors.sessionsPerWeek}
            />
          </div>

          {/* Session Days */}
          <div className="space-y-2">
            {/* Label */}
            <label className="block font-medium text-sm">Session Days</label>

            {/* Days Checkboxes */}
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                const selectedDays = watch("sessionDays") || [];
                const sessionsPerWeek = Number(watch("sessionsPerWeek")) || 0;
                const isSelected = selectedDays.includes(day);

                // Disable unchecked boxes if limit reached
                const disabled =
                  !isSelected && selectedDays.length >= sessionsPerWeek;

                return (
                  <label
                    key={day}
                    className={`cursor-pointer px-2 py-2 rounded-lg border text-center transition-colors duration-200 flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      value={day}
                      {...register("sessionDays")}
                      disabled={disabled}
                      className="hidden"
                    />
                    {day}
                  </label>
                );
              })}
            </div>

            {/* Error message if limit exceeded */}
            {watch("sessionDays")?.length >
              Number(watch("sessionsPerWeek")) && (
              <p className="text-red-500 text-sm mt-1">
                Maximum {watch("sessionsPerWeek")} sessions per week allowed.
              </p>
            )}
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <FormInput
              label="Start Time"
              required
              type="time"
              placeholder="Select Start Time..."
              register={register("startTime", {
                required: "Start Time is required",
              })}
              error={errors.startTime}
            />

            {/* End Time */}
            <FormInput
              label="End Time"
              required
              type="time"
              placeholder="Select End Time..."
              register={register("endTime", {
                required: "End Time is required",
              })}
              error={errors.endTime}
            />
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <FormInput
              label="Start Date"
              required
              type="date"
              placeholder="Select Start Date..."
              register={register("startDate", {
                required: "Start Date is required",
              })}
              error={errors.startDate}
            />

            {/* End Date (Estimated) */}
            <FormInput
              label="End Date (Estimated)"
              required
              type="date"
              placeholder="Select End Date..."
              register={register("endDate", {
                required: "End Date is required",
                validate: (value) => {
                  const start = new Date(getValues("startDate"));
                  const end = new Date(value);
                  return end >= start || "End Date cannot be before Start Date";
                },
              })}
              error={errors.endDate}
            />
          </div>
        </div>

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

        {/* Pricing */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center gap-2 text-lg font-semibold pb-0 mb-0">
            <FaChevronRight className="text-gray-500s" /> Course Pricing
          </h3>

          {/* Divider */}
          <p className="bg-gray-500 p-[1px] mt-2 mb-5" />

          {/* Free Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFree"
              {...register("fee.isFree")}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isFree" className="text-gray-700 font-medium">
              Free Course
            </label>
          </div>

          {/* Fee Inputs */}
          <div className="grid grid-cols-2 items-center gap-4">
            {/* Amount */}
            <FormInput
              label="Price"
              type="number"
              step="0.01"
              placeholder="e.g., 29.99"
              required
              register={register("fee.amount", {
                required: !watch("fee.isFree") ? "Price is required" : false,
                valueAsNumber: true,
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
              error={errors?.fee?.amount}
              disabled={watch("fee.isFree")}
            />

            {/* Discount (%) */}
            <FormInput
              label="Discount (%)"
              type="number"
              placeholder="e.g., 10"
              register={register("fee.discount", {
                valueAsNumber: true,
                min: { value: 0, message: "Discount cannot be negative" },
                max: { value: 100, message: "Discount cannot exceed 100%" },
              })}
              error={errors?.fee?.discount}
              disabled={watch("fee.isFree")}
            />

            {/* Currency */}
            <FormInput
              label="Currency"
              required
              as="select"
              placeholder="-- Select Currency --"
              register={register("fee.currency", {
                required: !watch("fee.isFree") ? "Currency is required" : false,
              })}
              error={errors?.fee?.currency}
              disabled={watch("fee.isFree")}
              options={CurrencyOptions}
            />

            {/* Payment Method */}
            <FormInput
              label="Payment Method"
              required
              as="select"
              placeholder="-- Select Payment Method --"
              register={register("fee.paymentMethod", {
                required: !watch("fee.isFree")
                  ? "Payment method is required"
                  : false,
              })}
              error={errors?.fee?.paymentMethod}
              disabled={watch("fee.isFree")}
              options={PaymentMethodOptions}
            />

            {/* Confirmation Type */}
            <FormInput
              label="Confirmation Type"
              required
              as="select"
              placeholder="-- Select Confirmation Type --"
              register={register("fee.confirmationType", {
                required: !watch("fee.isFree")
                  ? "Confirmation type is required"
                  : false,
              })}
              error={errors?.fee?.confirmationType}
              disabled={watch("fee.isFree")}
              options={confirmationType}
            />

            {/* Negotiable */}
            <div className="flex flex-col justify-center">
              <label
                htmlFor="negotiable"
                className="block font-medium text-sm mb-1"
              >
                Negotiable
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  {...register("fee.negotiable")}
                  disabled={watch("fee.isFree")}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <span className="text-gray-700 text-sm">Yes</span>
              </div>
            </div>
          </div>

          {/* Payment Link */}
          <FormInput
            label="Payment Link"
            placeholder="e.g., https://paypal.me/username"
            register={register("fee.paymentLink")}
            error={errors?.fee?.paymentLink}
            disabled={watch("fee.isFree")}
          />

          {/* Final Price Display */}
          {!watch("fee.isFree") && (
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-semibold text-sm text-gray-700">
                Final Price:{" "}
                <span className="text-blue-700">
                  {(
                    (watch("fee.amount") || 0) *
                    (1 - (watch("fee.discount") || 0) / 100)
                  ).toFixed(2)}{" "}
                  {watch("fee.currency") || "USD"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow 
            ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
          {loading ? "Editing..." : "Edit Course"}
        </button>
      </form>
    </div>
  );
};

// Prop Validation
EditCourseModal.propTypes = {
  refetch: PropTypes.func.isRequired,
  selectedCourseID: PropTypes.string.isRequired,
  setSelectedCourseID: PropTypes.func.isRequired,
};

export default EditCourseModal;
