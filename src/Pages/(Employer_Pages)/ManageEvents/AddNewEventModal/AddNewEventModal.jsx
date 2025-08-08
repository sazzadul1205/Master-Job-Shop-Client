import { useRef, useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm, useFieldArray } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { RxCross2 } from "react-icons/rx";

const AddNewEventModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // New Field Values State
  const [newFieldValues, setNewFieldValues] = useState({});

  // Posting States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // inside your component:
  const inputRefs = useRef({});

  // RHF setup
  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subCategory: "",
      tags: [],
      type: "",
      format: "",
      status: "",
      extraNotes: "",
      location: {
        venue: "",
        address: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
      },
      startDate: "",
      endDate: "",
      timezone: "",
      schedule: [],
      audience: [],
      capacity: "",
      price: {
        currency: "",
        standard: "",
        earlyBird: "",
        isFree: false,
      },
      registration: {
        openDate: "",
        closeDate: "",
        maxTicketsPerPerson: "",
        requiresApproval: false,
        registrationUrl: "",
      },
      organizer: {
        name: "",
        logo: "",
        bio: "",
        contactEmail: "",
        contactPhone: "",
        website: "",
      },
      speakers: [],
      sponsors: [],
      media: {
        banner: "",
        gallery: [],
        promoVideo: "",
      },
      publishedAt: "",
      lastUpdated: "",
    },
  });

  // Watch Values
  const isRemote = watch("isRemote");
  const formatValue = watch("format");

  // Field Arrays
  const tags = useFieldArray({ control, name: "tags" });

  // Combine field arrays for easier management
  const fieldArrays = {
    tags,
  };

  // Fields to be dynamically rendered
  const fieldsConfig = ["tags"];

  // On Submit Handler
  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div
      id="Add_New_Event_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => document.getElementById("Add_New_Event_Modal").close()}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">Add New Event</h3>

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
            <option value="Roundtable">Roundtable</option>
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
            <option value="Bootcamp">Bootcamp</option>
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

        {/* Extra Notes */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="extraNotes">
            Extra Notes
          </label>
          <textarea
            id="extraNotes"
            rows={3}
            {...register("extraNotes")}
            placeholder="Additional instructions or details..."
            className="textarea textarea-bordered w-full bg-white text-black border border-black"
          />
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
            <label className="font-medium text-sm mb-1" htmlFor="copyPasteLink">
              Copy/Paste Link<span className="text-red-500">*</span>
            </label>
            <input
              id="copyPasteLink"
              {...register("copyPasteLink", { required: "Link is required" })}
              placeholder="Enter the meeting/event link"
              className={`input input-bordered w-full bg-white text-black border ${
                errors.copyPasteLink ? "border-red-500" : "border-black"
              }`}
            />
            {errors.copyPasteLink && (
              <p className="text-sm text-red-600 mt-1">
                {errors.copyPasteLink.message}
              </p>
            )}
          </div>
        )}

        {/* Dates */}
        <>
          {/* Title */}
          <h3 className="font-bold mt-6">Time</h3>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["startDate", "endDate", "publishedAt", "lastUpdated"].map(
              (field) => {
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
              }
            )}
          </div>
        </>

        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="timezone">
            Timezone
          </label>
          <input
            id="timezone"
            {...register("timezone")}
            placeholder="e.g., Asia/Dhaka"
            className="input input-bordered w-full bg-white text-black border border-black"
          />
        </div>

        {/* Capacity & Pricing */}
        <h4 className="font-bold mt-6">Capacity & Pricing</h4>
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="capacity">
            Capacity
          </label>
          <input
            id="capacity"
            type="number"
            {...register("capacity")}
            className="input input-bordered w-full bg-white text-black border border-black"
          />
        </div>
        {["currency", "standard", "earlyBird"].map((field) => (
          <div className="flex flex-col" key={field}>
            <label
              className="font-medium text-sm mb-1"
              htmlFor={`price.${field}`}
            >
              {`Price ${field}`}
            </label>
            <input
              id={`price.${field}`}
              {...register(`price.${field}`)}
              placeholder={`Enter ${field}`}
              className="input input-bordered w-full bg-white text-black border border-black"
            />
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <input
            id="price.isFree"
            type="checkbox"
            {...register("price.isFree")}
          />
          <label htmlFor="price.isFree" className="text-sm">
            Is Free?
          </label>
        </div>

        {/* Registration */}
        <h4 className="font-bold mt-6">Registration</h4>
        {["openDate", "closeDate"].map((field) => (
          <div className="flex flex-col" key={field}>
            <label
              className="font-medium text-sm mb-1"
              htmlFor={`registration.${field}`}
            >
              {field}
            </label>
            <input
              id={`registration.${field}`}
              type="datetime-local"
              {...register(`registration.${field}`)}
              className="input input-bordered w-full bg-white text-black border border-black"
            />
          </div>
        ))}
        <div className="flex flex-col">
          <label
            className="font-medium text-sm mb-1"
            htmlFor="registration.maxTicketsPerPerson"
          >
            Max Tickets Per Person
          </label>
          <input
            id="registration.maxTicketsPerPerson"
            type="number"
            {...register("registration.maxTicketsPerPerson")}
            className="input input-bordered w-full bg-white text-black border border-black"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="registration.requiresApproval"
            type="checkbox"
            {...register("registration.requiresApproval")}
          />
          <label htmlFor="registration.requiresApproval" className="text-sm">
            Requires Approval?
          </label>
        </div>
        <div className="flex flex-col">
          <label
            className="font-medium text-sm mb-1"
            htmlFor="registration.registrationUrl"
          >
            Registration URL
          </label>
          <input
            id="registration.registrationUrl"
            {...register("registration.registrationUrl")}
            placeholder="https://..."
            className="input input-bordered w-full bg-white text-black border border-black"
          />
        </div>

        {/* Media */}
        <h4 className="font-bold mt-6">Media</h4>
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="media.banner">
            Banner URL
          </label>
          <input
            id="media.banner"
            {...register("media.banner")}
            placeholder="https://..."
            className="input input-bordered w-full bg-white text-black border border-black"
          />
        </div>
        <div className="flex flex-col">
          <label
            className="font-medium text-sm mb-1"
            htmlFor="media.promoVideo"
          >
            Promo Video URL
          </label>
          <input
            id="media.promoVideo"
            {...register("media.promoVideo")}
            placeholder="https://..."
            className="input input-bordered w-full bg-white text-black border border-black"
          />
        </div>
      </form>
    </div>
  );
};

AddNewEventModal.propTypes = {
  refetch: PropTypes.func,
};

export default AddNewEventModal;
