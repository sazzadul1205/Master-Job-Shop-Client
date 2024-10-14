import { useForm, useFieldArray } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../Pages/Shared/Loader/Loader";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../Provider/AuthProvider";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalAddJob = ({ refetch }) => {
  const { register, handleSubmit, control, setValue, reset } = useForm();
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [selectedCompanyCode, setSelectedCompanyCode] = useState(""); // State to store the selected company code

  const {
    fields: responsibilityFields,
    append: addResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({ control, name: "responsibilities" });
  const {
    fields: qualificationFields,
    append: addQualification,
    remove: removeQualification,
  } = useFieldArray({ control, name: "qualifications" });
  const {
    fields: toolsFields,
    append: addTool,
    remove: removeTool,
  } = useFieldArray({ control, name: "toolsAndTechnologies" });

  // Fetching Posted Job Data
  const {
    data: CompanyProfilesNamesCodesData = [],
    isLoading: CompanyProfilesNamesCodesDataIsLoading,
    error: CompanyProfilesNamesCodesDataError,
  } = useQuery({
    queryKey: ["CompanyProfilesNamesCodesData"],
    queryFn: () =>
      axiosPublic.get(`/Company-Profiles-Names-Codes`).then((res) => res.data),
  });

  // Loading state
  if (CompanyProfilesNamesCodesDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (CompanyProfilesNamesCodesDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  const onSubmit = async (data) => {
    const currentDate = new Date().toISOString(); // Get current date in ISO format

    const jobData = {
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      companyName: data.companyName,
      companyCode: data.companyCode,
      companyLogo: data.companyLogo,
      companyRating: parseFloat(data.companyRating), // Assuming rating is a number
      companyLink: data.companyLink,
      location: data.location,
      jobType: data.jobType,
      salary: data.salary,
      postedDate: currentDate, // Current date in ISO format
      availableUntil: data.availableUntil, // Pass the available until date from the form
      PeopleApplied: [], // Empty array initially
      responsibilities: data.responsibilities, // Array of responsibilities
      qualifications: data.qualifications, // Array of qualifications
      toolsAndTechnologies: data.toolsAndTechnologies, // Array of tools & technologies
      postedBy: {
        email: user.email, // Static for now
        name: user.displayName,
      },
      ApproveState: "InProgress",
    };

    try {
      // POST jobData to the backend API at the /Posted-Job endpoint
      const response = await axiosPublic.post("/Posted-Job", jobData);

      // Success alert with SweetAlert2
      Swal.fire({
        title: "Job Posted!",
        text: "Your job has been posted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Reset the form
        reset();

        // Refetch data (if needed)
        refetch();
      });
      // Close the modal or popup after success
      document.getElementById("Create_New_Job").close();

      console.log("Job posted successfully:", response.data);
    } catch (error) {
      // Error alert with SweetAlert2
      Swal.fire({
        title: "Error!",
        text: "There was an error posting the job. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error posting job:", error);
    }
  };

  const handleCompanyChange = (e) => {
    const selectedCompanyName = e.target.value;
    const selectedCompany = CompanyProfilesNamesCodesData.find(
      (company) => company.companyName === selectedCompanyName
    );
    if (selectedCompany) {
      setSelectedCompanyCode(selectedCompany.companyCode);
      setValue("companyCode", selectedCompany.companyCode); // Set companyCode field automatically
    }
  };

  const renderFieldArray = (
    fields,
    registerFn,
    removeFn,
    addFn,
    label,
    name
  ) => (
    <div>
      <label>{label}</label>
      {fields.map((item, index) => (
        <div key={item.id} className="flex space-x-2 mb-1">
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            {...registerFn(`${name}.${index}`)}
            defaultValue={item}
            placeholder={`Enter ${label.toLowerCase().slice(0, -1)}`}
          />
          <button
            type="button"
            className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
            onClick={() => removeFn(index)}
          >
            Remove
          </button>
        </div>
      ))}
      {fields.length === 0 && addFn("")}
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-5"
        onClick={() => addFn("")}
      >
        Add {label.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <div className="modal-box bg-white max-w-[800px] p-0">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p>Add New Job</p>
        <button
          onClick={() => document.getElementById("Create_New_Job").close()}
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        {/* Job Title */}
        <div className="space-y-2">
          <label>Job Title:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("jobTitle", { required: true })}
            placeholder="Enter job title"
          />
        </div>

        {/* Job Description (Textarea) */}
        <div className="space-y-2">
          <label>Job Description:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36"
            {...register("jobDescription", { required: true })}
            placeholder="Enter job description"
          />
        </div>

        {/* Company Name Dropdown */}
        <div className="space-y-2">
          <label>Company Name:</label>
          <select
            className="input input-bordered w-full bg-white border-black rounded-none"
            {...register("companyName", { required: true })}
            onChange={handleCompanyChange} // Call handleCompanyChange on selection
          >
            <option value="">Select a company</option>
            {CompanyProfilesNamesCodesData.map((company) => (
              <option key={company._id} value={company.companyName}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Company Code (grayed-out) */}
        <div className="space-y-2">
          <label>Company Code:</label>
          <input
            className="input input-bordered w-full bg-gray-300 border-black rounded-none"
            type="text"
            {...register("companyCode", { required: true })}
            value={selectedCompanyCode} // Automatically set based on selected company
            readOnly
          />
        </div>

        {[
          { label: "Company Logo URL", name: "companyLogo", type: "url" },
          { label: "Salary", name: "salary", type: "text" },
          { label: "Company Website", name: "companyLink", type: "url" },
          { label: "Location", name: "location", type: "text" },
          { label: "Job Type", name: "jobType", type: "text" },
        ].map(({ label, name, type }) => (
          <div className="space-y-2" key={name}>
            <label>{label}:</label>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none"
              type={type}
              {...register(name, { required: true })}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}

        {/* Responsibilities, Qualifications, Tools & Technologies */}
        {renderFieldArray(
          responsibilityFields,
          register,
          removeResponsibility,
          addResponsibility,
          "Responsibilities",
          "responsibilities"
        )}
        {renderFieldArray(
          qualificationFields,
          register,
          removeQualification,
          addQualification,
          "Qualifications",
          "qualifications"
        )}
        {renderFieldArray(
          toolsFields,
          register,
          removeTool,
          addTool,
          "Tools and Technologies",
          "toolsAndTechnologies"
        )}

        {/* Available Until */}
        <div className="space-y-2">
          <label>Available Until:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="date" // Changed to date input
            {...register("availableUntil", { required: true })}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-14"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalAddJob;

// PropTypes validation
ModalAddJob.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
