import { useEffect, useState } from "react";

// Packages
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Shared
import FormInput from "../../../../Shared/FormInput/FormInput";
import TagInput from "../../../../Shared/TagInput/TagInput";
import WeeklyPlanInput from "./WeeklyPlanInput/WeeklyPlanInput";

// Category Options
const CategoryOptions = [
  {
    value: "technology",
    label: "Technology",
    subcategories: [
      "AI",
      "Web Development",
      "Mobile Development",
      "Cloud Computing",
      "DevOps",
      "Data Science",
      "Cybersecurity",
      "Blockchain",
      "Game Development",
      "UI/UX Design",
      "Software Engineering",
      "IoT",
      "AR/VR",
      "Quantum Computing",
    ],
  },
  {
    value: "business",
    label: "Business & Finance",
    subcategories: [
      "Finance",
      "Investing",
      "Marketing",
      "Sales",
      "Management",
      "Entrepreneurship",
      "Business Strategy",
      "Project Management",
      "Accounting",
      "Economics",
      "E-commerce",
      "Startups",
    ],
  },
  {
    value: "arts",
    label: "Arts & Creative",
    subcategories: [
      "Music",
      "Design",
      "Writing",
      "Film & Media",
      "Painting",
      "Photography",
      "Graphic Design",
      "Sculpture",
      "Fashion Design",
      "Animation",
      "Interior Design",
      "Creative Writing",
    ],
  },
  {
    value: "science",
    label: "Science & Research",
    subcategories: [
      "Physics",
      "Biology",
      "Chemistry",
      "Astronomy",
      "Mathematics",
      "Engineering",
      "Environmental Science",
      "Geology",
      "Research Methodology",
      "Statistics",
      "Genetics",
    ],
  },
  {
    value: "health",
    label: "Health & Wellness",
    subcategories: [
      "Yoga",
      "Fitness",
      "Medicine",
      "Nutrition",
      "Meditation",
      "Mental Health",
      "Physiotherapy",
      "Public Health",
      "Alternative Medicine",
      "Wellness Coaching",
    ],
  },
  {
    value: "personal_dev",
    label: "Personal Development & Education",
    subcategories: [
      "Leadership",
      "Study Skills",
      "Career Guidance",
      "Public Speaking",
      "Time Management",
      "Language Learning",
      "Personal Development",
      "Critical Thinking",
      "Emotional Intelligence",
      "Mindfulness",
      "Goal Setting",
    ],
  },
  {
    value: "lifestyle",
    label: "Lifestyle & Hobbies",
    subcategories: [
      "Travel",
      "Sports",
      "Gaming",
      "Fashion",
      "Cooking",
      "Gardening",
      "Photography",
      "DIY Projects",
      "Pets & Animal Care",
      "Music Instruments",
      "Crafts",
    ],
  },
  {
    value: "social_impact",
    label: "Social Impact & Volunteering",
    subcategories: [
      "Nonprofit Management",
      "Community Service",
      "Environmental Activism",
      "Social Entrepreneurship",
      "Fundraising",
      "Advocacy",
    ],
  },
  {
    value: "tech_entrepreneurship",
    label: "Tech Entrepreneurship",
    subcategories: [
      "Startup Incubation",
      "Pitching & Funding",
      "Business Models",
      "Product Management",
      "Tech Innovation",
    ],
  },
  {
    value: "languages",
    label: "Languages & Communication",
    subcategories: [
      "English",
      "Spanish",
      "French",
      "Mandarin",
      "Japanese",
      "Public Speaking",
      "Writing Skills",
      "Communication Skills",
    ],
  },
];

const CreateMentorshipModal = () => {
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
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { tags: [], prerequisites: [] },
  });

  // Skills
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  // Prerequisites
  const {
    fields: prerequisitesFields,
    append: appendPrerequisites,
    remove: removePrerequisites,
  } = useFieldArray({
    control,
    name: "prerequisites",
  });

  // Attachments
  const {
    fields: attachmentsFields,
    append: appendAttachments,
    remove: removeAttachments,
  } = useFieldArray({
    control,
    name: "attachments",
  });

  // WeeklyPlan
  const {
    fields: weeklyPlanFields,
    append: appendWeeklyPlan,
    remove: removeWeeklyPlan,
  } = useFieldArray({
    control,
    name: "weeklyPlan",
  });

  // Watch category selection
  const selectedCategory = watch("category");

  useEffect(() => {
    const category = CategoryOptions.find((c) => c.value === selectedCategory);
    setSubOptions(
      category
        ? category.subcategories.map((sub) => ({ value: sub, label: sub }))
        : []
    );
  }, [selectedCategory]);

  // Close Modal and Clear Errors
  const handleClose = () => {
    setErrorMessage("");
    setSubOptions([]);
    reset();
  };

  // Form Submission
  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
  };

  return (
    <div
      id="Create_Mentorship_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("Create_Mentorship_Modal").close();
          handleClose();
        }}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        Create Mentor Profile
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormInput
          label="Title"
          required
          placeholder="Mentorship Title..."
          register={register("title", { required: "Title is required" })}
          error={errors.title}
        />

        {/* Description */}
        <FormInput
          as="textarea"
          label="Description"
          required
          placeholder="Enter mentorship description..."
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

        {/* Skills TagInput */}
        <TagInput
          items={skillFields}
          appendItem={appendSkill}
          removeItem={removeSkill}
          label="Skills"
          placeholder="Add a skill"
        />

        {/* Prerequisites TagInput */}
        <TagInput
          items={prerequisitesFields}
          appendItem={appendPrerequisites}
          removeItem={removePrerequisites}
          label="Prerequisites"
          placeholder="Add a Prerequisites"
        />

        {/* Attachments TagInput */}
        <TagInput
          items={attachmentsFields}
          appendItem={appendAttachments}
          removeItem={removeAttachments}
          label="Attachments"
          placeholder="Add a Attachment"
        />

        {/* Schedule */}
        <div className="space-y-3">
          {/* Header */}
          <h3 className="font-bold text-lg">Schedule</h3>

          {/* Divider */}
          <p className="bg-gray-500 p-[1px] my-2" />

          {/* Duration & Sessions Per Week */}
          <div className="flex gap-4">
            {/* Total Duration */}
            <FormInput
              label="Total Duration (Weeks)"
              type="number"
              placeholder="e.g., 8"
              required
              register={register("durationWeeks", {
                required: "Required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              error={errors.durationWeeks}
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

          {/* Session Length */}
          <FormInput
            label="Session Length"
            as="select"
            required
            placeholder="Select length"
            register={register("sessionLength", { required: "Required" })}
            error={errors.sessionLength}
            options={[
              { value: "30min", label: "30 minutes" },
              { value: "1hr", label: "1 hour" },
              { value: "2hr", label: "2 hours" },
              { value: "3hr", label: "3 hours" },
            ]}
          />

          {/* Session Days */}
          <div className="space-y-2">
            <label className="block font-medium text-sm">Session Days</label>
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

          {/* Start Time & Start Date */}
          <div className="flex gap-4 mt-2">
            {/* Session Start Time */}
            <FormInput
              label="Session Start Time"
              type="time"
              required
              register={register("sessionStartTime", { required: "Required" })}
              error={errors.sessionStartTime}
            />

            {/* Start Date */}
            <FormInput
              label="Program Start Date"
              type="date"
              required
              register={register("startDate", { required: "Required" })}
              error={errors.startDate}
            />
          </div>

          {/* Weekly Plan */}
          <WeeklyPlanInput
            register={register}
            fields={weeklyPlanFields}
            remove={removeWeeklyPlan}
            append={appendWeeklyPlan}
            errors={errors.weeklyPlan}
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          {/* Remote / On-site Toggle */}
          <div className="flex flex-col gap-2">
            {/* Label */}
            <label className="block font-medium text-sm">
              Mentorship Mode <span className="text-red-500">*</span>
            </label>

            {/* Divider */}
            <p className="h-[2px] w-full bg-black" />

            {/* Toggle */}
            <div className="flex items-center gap-3">
              {/* Remote Toggle */}
              <span className="font-semibold">Remote</span>

              {/* Toggle */}
              <input
                type="checkbox"
                className="toggle bg-blue-400 checked:bg-blue-600"
                {...register("modeToggle")}
              />

              {/* On-site Toggle */}
              <span className="font-semibold">On-site</span>
            </div>
          </div>

          {/* On-site Detailed Location (always shown, disabled if Remote) */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* City */}
            <FormInput
              label="City"
              placeholder="Enter city"
              disabled={!watch("modeToggle")}
              required={watch("modeToggle")}
              register={register("location.city", {
                required: watch("modeToggle") ? "City is required" : false,
              })}
              error={errors?.location?.city}
            />

            {/* State / Province */}
            <FormInput
              label="State / Province"
              placeholder="Enter state or province"
              disabled={!watch("modeToggle")}
              required={watch("modeToggle")}
              register={register("location.state", {
                required: watch("modeToggle")
                  ? "State/Province is required"
                  : false,
              })}
              error={errors?.location?.state}
            />

            {/* Country */}
            <FormInput
              label="Country"
              placeholder="Enter country"
              disabled={!watch("modeToggle")}
              required={watch("modeToggle")}
              register={register("location.country", {
                required: watch("modeToggle") ? "Country is required" : false,
              })}
              error={errors?.location?.country}
            />

            {/* Address (Optional, not required) */}
            <FormInput
              label="Address (optional)"
              placeholder="Enter detailed address"
              disabled={!watch("modeToggle")}
              register={register("location.address")}
              error={errors?.location?.address}
            />
          </div>
        </div>

        {/* Fee & Payment */}
        <div className="space-y-3">
          {/* Header */}
          <h3 className="font-semibold text-lg">Fee & Payment</h3>

          {/* Divider */}
          <p className="bg-gray-500 p-[1px] my-2" />

          <div className="grid grid-cols-2 items-center gap-4">
            {/* Fee Type */}
            <FormInput
              label="Fee Type"
              required
              as="select"
              placeholder="-- Select Fee Type --"
              register={register("fee.type", {
                required: "Fee type is required",
              })}
              error={errors?.fee?.type}
              options={[
                { value: "fixed", label: "Fixed" },
                { value: "hourly", label: "Hourly" },
                { value: "perSession", label: "Per Session" },
                { value: "weekly", label: "Weekly" },
              ]}
            />

            {/* Amount */}
            <FormInput
              label="Amount"
              type="number"
              placeholder="e.g., 50"
              required
              register={register("fee.amount", {
                required: "Amount is required",
                valueAsNumber: true,
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              error={errors?.fee?.amount}
            />

            {/* Currency */}
            <FormInput
              label="Currency"
              required
              as="select"
              placeholder="-- Select Currency --"
              register={register("fee.currency", {
                required: "Currency is required",
              })}
              error={errors?.fee?.currency}
              options={[
                { value: "USD", label: "USD ($)" },
                { value: "EUR", label: "EUR (€)" },
                { value: "GBP", label: "GBP (£)" },
                { value: "BDT", label: "BDT (৳)" },
                { value: "INR", label: "INR (₹)" },
              ]}
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
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <span className="text-gray-700 text-sm">Yes</span>
              </div>
            </div>
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
          {loading ? "Creating..." : "Create Mentor Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateMentorshipModal;
