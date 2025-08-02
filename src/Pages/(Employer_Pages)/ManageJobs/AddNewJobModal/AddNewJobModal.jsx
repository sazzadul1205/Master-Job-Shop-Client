import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ImCross } from "react-icons/im";

const AddNewJobModal = () => {
  const [newFieldValues, setNewFieldValues] = useState({});

  //   Form setup with default values
  const {
    watch,
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
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
        currency: "INR",
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

  // Inside your component, not inside map
  const responsibilities = useFieldArray({ control, name: "responsibilities" });
  const requirements = useFieldArray({ control, name: "requirements" });
  const niceToHave = useFieldArray({ control, name: "niceToHave" });
  const benefits = useFieldArray({ control, name: "benefits" });
  const perks = useFieldArray({ control, name: "perks" });
  const skills = useFieldArray({ control, name: "skills" });

  const fieldArrays = {
    responsibilities,
    requirements,
    niceToHave,
    benefits,
    perks,
    skills,
  };

  // Fields to be displayed
  const fieldsConfig = [
    "responsibilities",
    "requirements",
    "niceToHave",
    "benefits",
    "perks",
    "skills",
  ];

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    reset();
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

      <h3 className="font-bold text-xl text-center mb-4">Add New Job</h3>
      <div className="p-[1px] bg-blue-500 mb-4" />

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
            <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3">
              {fieldArrays[field].fields.length > 0 ? (
                fieldArrays[field].fields.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => fieldArrays[field].remove(index)}
                    className="border border-blue-700 font-semibold text-blue-800 gap-4 px-3 py-1 rounded cursor-pointer hover:bg-blue-200 transition-all duration-200 text-sm my-2 mx-2"
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
                className="input input-bordered bg-white text-black border-black w-1/2"
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

        {/* Remote / Hybrid / Onsite */}
        <div className="flex gap-4">
          <label>
            <input type="checkbox" {...register("remote")} /> Remote
          </label>
          <label>
            <input type="checkbox" {...register("hybrid")} /> Hybrid
          </label>
          <label>
            <input type="checkbox" {...register("onsite")} /> Onsite
          </label>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            {...register("salaryRange.min")}
            placeholder="Min Salary"
            className="input input-bordered w-full"
          />
          <input
            type="number"
            {...register("salaryRange.max")}
            placeholder="Max Salary"
            className="input input-bordered w-full"
          />
          <input
            {...register("salaryRange.currency")}
            placeholder="Currency"
            className="input input-bordered w-full"
          />
        </div>
        <label>
          <input type="checkbox" {...register("isNegotiable")} /> Salary is
          negotiable
        </label>

        {/* Company Info */}
        <h4 className="font-semibold mt-4">Company Info</h4>
        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("company.name")}
            placeholder="Company Name"
            className="input input-bordered w-full"
          />
          <input
            {...register("company.logo")}
            placeholder="Logo URL"
            className="input input-bordered w-full"
          />
          <input
            {...register("company.website")}
            placeholder="Website URL"
            className="input input-bordered w-full"
          />
          <input
            {...register("company.size")}
            placeholder="Company Size"
            className="input input-bordered w-full"
          />
        </div>
        <textarea
          {...register("company.description")}
          placeholder="Company Description"
          className="textarea textarea-bordered w-full"
        />

        {/* Application Info */}
        <h4 className="font-semibold mt-4">Application Info</h4>
        <input
          {...register("application.applyEmail")}
          placeholder="Apply Email"
          className="input input-bordered w-full"
        />
        <input
          {...register("application.applyUrl")}
          placeholder="Apply URL"
          className="input input-bordered w-full"
        />
        <input
          type="datetime-local"
          {...register("application.applicationDeadline")}
          className="input input-bordered w-full"
        />
        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              {...register("application.requiresResume")}
            />{" "}
            Requires Resume
          </label>
          <label>
            <input
              type="checkbox"
              {...register("application.requiresPortfolio")}
            />{" "}
            Requires Portfolio
          </label>
          <label>
            <input
              type="checkbox"
              {...register("application.requiresCoverLetter")}
            />{" "}
            Requires Cover Letter
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AddNewJobModal;
