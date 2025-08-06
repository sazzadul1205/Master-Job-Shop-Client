import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

// Currency Data
import Currencies from "../../../../JSON/Currencies.json";

const AddNewGigModal = ({ CompanyData, refetch }) => {
  // New Field Values State
  const [newFieldValues, setNewFieldValues] = useState({});

  // Posting States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // inside your component:
  const inputRefs = useRef({});

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
      tags: [""],
      deliveryDeadline: "",
      requiredSkills: [""],
      attachments: [{ url: "", type: "", label: "" }],
      isRemote: false,
      location: "",
      budget: {
        type: "",
        min: "",
        max: "",
        currency: "",
        isNegotiable: false,
      },
      communication: {
        preferredMethod: "",
        allowCalls: false,
      },
      extraNotes: "",
    },
  });

  // Watch isRemote value
  const isRemote = watch("isRemote");
  // Watch attachments to check length dynamically
  const attachments = watch("attachments");

  // Field Arrays
  const requiredSkills = useFieldArray({ control, name: "requiredSkills" });
  const tags = useFieldArray({ control, name: "tags" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachments",
  });

  const fieldArrays = {
    tags,
    requiredSkills,
  };

  //
  const fieldsConfig = ["tags", "requiredSkills"];

  const postedBy = {
    email: CompanyData.email,
    name: CompanyData.name,
    profileImage: CompanyData.logo,
    rating: CompanyData.rating || 0,
  };

  // Effect: If no attachments, always append one empty
  useEffect(() => {
    if (attachments.length === 0) {
      append({ url: "", type: "", label: "" });
    }
  }, [attachments, append]);

  // On Submit Handler
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      postedBy,
      status: "open",
      postedAt: new Date(),
    };

    console.log(payload);
  };
  return (
    <div className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => document.getElementById("Add_New_Gig_Modal").close()}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">Add New Gig</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Alert Messages */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Job Title */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="title">
            Job Title<span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", { required: "Job title is required" })}
            placeholder="e.g., Design a Modern Logo"
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
            {...register("description", {
              required: "Job description is required",
              minLength: {
                value: 20,
                message: "Description should be at least 20 characters long",
              },
            })}
            placeholder="Provide a clear and concise Gig description..."
            className={`textarea textarea-bordered w-full bg-white text-black border ${
              errors.description ? "border-red-500" : "border-black"
            }`}
            rows={5}
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

        {/* Delivery Deadline */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1">Delivery Deadline</label>
          <input
            type="datetime-local"
            {...register("deliveryDeadline", {
              required: "Delivery deadline is required",
            })}
            className={`input input-bordered w-full bg-white text-black border ${
              errors.deliveryDeadline ? "border-red-500" : "border-black"
            }`}
            min={new Date().toISOString().slice(0, 16)}
          />
          {errors.deliveryDeadline && (
            <p className="text-sm text-red-600 mt-1">
              {errors.deliveryDeadline.message}
            </p>
          )}
        </div>

        {/* Remote Option */}
        <>
          {/* Remote Option Toggle */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="isRemote"
              className="text-sm font-medium text-gray-700"
            >
              This job can be done remotely
            </label>

            <label className="relative inline-block w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                id="isRemote"
                {...register("isRemote")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-700 transition-all duration-300" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full" />
            </label>
          </div>

          {/* Location - only show if NOT remote */}
          {!isRemote && (
            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1" htmlFor="location">
                Location
                {!isRemote && <span className="text-red-500">*</span>}
              </label>
              <input
                id="location"
                {...register("location", {
                  validate: (value) => {
                    if (!isRemote && (!value || value.trim() === "")) {
                      return "Location is required";
                    }
                    return true;
                  },
                })}
                placeholder="e.g., Bangalore, India"
                className={`input input-bordered w-full bg-white text-black border ${
                  errors.location ? "border-red-500" : "border-black"
                }`}
              />
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          )}
        </>

        {/* Budget */}
        <>
          {/* Title */}
          <h4 className="font-semibold mt-4">Budget Info</h4>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          {/* Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Minimum Salary  */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                Minimum <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("budget.min", {
                  required: "Minimum salary is required",
                  min: {
                    value: 0,
                    message: "Minimum must be at least 0",
                  },
                })}
                placeholder="e.g. 30000"
                className={`input input-bordered w-full bg-white text-black border ${
                  errors?.budget?.min ? "border-red-500" : "border-black"
                }`}
              />
              {errors?.budget?.min && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.budget.min.message}
                </p>
              )}
            </div>

            {/* Maximum Salary */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                Maximum <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("budget.max", {
                  required: "Maximum salary is required",
                  validate: (value) => {
                    const min = Number(watch("budget.min"));
                    if (value && min && Number(value) < min) {
                      return "Maximum must be greater than or equal to minimum";
                    }
                    return true;
                  },
                })}
                placeholder="e.g. 60000"
                className={`input input-bordered w-full bg-white text-black border ${
                  errors?.budget?.max ? "border-red-500" : "border-black"
                }`}
              />
              {errors?.budget?.max && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.budget.max.message}
                </p>
              )}
            </div>

            {/* Budget Type */}
            <div className="flex flex-col">
              <label htmlFor="budget-type" className="font-medium text-sm mb-1">
                Budget Type <span className="text-red-500">*</span>
              </label>
              <select
                id="budget-type"
                {...register("budget.type", {
                  required: "Budget type is required",
                })}
                className={`input input-bordered w-full bg-white text-black border ${
                  errors.communication?.preferredMethod
                    ? "border-red-500"
                    : "border-black"
                } cursor-pointer`}
              >
                <option value="">Select Budget Type</option>
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
              </select>
              {errors?.budget?.type && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.budget.type.message}
                </p>
              )}
            </div>

            {/* Currency */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                {...register("budget.currency", {
                  required: "Currency selection is required",
                })}
                className={`input input-bordered w-full bg-white text-black border ${
                  errors.communication?.preferredMethod
                    ? "border-red-500"
                    : "border-black"
                } cursor-pointer`}
              >
                <option value="">Select Currency</option>
                {Currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} – {currency.name}
                  </option>
                ))}
              </select>
              {errors?.salaryRange?.currency && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.salaryRange.currency.message}
                </p>
              )}
            </div>

            {/* Negotiable Toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  id="negotiable"
                  {...register("budget.isNegotiable")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-700 transition-all duration-300"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full"></div>
              </label>
              <label
                htmlFor="negotiable"
                className="text-sm font-medium text-gray-700"
              >
                Negotiable
              </label>
            </div>
          </div>
        </>

        {/* Communication */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preferred Method */}
          <div>
            <label
              className="font-medium text-sm mb-1"
              htmlFor="preferredMethod"
            >
              Preferred Method <span className="text-red-500">*</span>
            </label>
            <select
              id="preferredMethod"
              {...register("communication.preferredMethod", {
                required: "Please select a communication method",
              })}
              className={`input input-bordered w-full bg-white text-black border ${
                errors.communication?.preferredMethod
                  ? "border-red-500"
                  : "border-black"
              } cursor-pointer`}
            >
              <option value="">Select one</option>
              <option value="Chat">Chat</option>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Video Call">Video Call</option>
              <option value="Messaging App">
                Messaging App (e.g., WhatsApp, Slack)
              </option>
              <option value="In-Person">In-Person</option>
            </select>
            {errors.communication?.preferredMethod && (
              <p className="text-sm text-red-600 mt-1">
                {errors.communication.preferredMethod.message}
              </p>
            )}
          </div>

          {/* Allow Calls Toggle */}
          <div className="flex items-center gap-3 mt-6">
            <label
              htmlFor="allowCalls"
              className="text-sm font-medium text-gray-700"
            >
              Allow Calls
            </label>
            <label className="relative inline-block w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                id="allowCalls"
                {...register("communication.allowCalls")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-700 transition-all duration-300" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full" />
            </label>
          </div>
        </div>

        {/* Extra Notes */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1">Extra Notes</label>
          <textarea
            {...register("extraNotes")}
            placeholder="Provide a clear and concise Gig Extra Notes..."
            className={`textarea textarea-bordered w-full bg-white text-black border ${
              errors.extraNotes ? "border-red-500" : "border-black"
            }`}
            rows={5}
          />
          {errors.extraNotes && (
            <p className="text-sm text-red-600 mt-1">
              {errors.extraNotes.message}
            </p>
          )}
        </div>

        {/* Attachments Section */}
        <div className="mb-6 ">
          <label className="font-medium text-sm mb-2 block">Attachments</label>

          <div className="border border-gray-400">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center rounded p-3">
                {/* URL */}
                <div className="flex flex-col w-[300px] mr-1">
                  <label className="font-medium text-sm mb-1">URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/file.png"
                    {...register(`attachments.${index}.url`, {
                      required: "URL is required",
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[\w.-]*)*\/?$/,
                        message: "Invalid URL",
                      },
                    })}
                    className={`input input-bordered bg-white border ${
                      errors.attachments?.[index]?.url
                        ? "border-red-500"
                        : "border-black"
                    }`}
                  />
                  {errors.attachments?.[index]?.url && (
                    <span className="text-sm text-red-600">
                      {errors.attachments[index].url.message}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="flex flex-col w-[300px] mr-1">
                  <label className="font-medium text-sm mb-1">Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Wireframe"
                    {...register(`attachments.${index}.label`, {
                      required: "Label is required",
                    })}
                    className={`input input-bordered bg-white border ${
                      errors.attachments?.[index]?.label
                        ? "border-red-500"
                        : "border-black"
                    }`}
                  />
                  {errors.attachments?.[index]?.label && (
                    <span className="text-sm text-red-600">
                      {errors.attachments[index].label.message}
                    </span>
                  )}
                </div>

                {/* Type */}
                <div className="flex flex-col w-[100px] mr-1">
                  <label className="font-medium text-sm mb-1">Type</label>
                  <select
                    {...register(`attachments.${index}.type`, {
                      required: "Type is required",
                    })}
                    className={`input input-bordered bg-white border ${
                      errors.attachments?.[index]?.type
                        ? "border-red-500"
                        : "border-black"
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="image">Image</option>
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.attachments?.[index]?.type && (
                    <span className="text-sm text-red-600">
                      {errors.attachments[index].type.message}
                    </span>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  className="flex items-center justify-center text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-bold mt-6 w-[40px] h-[40px] rounded cursor-pointer transition-colors duration-300"
                  type="button"
                  onClick={() => {
                    remove(index);
                    if (fields.length === 1) {
                      append({ url: "", type: "", label: "" });
                    }
                  }}
                >
                  <ImCross />
                </button>
              </div>
            ))}
          </div>

          {/* Add Attachment Button */}
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => append({ url: "", type: "", label: "" })}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 cursor-pointer transition"
            >
              Add Attachment
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
          {isLoading ? "Posting..." : "Post Gig"}
        </button>
      </form>
    </div>
  );
};

export default AddNewGigModal;
