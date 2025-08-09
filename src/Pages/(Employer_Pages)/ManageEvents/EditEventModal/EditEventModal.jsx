import { useEffect, useRef, useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm, useFieldArray } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

// Currency Data
import Currencies from "../../../../JSON/Currencies.json";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Component
import EventImageDropZone from "../AddNewEventModal/EventImageDropZone/EventImageDropZone";

// Image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const EditEventModal = ({ refetch, selectedEventData }) => {
  const axiosPublic = useAxiosPublic();

  // New Field Values State
  const [newFieldValues, setNewFieldValues] = useState({});

  // Posting States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // inside your component:
  const inputRefs = useRef({});

  // RHF setup
  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  // Watch Values
  const formatValue = watch("format");
  const isFree = watch("price.isFree", false);

  // Field Arrays
  const tags = useFieldArray({ control, name: "tags" });
  const audience = useFieldArray({ control, name: "audience" });

  // Combine field arrays for easier management
  const fieldArrays = {
    tags,
    audience,
  };

  // Fields to be dynamically rendered
  const fieldsConfig = ["tags", "audience"];

  // Schedule Field Array
  const {
    fields: fieldsSchedule,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: "schedule",
  });

  // Sponsors Field Array
  const {
    fields: fieldsSponsors,
    append: appendSponsors,
    remove: removeSponsors,
  } = useFieldArray({
    control,
    name: "sponsors",
  });

  // Ensure at least one schedule item is always present
  useEffect(() => {
    if (fieldsSchedule.length === 0) {
      appendSchedule({
        title: "",
        speaker: "",
        endTime: "",
        startTime: "",
        description: "",
      });
    }
  }, [fieldsSchedule, appendSchedule]);

  // Ensure at least one sponsor is always present
  useEffect(() => {
    if (fieldsSponsors.length === 0) {
      appendSponsors({
        tier: "",
        name: "",
        website: "",
        contactEmail: "",
      });
    }
  }, [fieldsSponsors, appendSponsors]);

  // Prefill the form and set previewImage when selectedEventData changes
  useEffect(() => {
    if (selectedEventData && selectedEventData._id) {
      const formatForInput = (isoStr) =>
        isoStr ? new Date(isoStr).toISOString().slice(0, 16) : "";

      reset({
        title: selectedEventData.title || "",
        category: selectedEventData.category || "",
        subCategory: selectedEventData.subCategory || "",
        description: selectedEventData.description || "",
        tags: selectedEventData.tags || [],
        audience: selectedEventData.audience || [],
        location: {
          venue: selectedEventData.location?.venue || "",
          address: selectedEventData.location?.address || "",
          city: selectedEventData.location?.city || "",
          country: selectedEventData.location?.country || "",
          googleMapLink: selectedEventData.location?.googleMapLink || "",
        },
        liveLink: selectedEventData.liveLink || "",
        type: selectedEventData.type || "",
        format: selectedEventData.format || "",
        extraNotes: selectedEventData.extraNotes || "",
        startDate: formatForInput(selectedEventData.startDate),
        endDate: formatForInput(selectedEventData.endDate),
        price: {
          isFree: selectedEventData.price?.isFree || false,
          standard: selectedEventData.price?.standard || "",
          currency: selectedEventData.price?.currency || "",
        },
        registration: {
          openDate: formatForInput(selectedEventData.registration?.openDate),
          closeDate: formatForInput(selectedEventData.registration?.closeDate),
          maxTicketsPerPerson:
            selectedEventData.registration?.maxTicketsPerPerson || "",
          registrationUrl:
            selectedEventData.registration?.registrationUrl || "",
          requiresApproval:
            selectedEventData.registration?.requiresApproval || false,
        },
        organizer: {
          name: selectedEventData.organizer?.name || "",
          logo: selectedEventData.organizer?.logo || "",
          contactEmail: selectedEventData.organizer?.contactEmail || "",
          contactPhone: selectedEventData.organizer?.contactPhone || "",
          website: selectedEventData.organizer?.website || "",
        },
        media: {
          banner: selectedEventData.media?.banner || "",
          promoVideo: selectedEventData.media?.promoVideo || "",
        },
        schedule:
          selectedEventData.schedule?.map((item) => ({
            title: item.title || "",
            speaker: item.speaker || "",
            startTime: formatForInput(item.startTime),
            endTime: formatForInput(item.endTime),
            description: item.description || "",
          })) || [],
        sponsors:
          selectedEventData.sponsors?.map((item) => ({
            tier: item.tier || "",
            name: item.name || "",
            website: item.website || "",
            contactEmail: item.contactEmail || "",
          })) || [],
        postedBy: selectedEventData.postedBy || "",
        publishedAt: selectedEventData.publishedAt || "",
        lastUpdated: selectedEventData.lastUpdated || "",
      });

      // Set preview image to organizer logo if exists, else media banner, else null
      setPreviewImage(selectedEventData.media?.banner || null);
    }
  }, [selectedEventData, reset]);

  // On Submit Handler
  const onSubmit = async (data) => {
    if (!selectedEventData?._id) return; // No event selected, exit

    setIsLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      let uploadedImageUrl = previewImage;

      // Upload image only if it's a base64 string (changed)
      if (previewImage?.startsWith("data:image/")) {
        const formData = new FormData();
        formData.append("image", previewImage.split(",")[1]);

        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = res?.data?.data?.display_url;
        if (!uploadedImageUrl) {
          throw new Error("Image upload succeeded but no URL returned.");
        }
      }

      // Prepare updated event payload
      const updatedEvent = {
        ...data,
        media: {
          ...data.media,
          banner: uploadedImageUrl,
        },
      };

      // Send update request
      const response = await axiosPublic.put(
        `/Events/${selectedEventData._id}`,
        updatedEvent
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Event Updated",
          text:
            response.data.message ||
            "Your event has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch?.();
        document.getElementById("Edit_Event_Modal")?.close();
      } else {
        Swal.fire({
          icon: "info",
          title: "Update Status",
          text: response.data.message || "No changes were made.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating Event:", error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to update event. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="Edit_Event_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          reset();
          refetch();
          setPreviewImage(null);
          setNewFieldValues({});
          document.getElementById("Edit_Event_Modal").close();
        }}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">Edit Event</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Alert Messages */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image */}
        <EventImageDropZone
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
        />

        {/* Title */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="title">
            Event Title<span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", { required: "Event title is required" })}
            placeholder="e.g., Startup Legal Basics 2025"
            className={`input input-bordered w-full bg-white text-black border ${
              errors.title ? "border-red-500" : "border-black"
            }`}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1" htmlFor="category">
              Category<span className="text-red-500">*</span>
            </label>
            <input
              id="category"
              {...register("category", { required: "Category is required" })}
              placeholder="e.g., Graphic Design"
              className={`input input-bordered w-full bg-white text-black border ${
                errors.category ? "border-red-500" : "border-black"
              }`}
            />
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Subcategory */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1" htmlFor="subCategory">
              Subcategory<span className="text-red-500">*</span>
            </label>
            <input
              id="subCategory"
              {...register("subCategory", {
                required: "Subcategory is required",
              })}
              placeholder="e.g., Logo Design"
              className={`input input-bordered w-full bg-white text-black border ${
                errors.subCategory ? "border-red-500" : "border-black"
              }`}
            />
            {errors.subCategory && (
              <p className="text-sm text-red-600 mt-1">
                {errors.subCategory.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="description">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Describe the job in detail..."
            className={`textarea textarea-bordered w-full bg-white text-black border ${
              errors.description ? "border-red-500" : "border-black"
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* fieldsConfig for tags, requiredSkills */}
        {fieldsConfig.map((field) => (
          <div key={field} className="mb-6">
            {/* Label */}
            <label
              htmlFor={`${field}-input`}
              className="block font-semibold text-sm mb-2 capitalize"
            >
              {field.replace(/([A-Z])/g, " $1")}
            </label>

            {/* Tag Display */}
            <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3 px-2 py-2">
              {fieldArrays[field].fields.length > 0 ? (
                fieldArrays[field].fields.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => fieldArrays[field].remove(index)}
                    className="flex items-center border border-blue-700 font-semibold text-blue-800 gap-2 px-3 py-1 rounded cursor-pointer hover:bg-blue-100 transition-all duration-200 text-sm "
                  >
                    {watch(`${field}.${index}`) || `${field} #${index + 1}`}{" "}
                    <RxCross2 />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-sm px-5 py-2">
                  No {field} added yet.
                </p>
              )}
            </div>

            {/* Add Field Input */}
            <div className="flex justify-end gap-2">
              <input
                id={`${field}-input`}
                type="text"
                value={newFieldValues[field] || ""}
                onChange={(e) =>
                  setNewFieldValues((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                placeholder={`Add new ${field}`}
                className="input input-bordered bg-white text-black border-black w-2/3"
                ref={(el) => (inputRefs.current[field] = el)}
              />
              <button
                type="button"
                onClick={() => {
                  const value = newFieldValues[field]?.trim();
                  if (value) {
                    fieldArrays[field].append(value);
                    setNewFieldValues((prev) => ({ ...prev, [field]: "" }));

                    // Focus back to input after adding
                    inputRefs.current[field]?.focus();
                  }
                }}
                className="flex items-center gap-2 border-2 border-blue-600 font-semibold text-blue-600 rounded shadow-xl px-5 py-1 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-500"
              >
                Add
              </button>
            </div>
          </div>
        ))}

        {/* Type */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="type">
            Event Type
          </label>
          <select
            id="type"
            {...register("type", {
              required: "Please select a communication method",
            })}
            className={`input input-bordered w-full bg-white text-black border ${
              errors.type ? "border-red-500" : "border-black"
            } cursor-pointer`}
          >
            <option value="" disabled>
              Select event type
            </option>
            <option value="Seminar">Seminar</option>
            <option value="Workshop">Workshop</option>
            <option value="Conference">Conference</option>
            <option value="Webinar">Webinar</option>
            <option value="Lecture">Lecture</option>
            <option value="Networking Event">Networking Event</option>
            <option value="Panel Discussion">Panel Discussion</option>
            <option value="RoundTable">Round Table</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Training Session">Training Session</option>
            <option value="Expo / Trade Show">Expo / Trade Show</option>
            <option value="Fundraising Event">Fundraising Event</option>
            <option value="Award Ceremony">Award Ceremony</option>
            <option value="Community Meetup">Community Meetup</option>
            <option value="Career Fair">Career Fair</option>
            <option value="Pitch Competition">Pitch Competition</option>
            <option value="Retreat">Retreat</option>
            <option value="Fireside Chat">Fireside Chat</option>
            <option value="Summit">Summit</option>
            <option value="BootCamp">BootCamp</option>
            <option value="Q&A Session">Q&A Session</option>
          </select>
        </div>

        {/* Format */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="format">
            Format<span className="text-red-500">*</span>
          </label>
          <select
            id="format"
            {...register("format", { required: "Format is required" })}
            className={`input input-bordered w-full bg-white text-black border ${
              errors.format ? "border-red-500" : "border-black"
            } cursor-pointer`}
            defaultValue=""
          >
            <option value="" disabled>
              Select format
            </option>
            <option value="On Site">On Site</option>
            <option value="Online">Online</option>
          </select>
          {errors.format && (
            <p className="text-sm text-red-600 mt-1">{errors.format.message}</p>
          )}
        </div>

        {/* If On Site */}
        {formatValue === "On Site" && (
          <>
            {/* Title */}
            <h3 className="font-bold mt-6">Location</h3>

            {/* Divider */}
            <div className="bg-blue-700 p-[1px] mb-4" />

            {/* Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {["venue", "address", "city", "country", "googleMapLink"].map(
                (field) => (
                  <div className="flex flex-col" key={field}>
                    <label
                      className="font-medium text-sm mb-1"
                      htmlFor={`location.${field}`}
                    >
                      {field === "googleMapLink"
                        ? "Google Maps Link"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`location.${field}`}
                      {...register(`location.${field}`, {
                        required: `${
                          field === "googleMapLink" ? "Google Maps link" : field
                        } is required`,
                      })}
                      placeholder={`Enter ${
                        field === "googleMapLink" ? "Google Maps link" : field
                      }`}
                      className={`input input-bordered w-full bg-white text-black border ${
                        errors.location?.[field]
                          ? "border-red-500"
                          : "border-black"
                      }`}
                    />
                    {errors.location?.[field] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.location[field].message}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </>
        )}

        {/* If Online */}
        {formatValue === "Online" && (
          <div className="flex flex-col mt-4">
            <label className="font-medium text-sm mb-1" htmlFor="liveLink">
              Online Link<span className="text-red-500">*</span>
            </label>
            <input
              id="liveLink"
              {...register("liveLink", { required: "Link is required" })}
              placeholder="Enter the meeting/event link"
              className={`input input-bordered w-full bg-white text-black border ${
                errors.liveLink ? "border-red-500" : "border-black"
              }`}
            />
            {errors.liveLink && (
              <p className="text-sm text-red-600 mt-1">
                {errors.liveLink.message}
              </p>
            )}
          </div>
        )}

        {/* Extra Notes */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="extraNotes">
            Extra Notes
          </label>
          <textarea
            id="extraNotes"
            rows={5}
            {...register("extraNotes")}
            placeholder="Additional instructions or details..."
            className="textarea textarea-bordered w-full bg-white text-black border border-black"
          />
        </div>

        {/* Time Slots */}
        <div>
          {/* Title */}
          <h3 className="font-bold mb-2">Time</h3>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["startDate", "endDate"].map((field) => {
              const labelText = field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());

              return (
                <div className="flex flex-col" key={field}>
                  <label className="font-medium text-sm mb-1" htmlFor={field}>
                    {labelText} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={field}
                    type="datetime-local"
                    {...register(field, {
                      required: `${labelText} is required`,
                    })}
                    className={`input input-bordered w-full bg-white text-black border ${
                      errors[field] ? "border-red-500" : "border-black"
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors[field]?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Price */}
        <div>
          {/* Is Free Toggle */}
          <div className="flex items-center gap-3 pb-3">
            <label
              htmlFor="price.isFree"
              className="text-sm font-medium text-gray-700"
            >
              Event is Free
            </label>
            <label className="relative inline-block w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                id="price.isFree"
                {...register("price.isFree")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-700 transition-all duration-300"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full"></div>
            </label>
          </div>

          {/* Price Standard & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price Standard */}
            <div className="flex flex-col">
              <label
                className="font-medium text-sm mb-1"
                htmlFor="price.standard"
              >
                Price Standard
              </label>
              <input
                id="price.standard"
                {...register("price.standard")}
                placeholder="Enter standard price"
                className={`input input-bordered w-full bg-white text-black border border-black ${
                  isFree ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isFree}
              />
            </div>

            {/* Price Currency */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                {...register("price.currency", {
                  required: "Currency selection is required",
                })}
                className={`input input-bordered w-full bg-white text-black border ${
                  errors.price?.currency ? "border-red-500" : "border-black"
                } cursor-pointer`}
                disabled={isFree}
              >
                <option value="">Select Currency</option>
                {Currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} – {currency.name}
                  </option>
                ))}
              </select>
              {errors?.price?.currency && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.price.currency.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Registration */}
        <div>
          {/* Title */}
          <h3 className="font-bold mb-2">Registration</h3>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          {/* Registration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Registration Open Date */}
            <div className="flex flex-col">
              <label
                className="font-medium text-sm mb-1"
                htmlFor="registration.openDate"
              >
                Registration Open Date<span className="text-red-500">*</span>
              </label>
              <input
                id="registration.openDate"
                type="datetime-local"
                {...register("registration.openDate", {
                  required: "Open date is required",
                })}
                className={`input input-bordered w-full bg-white text-black border ${
                  errors.registration?.openDate
                    ? "border-red-500"
                    : "border-black"
                }`}
              />
              {errors.registration?.openDate && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.registration.openDate.message}
                </p>
              )}
            </div>

            {/* Registration Close Date */}
            <div className="flex flex-col">
              <label
                className="font-medium text-sm mb-1"
                htmlFor="registration.closeDate"
              >
                Registration Close Date<span className="text-red-500">*</span>
              </label>
              <input
                id="registration.closeDate"
                type="datetime-local"
                {...register("registration.closeDate", {
                  required: "Close date is required",
                })}
                className={`input input-bordered w-full bg-white text-black border ${
                  errors.registration?.closeDate
                    ? "border-red-500"
                    : "border-black"
                }`}
              />
              {errors.registration?.closeDate && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.registration.closeDate.message}
                </p>
              )}
            </div>

            {/* Max Tickets Per Person */}
            <div className="flex flex-col">
              <label
                className="font-medium text-sm mb-1"
                htmlFor="registration.maxTicketsPerPerson"
              >
                Max Tickets Per Person<span className="text-red-500">*</span>
              </label>
              <input
                id="registration.maxTicketsPerPerson"
                type="number"
                min={1}
                {...register("registration.maxTicketsPerPerson", {
                  required: "Max tickets per person is required",
                  min: { value: 1, message: "Minimum is 1" },
                })}
                placeholder="Enter maximum tickets per person"
                className={`input input-bordered w-full bg-white text-black border ${
                  errors.registration?.maxTicketsPerPerson
                    ? "border-red-500"
                    : "border-black"
                }`}
              />
              {errors.registration?.maxTicketsPerPerson && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.registration.maxTicketsPerPerson.message}
                </p>
              )}
            </div>

            {/* Registration URL */}
            <div className="flex flex-col">
              <label
                className="font-medium text-sm mb-1"
                htmlFor="registration.registrationUrl"
              >
                Registration URL<span className="text-red-500">*</span>
              </label>
              <input
                id="registration.registrationUrl"
                type="url"
                {...register("registration.registrationUrl", {
                  required: "Registration URL is required",
                  pattern: {
                    message: "Enter a valid URL",
                  },
                })}
                placeholder="https://example.com/register"
                className={`input input-bordered w-full bg-white text-black border ${
                  errors.registration?.registrationUrl
                    ? "border-red-500"
                    : "border-black"
                }`}
              />
              {errors.registration?.registrationUrl && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.registration.registrationUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* Requires Approval Toggle */}
          <div className="flex items-center gap-3 pb-3 pt-3">
            <label
              htmlFor="registration.requiresApproval"
              className="text-sm font-medium text-gray-700"
            >
              Requires Approval
            </label>
            <label className="relative inline-block w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                id="registration.requiresApproval"
                {...register("registration.requiresApproval")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-700 transition-all duration-300"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full"></div>
            </label>
          </div>
        </div>

        {/* Promo Video */}
        <div className="flex flex-col">
          <label
            className="font-medium text-sm mb-1"
            htmlFor="media.promoVideo"
          >
            Promo Video
          </label>
          <input
            id="media.promoVideo"
            type="url"
            {...register("media.promoVideo")}
            placeholder="Promo Video URL"
            className={`input input-bordered w-full bg-white text-black border ${
              errors?.media?.promoVideo ? "border-red-500" : "border-black"
            }`}
          />
          {errors?.media?.promoVideo && (
            <p className="text-sm text-red-600 mt-1">
              {errors?.media?.promoVideo.message}
            </p>
          )}
        </div>

        {/* Schedule */}
        <div>
          {/* Title */}
          <h3 className="font-bold mb-2">Event Schedule</h3>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          {/* Schedule Field */}
          {fieldsSchedule.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-300 rounded p-4 mb-1 relative"
            >
              {/* Remove button & Index */}
              <div className="flex items-center justify-between">
                {/* Index */}
                <p>{index + 1}.</p>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  title="Remove session"
                >
                  <ImCross />
                </button>
              </div>

              {/* Session Title */}
              <div className="flex flex-col mb-3">
                <label
                  className="text-sm font-semibold text-black mb-1"
                  htmlFor={`schedule.${index}.title`}
                >
                  Session Title<span className="text-red-500">*</span>
                </label>
                <input
                  id={`schedule.${index}.title`}
                  {...register(`schedule.${index}.title`, {
                    required: "Session title is required",
                  })}
                  className={`input input-bordered w-full bg-white text-black border ${
                    errors.schedule?.[index]?.title
                      ? "border-red-500"
                      : "border-black"
                  }`}
                  placeholder="Session title"
                />
                {errors.schedule?.[index]?.title && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.schedule[index].title.message}
                  </p>
                )}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="flex flex-col mb-3">
                  <label
                    className="text-sm font-semibold text-black mb-1"
                    htmlFor={`schedule.${index}.startTime`}
                  >
                    Start Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id={`schedule.${index}.startTime`}
                    {...register(`schedule.${index}.startTime`, {
                      required: "Start time is required",
                    })}
                    className={`input input-bordered w-full bg-white text-black border ${
                      errors.schedule?.[index]?.startTime
                        ? "border-red-500"
                        : "border-black"
                    }`}
                  />
                  {errors.schedule?.[index]?.startTime && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.schedule[index].startTime.message}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div className="flex flex-col mb-3">
                  <label
                    className="text-sm font-semibold text-black mb-1"
                    htmlFor={`schedule.${index}.endTime`}
                  >
                    End Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id={`schedule.${index}.endTime`}
                    {...register(`schedule.${index}.endTime`, {
                      required: "End time is required",
                    })}
                    className={`input input-bordered w-full bg-white text-black border ${
                      errors.schedule?.[index]?.endTime
                        ? "border-red-500"
                        : "border-black"
                    }`}
                  />
                  {errors.schedule?.[index]?.endTime && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.schedule[index].endTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col mb-3">
                <label
                  className="text-sm font-semibold text-black mb-1"
                  htmlFor={`schedule.${index}.description`}
                >
                  Description
                </label>
                <textarea
                  id={`schedule.${index}.description`}
                  {...register(`schedule.${index}.description`)}
                  placeholder="Session description"
                  className="textarea textarea-bordered w-full bg-white text-black border-black"
                  rows={3}
                />
              </div>

              {/* Speaker */}
              <div className="flex flex-col mb-3">
                <label
                  className="text-sm font-semibold text-black mb-1"
                  htmlFor={`schedule.${index}.speaker`}
                >
                  Speaker
                </label>
                <input
                  id={`schedule.${index}.speaker`}
                  {...register(`schedule.${index}.speaker`)}
                  placeholder="Speaker name"
                  className="input input-bordered w-full bg-white text-black border border-black"
                />
              </div>
            </div>
          ))}

          {/* Add Session Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                appendSchedule({
                  title: "",
                  speaker: "",
                  endTime: "",
                  startTime: "",
                  description: "",
                })
              }
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-5 py-2 cursor-pointer"
            >
              + Add Session
            </button>
          </div>
        </div>

        {/* Sponsors */}
        <div>
          {/* Title */}
          <h3 className="font-bold mb-2">Sponsors</h3>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          {/* Sponsors Fields */}
          {fieldsSponsors.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-300 rounded p-4 mb-1 relative"
            >
              {/* Remove button & Index */}
              <div className="flex items-center justify-between">
                {/* Index */}
                <p className="font-semibold">{index + 1}.</p>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeSponsors(index)}
                  className="text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  title="Remove sponsor"
                >
                  <ImCross />
                </button>
              </div>

              {/* Sponsor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sponsor Name */}
                <div className="flex flex-col mb-3">
                  <label
                    className="text-sm font-semibold text-black mb-1"
                    htmlFor={`sponsors.${index}.name`}
                  >
                    Sponsor Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`sponsors.${index}.name`}
                    {...register(`sponsors.${index}.name`, {
                      required: "Sponsor name is required",
                    })}
                    className={`input input-bordered w-full bg-white text-black border ${
                      errors.sponsors?.[index]?.name
                        ? "border-red-500"
                        : "border-black"
                    }`}
                    placeholder="Sponsor Name"
                  />
                  {errors.sponsors?.[index]?.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.sponsors[index].name.message}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div className="flex flex-col mb-3">
                  <label
                    className="text-sm font-semibold text-black mb-1"
                    htmlFor={`sponsors.${index}.website`}
                  >
                    Website
                  </label>
                  <input
                    id={`sponsors.${index}.website`}
                    type="url"
                    {...register(`sponsors.${index}.website`)}
                    className="input input-bordered w-full bg-white text-black border border-black"
                    placeholder="https://sponsorwebsite.com"
                  />
                </div>

                {/* Tier */}
                <div className="flex flex-col mb-3">
                  <label
                    className="text-sm font-semibold text-black mb-1"
                    htmlFor={`sponsors.${index}.tier`}
                  >
                    Tier
                  </label>
                  <select
                    id={`sponsors.${index}.tier`}
                    {...register(`sponsors.${index}.tier`)}
                    className="select select-bordered w-full bg-white text-black border border-black"
                  >
                    <option value="">Select tier</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                  </select>
                </div>

                {/* Contact Email */}
                <div className="flex flex-col mb-3">
                  <label
                    className="text-sm font-semibold text-black mb-1"
                    htmlFor={`sponsors.${index}.contactEmail`}
                  >
                    Contact Email
                  </label>
                  <input
                    id={`sponsors.${index}.contactEmail`}
                    type="email"
                    {...register(`sponsors.${index}.contactEmail`)}
                    className="input input-bordered w-full bg-white text-black border border-black"
                    placeholder="email@sponsor.com"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Sponsor Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                appendSponsors({
                  name: "",
                  website: "",
                  tier: "",
                  contactEmail: "",
                })
              }
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-5 py-2 cursor-pointer"
            >
              + Add Sponsor
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-700 text-white font-semibold py-2 w-full cursor-pointer rounded shadow-lg transition-colors duration-300 mt-6 ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-800"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

// Prop Validation
EditEventModal.propTypes = {
  refetch: PropTypes.func,
  selectedEventData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    audience: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape({
      venue: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      googleMapLink: PropTypes.string,
    }),
    liveLink: PropTypes.string,
    type: PropTypes.string,
    format: PropTypes.string,
    extraNotes: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    price: PropTypes.shape({
      isFree: PropTypes.bool,
      standard: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      currency: PropTypes.string,
    }),
    registration: PropTypes.shape({
      openDate: PropTypes.string,
      closeDate: PropTypes.string,
      maxTicketsPerPerson: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      registrationUrl: PropTypes.string,
      requiresApproval: PropTypes.bool,
    }),
    organizer: PropTypes.shape({
      name: PropTypes.string,
      logo: PropTypes.string,
      contactEmail: PropTypes.string,
      contactPhone: PropTypes.string,
      website: PropTypes.string,
    }),
    media: PropTypes.shape({
      banner: PropTypes.string,
      promoVideo: PropTypes.string,
    }),
    schedule: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        speaker: PropTypes.string,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
        description: PropTypes.string,
      })
    ),
    sponsors: PropTypes.arrayOf(
      PropTypes.shape({
        tier: PropTypes.string,
        name: PropTypes.string,
        website: PropTypes.string,
        contactEmail: PropTypes.string,
      })
    ),
    postedBy: PropTypes.string,
    publishedAt: PropTypes.string,
    lastUpdated: PropTypes.string,
  }),
};

export default EditEventModal;
