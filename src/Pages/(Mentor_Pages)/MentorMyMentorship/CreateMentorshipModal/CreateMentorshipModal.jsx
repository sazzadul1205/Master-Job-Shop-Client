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

// Shared
import TagInput from "../../../../Shared/TagInput/TagInput";
import FormInput from "../../../../Shared/FormInput/FormInput";
import WeeklyPlanInput from "./WeeklyPlanInput/WeeklyPlanInput";

// Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared Lists
import { LengthOptions } from "../../../../Shared/Lists/LengthOptions";
import { FeeTypeOptions } from "../../../../Shared/Lists/FeeTypeOptions";
import { CategoryOptions } from "../../../../Shared/Lists/CategoryOptions";
import { CurrencyOptions } from "../../../../Shared/Lists/CurrencyOptions";
import { confirmationType } from "../../../../Shared/Lists/confirmationType";
import { PaymentMethodOptions } from "../../../../Shared/Lists/PaymentMethodOptions";
import { preferredCommunicationMethod } from "../../../../Shared/Lists/preferredCommunicationMethod";
import { preferredCommunicationFrequency } from "../../../../Shared/Lists/preferredCommunicationFrequency";
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

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

const CreateMentorshipModal = ({ refetch }) => {
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
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      skills: [],
      WeeklyPlan: [],
      attachments: [],
      skillsCovered: [],
      prerequisites: [],
    },
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
      axiosPublic.get(`/Mentors/${user?.email}`).then((res) => res.data),
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

  // skillsCovered
  const {
    fields: skillsCoveredFields,
    append: AppendSkillsCovered,
    remove: RemoveSkillsCovered,
  } = useFieldArray({
    control,
    name: "skillsCovered",
  });

  // Close Modal and Clear Errors
  const handleClose = () => {
    // Close Modal after success
    document.getElementById("Create_Mentorship_Modal").close();

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

    try {
      // Prepare payload
      const payload = {
        ...data,
        skills: data.skills?.map((item) => item.value) || [],
        attachments: data.attachments?.map((item) => item.value) || [],
        prerequisites: data.prerequisites?.map((item) => item.value) || [],
        skillsCovered: data.skillsCovered?.map((item) => item.value) || [],
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
      await axiosPublic.post("/Mentorship", payload);

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
      id="Create_Mentorship_Modal"
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
          Create New Mentorship
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
        {/* Basic Info Section */}
        <div className="space-y-4">
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
        </div>

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

        {/* Skills, Prerequisites & Attachments */}
        <div className="space-y-4">
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

          {/* Skills Covered TagInput */}
          <TagInput
            items={skillsCoveredFields}
            appendItem={AppendSkillsCovered}
            removeItem={RemoveSkillsCovered}
            label="Skills Covered In Mentorship"
            placeholder="Add a Skills Covered"
          />
        </div>

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

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
            options={LengthOptions}
          />

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

          {/* Session Times */}
          <div className="flex gap-4">
            {/* Session Start Time */}
            <FormInput
              label="Session Start Time"
              type="time"
              required
              register={register("sessionStartTime", { required: "Required" })}
              error={errors.sessionStartTime}
            />

            {/* Session End Time */}
            <FormInput
              label="Session End Time"
              type="time"
              required
              register={register("sessionEndTime", { required: "Required" })}
              error={errors.sessionEndTime}
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

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

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

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

        {/* Fee & Payment */}
        <div className="space-y-3">
          {/* Title */}
          <h3 className="flex items-center gap-2 text-lg font-semibold pb-0 mb-0">
            <FaChevronRight className="text-gray-500s" /> Course Pricing
          </h3>

          {/* Divider */}
          <p className="bg-gray-500 p-[1px] my-2" />

          {/* Free Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFree-mentorship"
              {...register("fee.isFree")}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="isFree-mentorship"
              className="text-gray-700 font-medium"
            >
              Free Mentorship
            </label>
          </div>

          {/* All fee inputs */}
          <div className="grid grid-cols-2 items-center gap-4">
            {/* Fee Type */}
            <FormInput
              label="Fee Type"
              required
              as="select"
              placeholder="-- Select Fee Type --"
              register={register("fee.type", {
                required: !watch("fee.isFree-mentorship")
                  ? "Fee type is required"
                  : false,
              })}
              error={errors?.fee?.type}
              disabled={watch("fee.isFree-mentorship")}
              options={FeeTypeOptions}
            />

            {/* Amount */}
            <FormInput
              label="Amount"
              type="number"
              placeholder="e.g., 50"
              required
              register={register("fee.amount", {
                required: !watch("fee.isFree-mentorship")
                  ? "Amount is required"
                  : false,
                valueAsNumber: true,
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              error={errors?.fee?.amount}
              disabled={watch("fee.isFree-mentorship")}
            />

            {/* Currency */}
            <FormInput
              label="Currency"
              required
              as="select"
              placeholder="-- Select Currency --"
              register={register("fee.currency", {
                required: !watch("fee.isFree-mentorship")
                  ? "Currency is required"
                  : false,
              })}
              error={errors?.fee?.currency}
              disabled={watch("fee.isFree-mentorship")}
              options={CurrencyOptions}
            />

            {/* Payment Method */}
            <FormInput
              label="Payment Method"
              required
              as="select"
              placeholder="-- Select Payment Method --"
              register={register("fee.paymentMethod", {
                required: !watch("fee.isFree-mentorship")
                  ? "Payment method is required"
                  : false,
              })}
              error={errors?.fee?.paymentMethod}
              disabled={watch("fee.isFree-mentorship")}
              options={PaymentMethodOptions}
            />

            {/* Confirmation Type */}
            <FormInput
              label="Confirmation Type"
              required
              as="select"
              placeholder="-- Select Confirmation Type --"
              register={register("fee.confirmationType", {
                required: !watch("fee.isFree-mentorship")
                  ? "Confirmation type is required"
                  : false,
              })}
              error={errors?.fee?.confirmationType}
              disabled={watch("fee.isFree-mentorship")}
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
                  id="negotiable-mentorship"
                  {...register("fee.negotiable")}
                  disabled={watch("fee.isFree-mentorship")}
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
            disabled={watch("fee.isFree-mentorship")}
          />
        </div>

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

        {/* Dates */}
        <div className="flex gap-2">
          {/* Start Date */}
          <FormInput
            label="Program Start Date"
            type="date"
            required
            register={register("startDate", { required: "Required" })}
            error={errors.startDate}
          />

          {/* End Date */}
          <FormInput
            label="Program End Date"
            type="date"
            required
            register={register("endDate", { required: "Required" })}
            error={errors.endDate}
          />
        </div>

        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

        {/* Communication Preferences */}
        <div className="space-y-3">
          {/* Label */}
          <h4 className="font-semibold text-lg">Communication Preferences</h4>

          {/* Preferred Method */}
          <FormInput
            label="Preferred Method"
            required
            as="select"
            placeholder="-- Select Method --"
            register={register("communication.preferredMethod", {
              required: "Preferred communication method is required",
            })}
            error={errors?.communication?.preferredMethod}
            options={preferredCommunicationMethod}
          />

          <div className="flex flex-row justify-between px-20 py-2">
            {/* Group Chat Enabled */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="groupChatEnabled"
                {...register("communication.groupChatEnabled")}
                className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="groupChatEnabled"
                className="text-gray-700 font-medium leading-none"
              >
                Enable Group Chat
              </label>
            </div>

            {/* One-on-One Support */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="oneOnOneSupport"
                {...register("communication.oneOnOneSupport")}
                className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="oneOnOneSupport"
                className="text-gray-700 font-medium leading-none"
              >
                One-on-One Support
              </label>
            </div>
          </div>

          {/* Communication Frequency */}
          <FormInput
            label="Preferred Communication Frequency"
            as="select"
            placeholder="-- Select Frequency --"
            register={register("communication.frequency")}
            error={errors?.communication?.frequency}
            options={preferredCommunicationFrequency}
          />

          {/* Notes / Special Instructions */}
          <FormInput
            label="Additional Notes"
            as="textarea"
            placeholder="Any special communication preferences..."
            register={register("communication.notes")}
            error={errors?.communication?.notes}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow 
            ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
          {loading ? "Creating..." : "Create Mentorship"}
        </button>
      </form>
    </div>
  );
};

CreateMentorshipModal.propTypes = {
  refetch: PropTypes.func,
};

export default CreateMentorshipModal;
