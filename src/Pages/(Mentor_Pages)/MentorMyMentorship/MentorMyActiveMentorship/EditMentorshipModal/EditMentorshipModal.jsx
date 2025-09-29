import { useEffect, useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { FaChevronRight } from "react-icons/fa";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import TagInput from "../../../../../Shared/TagInput/TagInput";
import FormInput from "../../../../../Shared/FormInput/FormInput";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Components
import WeeklyPlanInput from "../../CreateMentorshipModal/WeeklyPlanInput/WeeklyPlanInput";

// Shared Lists
import { LengthOptions } from "../../../../../Shared/Lists/LengthOptions";
import { FeeTypeOptions } from "../../../../../Shared/Lists/FeeTypeOptions";
import { CurrencyOptions } from "../../../../../Shared/Lists/CurrencyOptions";
import { confirmationType } from "../../../..//../Shared/Lists/confirmationType";
import { CategoryOptions } from "../../../../../Shared/Lists/CategoryOptions";
import { PaymentMethodOptions } from "../../../../../Shared/Lists/PaymentMethodOptions";
import { preferredCommunicationMethod } from "../../../../../Shared/Lists/preferredCommunicationMethod";
import { preferredCommunicationFrequency } from "../../../../../Shared/Lists/preferredCommunicationFrequency";

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

const EditMentorshipModal = ({
  refetch,
  selectedMentorshipID,
  setSelectedMentorshipID,
}) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [loading, setLoading] = useState(null);
  const [subOptions, setSubOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Mentorship Data
  const {
    data: MentorshipData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedMentorshipData", selectedMentorshipID],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?id=${selectedMentorshipID}`)
        .then((res) => res.data),
    enabled: !!selectedMentorshipID,
  });

  // Form Management
  const {
    handleSubmit,
    register,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: MentorshipData?.title || "",
      description: MentorshipData?.description || "",
      category: MentorshipData?.category || "",
      subCategory: MentorshipData?.subCategory || "",
      durationWeeks: MentorshipData?.durationWeeks || "",
      sessionsPerWeek: MentorshipData?.sessionsPerWeek || "",
      sessionLength: MentorshipData?.sessionLength || "",
      sessionDays: MentorshipData?.sessionDays || [],
      sessionStartTime: MentorshipData?.sessionStartTime || "",
      sessionEndTime: MentorshipData?.sessionEndTime || "",
      modeToggle: MentorshipData?.modeToggle,
      location: MentorshipData?.location || {
        city: "",
        state: "",
        country: "",
        address: "",
      },
      fee: MentorshipData?.fee || {
        isFree: false,
        type: "",
        amount: "",
        currency: "",
        paymentMethod: "",
        confirmationType: "",
        negotiable: false,
        paymentLink: "",
      },
      startDate: formatDateForInput(MentorshipData?.startDate),
      endDate: formatDateForInput(MentorshipData?.endDate),
      communication: MentorshipData?.communication || {
        preferredMethod: "",
        groupChatEnabled: false,
        oneOnOneSupport: false,
        frequency: "",
        notes: "",
      },
      skills: MentorshipData?.skills || [],
      prerequisites: MentorshipData?.prerequisites || [],
      attachments: MentorshipData?.attachments || [],
      skillsCovered: MentorshipData?.skillsCovered || [],
      weeklyPlan: MentorshipData?.weeklyPlan || [],
    },
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

  // skillsCovered
  const {
    fields: skillsCoveredFields,
    append: AppendSkillsCovered,
    remove: RemoveSkillsCovered,
  } = useFieldArray({
    control,
    name: "skillsCovered",
  });

  // Re-run reset whenever MentorshipData changes
  useEffect(() => {
    if (MentorshipData) {
      reset({
        title: MentorshipData?.title || "",
        description: MentorshipData?.description || "",
        category: MentorshipData?.category || "",
        subCategory: MentorshipData?.subCategory || "",
        durationWeeks: MentorshipData?.durationWeeks || "",
        sessionsPerWeek: MentorshipData?.sessionsPerWeek || "",
        sessionLength: MentorshipData?.sessionLength || "",
        sessionDays: MentorshipData?.sessionDays || [],
        sessionStartTime: MentorshipData?.sessionStartTime || "",
        sessionEndTime: MentorshipData?.sessionEndTime || "",
        modeToggle: MentorshipData?.modeToggle,
        location: MentorshipData?.location || {
          city: "",
          state: "",
          country: "",
          address: "",
        },
        fee: MentorshipData?.fee || {
          isFree: false,
          type: "",
          amount: "",
          currency: "",
          paymentMethod: "",
          confirmationType: "",
          negotiable: false,
          paymentLink: "",
        },
        startDate: formatDateForInput(MentorshipData?.startDate),
        endDate: formatDateForInput(MentorshipData?.endDate),
        communication: MentorshipData?.communication || {
          preferredMethod: "",
          groupChatEnabled: false,
          oneOnOneSupport: false,
          frequency: "",
          notes: "",
        },
        skills: MentorshipData.skills?.map((skill) => ({ value: skill })) || [],
        prerequisites:
          MentorshipData.prerequisites?.map((req) => ({ value: req })) || [],
        attachments:
          MentorshipData.attachments?.map((att) => ({ value: att })) || [],
        skillsCovered:
          MentorshipData.skillsCovered?.map((skill) => ({ value: skill })) ||
          [],
        weeklyPlan: MentorshipData?.weeklyPlan || [],
      });
    }
  }, [MentorshipData, reset]);

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
    setSelectedMentorshipID("");
    document.getElementById("Edit_Mentorship_Modal")?.close();
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
  if (!MentorshipData)
    return (
      <div
        id="Edit_Mentorship_Modal"
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
            We couldn’t find any Mentorship details to display right now. Please
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

      // Convert TagInput fields back to simple arrays
      const formattedData = {
        ...data,
        skills: data.skills.map((s) => s.value),
        prerequisites: data.prerequisites.map((p) => p.value),
        attachments: data.attachments.map((a) => a.value),
        skillsCovered: data.skillsCovered.map((s) => s.value),
      };

      // Send PUT request to update mentorship
      await axiosPublic.put(
        `/Mentorship/${selectedMentorshipID}`,
        formattedData
      );

      // Check if update was successful
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Mentorship updated successfully.",
        confirmButtonColor: "#2563eb",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Close modal and refetch updated data
      handleClose();
      refetch();
    } catch (err) {
      console.error("Error updating mentorship:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to update mentorship. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Edit_Mentorship_Modal"
      className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
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
      <h3 className="font-bold text-xl text-center mb-4">Edit Mentorship</h3>

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
              id="isFree"
              {...register("fee.isFree")}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isFree" className="text-gray-700 font-medium">
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
                required: !watch("fee.isFree") ? "Fee type is required" : false,
              })}
              error={errors?.fee?.type}
              disabled={watch("fee.isFree")}
              options={FeeTypeOptions}
            />

            {/* Amount */}
            <FormInput
              label="Amount"
              type="number"
              placeholder="e.g., 50"
              required
              register={register("fee.amount", {
                required: !watch("fee.isFree") ? "Amount is required" : false,
                valueAsNumber: true,
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              error={errors?.fee?.amount}
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
          {loading ? "Editing..." : "Edit Mentorship"}
        </button>
      </form>
    </div>
  );
};

// Prop Types
EditMentorshipModal.propTypes = {
  refetch: PropTypes.func.isRequired,
  selectedMentorshipID: PropTypes.string,
  setSelectedMentorshipID: PropTypes.func.isRequired,
};

export default EditMentorshipModal;
