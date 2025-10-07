import { useEffect, useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { FaChevronRight, FaPaste } from "react-icons/fa";

// Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import TagInput from "../../../../Shared/TagInput/TagInput";
import FormInput from "../../../../Shared/FormInput/FormInput";

// Shared Lists
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";
import { TypeOptions } from "../../../../Shared/Lists/TypeOptions";
import { LevelOptions } from "../../../../Shared/Lists/LevelOptions ";
import { LanguageOptions } from "../../../../Shared/Lists/LanguageOptions";
import { CategoryOptions } from "../../../../Shared/Lists/CategoryOptions";
import { CurrencyOptions } from "../../../../Shared/Lists/CurrencyOptions";
import { confirmationType } from "../../../../Shared/Lists/confirmationType";
import { PaymentMethodOptions } from "../../../../Shared/Lists/PaymentMethodOptions";

// Helper: format yyyy-mm-dd -> 25 Aug 2023
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CreateCourseModal = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user, loading: userLoading } = useAuth();

  // States Variables
  const [loading, setLoading] = useState(null);
  const [subOptions, setSubOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Handling
  const {
    watch,
    reset,
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // Watch category selection
  const selectedCategory = watch("category");

  // ---------- Fetch Mentors ----------
  const {
    data: MyMentorsData,
    isLoading: MyMentorsIsLoading,
    error: MyMentorsError,
  } = useQuery({
    queryKey: ["MentorsData"],
    queryFn: () =>
      axiosPublic?.get(`/Mentors/${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Update subcategory options based on selected category
  useEffect(() => {
    const category = CategoryOptions.find((c) => c.value === selectedCategory);
    setSubOptions(
      category
        ? category.subcategories.map((sub) => ({ value: sub, label: sub }))
        : []
    );
  }, [selectedCategory]);

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

  // Close Modal and Clear Errors
  const handleClose = () => {
    // Close Modal after success
    document.getElementById("Create_Course_Modal").close();

    // Clear Errors and Loading
    setErrorMessage("");
    setLoading(false);
    setSubOptions([]);
    refetch();
    reset();
  };

  // Inside your component
  const handlePasteJSON = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      let jsonData = JSON.parse(text);

      // Remove any 'id' or '_id' fields
      // eslint-disable-next-line no-unused-vars
      const { id, _id, applications, ...rest } = jsonData;

      // Set subcategory options first
      const selectedCategory = rest.category || "";
      const categoryObj = CategoryOptions.find(
        (c) => c.value === selectedCategory
      );
      const newSubOptions = categoryObj
        ? categoryObj.subcategories.map((sub) => ({ value: sub, label: sub }))
        : [];
      setSubOptions(newSubOptions);

      // Map skills/attachments/prerequisites/skillsCovered correctly
      const mapToOptions = (arr) =>
        arr?.map((item) =>
          typeof item === "string" ? { value: item, label: item } : item
        ) || [];

      // Reset the form without id/_id
      reset({
        ...rest,
        category: rest.category || "",
        subCategory:
          newSubOptions.find((s) => s.value === rest.subCategory)?.value || "",
        skills: mapToOptions(rest.skills),
        attachments: mapToOptions(rest.attachments),
        prerequisites: mapToOptions(rest.prerequisites),
        skillsCovered: mapToOptions(rest.skillsCovered),
        weeklyPlan: rest.weeklyPlan || [],
        fee: rest.fee || {},
        communication: rest.communication || {},
        sessionDays: rest.sessionDays || [],
        location: rest.location || {},
        modeToggle: rest.modeToggle || false,
      });
    } catch (err) {
      console.error("Failed to paste JSON:", err);
      Swal.fire({
        icon: "error",
        title: "Invalid JSON",
        text: "Cannot parse clipboard data. Please check the format.",
      });
    }
  };

  // Form Submission
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    // Format dates before saving
    const formattedStart = formatDate(data.startDate);
    const formattedEnd = formatDate(data.endDate);

    // Helper: map values
    const formatArray = (fields, showNumbers = false) =>
      fields.map((item, idx) =>
        showNumbers ? `${idx + 1}. ${item.value}` : item.value
      );
    try {
      // Prepare payload
      const payload = {
        ...data,
        tags: formatArray(tagsFields),
        modules: formatArray(modulesFields),
        skillsCovered: formatArray(skillsCoveredFields),
        prerequisites: formatArray(PrerequisitesFields),
        learningActivity: formatArray(learningActivityFields),
        endDate: formattedEnd,
        startDate: formattedStart,
        status: "closed",
        postedAt: new Date().toISOString(),
        Mentor: {
          name: MyMentorsData?.name || "",
          email: MyMentorsData?.email || "",
          profileImage: MyMentorsData?.avatar || "",
          bio: MyMentorsData?.description || "",
          rating: MyMentorsData?.rating || "0.0",
          position: MyMentorsData?.position || "",
        },
        archived: false,
      };

      // POST Request
      await axiosPublic.post("/Course", payload);

      // Close Modal and Reset
      handleClose();

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
      console.error("Error creating mentorship:", err);
      console.log("Error", err);
      setErrorMessage("Failed to create mentorship. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Loading states
  if (MyMentorsIsLoading || userLoading) return <Loading />;

  // Error states
  if (MyMentorsError) return <Error />;

  return (
    <div
      id="Create_Course_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Header */}
      <div>
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
          Create New Course
        </h3>

        {/* Paste Button */}
        <button
          type="button"
          onClick={handlePasteJSON}
          data-tooltip-id="pasteTooltip"
          data-tooltip-content="Paste JSON from clipboard"
          className="flex items-center gap-2 border border-amber-400 absolute top-2 left-3 z-50 p-2 rounded-xl hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <FaPaste className="text-lg" />
          <span className="hidden sm:inline">Paste</span>
        </button>

        <Tooltip id="pasteTooltip" place="bottom" effect="solid" />
      </div>

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
              id="isFree-course"
              {...register("fee.isFree")}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="isFree-course"
              className="text-gray-700 font-medium"
            >
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
                required: !watch("fee.isFree-course")
                  ? "Price is required"
                  : false,
                valueAsNumber: true,
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
              error={errors?.fee?.amount}
              disabled={watch("fee.isFree-course")}
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
              disabled={watch("fee.isFree-course")}
            />

            {/* Currency */}
            <FormInput
              label="Currency"
              required
              as="select"
              placeholder="-- Select Currency --"
              register={register("fee.currency", {
                required: !watch("fee.isFree-course")
                  ? "Currency is required"
                  : false,
              })}
              error={errors?.fee?.currency}
              disabled={watch("fee.isFree-course")}
              options={CurrencyOptions}
            />

            {/* Payment Method */}
            <FormInput
              label="Payment Method"
              required
              as="select"
              placeholder="-- Select Payment Method --"
              register={register("fee.paymentMethod", {
                required: !watch("fee.isFree-course")
                  ? "Payment method is required"
                  : false,
              })}
              error={errors?.fee?.paymentMethod}
              disabled={watch("fee.isFree-course")}
              options={PaymentMethodOptions}
            />

            {/* Confirmation Type */}
            <FormInput
              label="Confirmation Type"
              required
              as="select"
              placeholder="-- Select Confirmation Type --"
              register={register("fee.confirmationType", {
                required: !watch("fee.isFree-course")
                  ? "Confirmation type is required"
                  : false,
              })}
              error={errors?.fee?.confirmationType}
              disabled={watch("fee.isFree-course")}
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
                  id="negotiable-course"
                  {...register("fee.negotiable")}
                  disabled={watch("fee.isFree-course")}
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
            disabled={watch("fee.isFree-course")}
          />

          {/* Final Price Display */}
          {!watch("fee.isFree-course") && (
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
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

CreateCourseModal.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default CreateCourseModal;
