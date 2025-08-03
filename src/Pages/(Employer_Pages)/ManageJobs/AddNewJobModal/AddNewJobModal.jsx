import { useState } from "react";

// Packages
import { useForm, useFieldArray } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

// Currency Data
import Currencies from "../../../../JSON/Currencies.json";

const AddNewJobModal = () => {
  const [newFieldValues, setNewFieldValues] = useState({});

  // RHF Setup
  const { watch, register, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      category: "",
      type: "",
      level: "",
      experience: "",
      description: "",
      responsibilities: [""],
      requirements: [""],
      niceToHave: [""],
      location: "",
      remote: false,
      hybrid: false,
      onsite: false,
      timezoneOverlap: "",
      salaryRange: {
        min: "",
        max: "",
        currency: "BDT",
      },
      isNegotiable: false,
      benefits: [""],
      perks: [""],
      skills: [""],
      company: {
        name: "",
        logo: "",
        website: "",
        description: "",
        location: "",
        size: "",
        industry: "",
      },
      application: {
        applyEmail: "",
        applyUrl: "",
        requiresResume: false,
        requiresPortfolio: false,
        requiresCoverLetter: false,
        applicationDeadline: "",
      },
    },
  });

  // Field Arrays
  const responsibilities = useFieldArray({ control, name: "responsibilities" });
  const requirements = useFieldArray({ control, name: "requirements" });
  const niceToHave = useFieldArray({ control, name: "niceToHave" });
  const benefits = useFieldArray({ control, name: "benefits" });
  const skills = useFieldArray({ control, name: "skills" });
  const perks = useFieldArray({ control, name: "perks" });

  // Combine field arrays for easier management
  const fieldArrays = {
    responsibilities,
    requirements,
    niceToHave,
    benefits,
    perks,
    skills,
  };

  // Fields to be dynamically rendered
  const fieldsConfig = [
    "responsibilities",
    "requirements",
    "niceToHave",
    "benefits",
    "perks",
    "skills",
  ];

  // Updated toggleValue logic using RHF only (no useState)
  const toggleValue = (key) => {
    // Set all to false first
    setValue("remote", false);
    setValue("hybrid", false);
    setValue("onsite", false);

    // Then set only the selected one to true (toggle if clicked twice)
    const current = watch(key);
    setValue(key, !current);
  };

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    // reset();
    document.getElementById("Add_New_Job_Modal").close();
  };

  return (
    <div className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => document.getElementById("Add_New_Job_Modal").close()}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">Add New Job</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Job Title */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="title">
            Job Title<span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", { required: true })}
            placeholder="e.g., Backend Developer (Node.js)"
            className="input input-bordered w-full bg-white text-black border-black"
          />
        </div>

        {/* Basic Job Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1" htmlFor="category">
              Job Category
            </label>
            <input
              id="category"
              {...register("category")}
              placeholder="e.g., Software Development"
              className="input input-bordered w-full bg-white text-black border-black"
            />
          </div>

          {/* Job Type */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1" htmlFor="type">
              Job Type
            </label>
            <select
              id="type"
              {...register("type")}
              className="select select-bordered w-full bg-white text-black border-black"
              defaultValue=""
            >
              <option value="" disabled>
                Select job type
              </option>
              <option value="Full-Time">
                Full-Time – Standard 40hr/week role
              </option>
              <option value="Part-Time">
                Part-Time – Reduced or flexible hours
              </option>
              <option value="Contract">
                Contract – Fixed-term with a defined scope
              </option>
              <option value="Temporary">
                Temporary – Short-term or seasonal work
              </option>
              <option value="Volunteer">
                Volunteer – Unpaid contribution or experience
              </option>
            </select>
          </div>

          {/* Level */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1" htmlFor="level">
              Experience Level
            </label>
            <select
              id="level"
              {...register("level")}
              className="select select-bordered w-full bg-white text-black border-black"
              defaultValue=""
            >
              <option value="" disabled>
                Select level
              </option>
              <option value="Internship">
                Internship – Ideal for students or entry-level applicants
              </option>
              <option value="Entry">
                Entry-Level – 0 to 1 year of experience
              </option>
              <option value="Junior">
                Junior – 1 to 2 years of experience
              </option>
              <option value="Mid">
                Mid-Level – 2 to 5 years of experience
              </option>
              <option value="Senior">
                Senior – 5 to 8 years of experience
              </option>
              <option value="Lead">
                Lead – 8+ years with team leadership responsibilities
              </option>
              <option value="Manager">
                Manager – Responsible for team/project management
              </option>
              <option value="Director">
                Director – Strategic leadership and multi-team oversight
              </option>
              <option value="Executive">
                Executive (VP, CTO, etc.) – High-level decision maker
              </option>
            </select>
          </div>

          {/* Experience */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1" htmlFor="experience">
              Experience Required
            </label>
            <input
              id="experience"
              {...register("experience")}
              placeholder="e.g., 3+ years"
              className="input input-bordered w-full bg-white text-black border-black"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              {...register("location")}
              placeholder="e.g., Bangalore, India"
              className="input input-bordered w-full bg-white text-black border-black"
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="flex flex-col">
          <label className="font-medium text-sm mb-1" htmlFor="description">
            Job Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Provide a clear and concise job description..."
            className="textarea textarea-bordered w-full bg-white text-black border-black"
            rows={5}
          />
        </div>

        {/* fieldsConfig for responsibilities, requirements, niceToHave, benefits, perks, skills */}
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
              />
              <button
                type="button"
                onClick={() => {
                  const value = newFieldValues[field]?.trim();
                  if (value) {
                    fieldArrays[field].append(value);
                    setNewFieldValues((prev) => ({ ...prev, [field]: "" }));
                  }
                }}
                className="flex items-center gap-2 border-2 border-blue-600 font-semibold text-blue-600 rounded shadow-xl px-5 py-1 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-500"
              >
                Add
              </button>
            </div>
          </div>
        ))}

        {/* Work Arrangement Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Work Arrangement (select one):
          </label>

          <div className="flex flex-wrap gap-4">
            {["remote", "hybrid", "onsite"].map((mode) => {
              const isSelected = watch(mode); // RHF-managed state

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => toggleValue(mode)}
                  className={`px-4 py-2 rounded border transition-all duration-300 text-sm font-semibold cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-400 hover:border-blue-500 hover:text-blue-500"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary Range */}
        <div className="flex flex-col gap-2">
          {/* Title */}
          <label className="text-sm font-medium text-gray-700">
            Salary Range
          </label>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          {/* Salary Range Inputs */}
          <div className="grid grid-cols-3 gap-2">
            {/* Minimum Salary  */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                Minimum
              </label>
              <input
                type="number"
                {...register("salaryRange.min")}
                placeholder="e.g. 30000"
                className="input input-bordered w-full bg-white text-black border-black"
              />
            </div>

            {/* Maximum Salary */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                Maximum
              </label>
              <input
                type="number"
                {...register("salaryRange.max")}
                placeholder="e.g. 60000"
                className="input input-bordered w-full bg-white text-black border-black"
              />
            </div>

            {/* Currency */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-black mb-1">
                Currency
              </label>
              <select
                {...register("salaryRange.currency")}
                className="input input-bordered w-full bg-white text-black border-black"
              >
                <option value="">Select Currency</option>
                {Currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} – {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Salary Negotiable Toggle  */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="isNegotiable"
            className="text-sm font-medium text-gray-700"
          >
            Salary is negotiable
          </label>
          <label className="relative inline-block w-11 h-6 cursor-pointer">
            <input
              type="checkbox"
              id="isNegotiable"
              {...register("isNegotiable")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-700 transition-all duration-300" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full" />
          </label>
        </div>

        {/* Company Info */}
        <>
          {/* Title */}
          <h4 className="font-semibold mt-4">Company Info</h4>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          {/* Company Information */}
          <div className="grid grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="flex flex-col">
              <label htmlFor="companyName" className="font-medium text-sm mb-1">
                Company Name
              </label>
              <input
                id="companyName"
                {...register("company.name")}
                placeholder="Company Name"
                className="input input-bordered w-full bg-white text-black border-black"
              />
            </div>

            {/* Company Logo */}
            <div className="flex flex-col">
              <label htmlFor="companyLogo" className="font-medium text-sm mb-1">
                Logo URL
              </label>
              <input
                id="companyLogo"
                {...register("company.logo")}
                placeholder="Logo URL"
                className="input input-bordered w-full bg-white text-black border-black"
              />
            </div>

            {/* Website URL */}
            <div className="flex flex-col">
              <label
                htmlFor="companyWebsite"
                className="font-medium text-sm mb-1"
              >
                Website URL
              </label>
              <input
                id="companyWebsite"
                {...register("company.website")}
                placeholder="Website URL"
                className="input input-bordered w-full bg-white text-black border-black"
              />
            </div>

            {/* Company Size */}
            <div className="flex flex-col">
              <label htmlFor="companySize" className="font-medium text-sm mb-1">
                Company Size
              </label>
              <input
                id="companySize"
                {...register("company.size")}
                placeholder="Company Size"
                className="input input-bordered w-full bg-white text-black border-black"
              />
            </div>
          </div>

          {/* Company Description */}
          <div className="flex flex-col mt-4">
            <label
              htmlFor="companyDescription"
              className="font-medium text-sm mb-1"
            >
              Company Description
            </label>
            <textarea
              id="companyDescription"
              {...register("company.description")}
              placeholder="Company Description"
              className="textarea textarea-bordered w-full bg-white text-black border-black"
            />
          </div>
        </>

        {/* Application Info */}
        <>
          {/* Title */}
          <h4 className="font-semibold mt-4">Application Info</h4>

          {/* Divider */}
          <div className="bg-blue-700 p-[1px] mb-4" />

          {/* Apply Email */}
          <div className="flex flex-col mb-4">
            <label htmlFor="applyEmail" className="font-medium text-sm mb-1">
              Apply Email ( If Required )
            </label>
            <input
              id="applyEmail"
              {...register("application.applyEmail")}
              placeholder="Enter application email address"
              className="input input-bordered w-full bg-white text-black border-black"
            />
          </div>

          {/* Apply URL */}
          <div className="flex flex-col mb-4">
            <label htmlFor="applyUrl" className="font-medium text-sm mb-1">
              Apply URL ( If Required )
            </label>
            <input
              id="applyUrl"
              {...register("application.applyUrl")}
              placeholder="Enter external application link"
              className="input input-bordered w-full bg-white text-black border-black"
            />
          </div>

          {/* Application Deadline */}
          <div className="flex flex-col mb-4">
            <label
              htmlFor="applicationDeadline"
              className="font-medium text-sm mb-1"
            >
              Application Deadline
            </label>
            <input
              id="applicationDeadline"
              type="datetime-local"
              {...register("application.applicationDeadline")}
              className="input input-bordered w-full bg-white text-black border-black"
            />
          </div>
        </>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Requires Resume */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="requiresResume"
              className="text-sm font-medium text-gray-700"
            >
              Requires Resume
            </label>
            <label className="relative inline-block w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                id="requiresResume"
                {...register("application.requiresResume")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full" />
            </label>
          </div>

          {/* Requires Portfolio */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="requiresPortfolio"
              className="text-sm font-medium text-gray-700"
            >
              Requires Portfolio
            </label>
            <label className="relative inline-block w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                id="requiresPortfolio"
                {...register("application.requiresPortfolio")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full" />
            </label>
          </div>

          {/* Requires Cover Letter */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="requiresCoverLetter"
              className="text-sm font-medium text-gray-700"
            >
              Requires Cover Letter
            </label>
            <label className="relative inline-block w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                id="requiresCoverLetter"
                {...register("application.requiresCoverLetter")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full" />
            </label>
          </div>
        </div>

        {/* Post Job Button */}
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2  w-full cursor-pointer rounded shadow-lg transition-colors duration-300 mt-6"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AddNewJobModal;
