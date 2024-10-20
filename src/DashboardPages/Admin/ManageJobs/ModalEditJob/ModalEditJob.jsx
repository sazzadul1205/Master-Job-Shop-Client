/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useEffect } from "react";

const ModalEditJob = ({ editJobData, refetch }) => {
  const { register, handleSubmit, control, reset } = useForm();
  const axiosPublic = useAxiosPublic();

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

  // Set the form values to the editJobData when the component mounts or when editJobData changes
  useEffect(() => {
    if (editJobData) {
      reset({
        jobTitle: editJobData.jobTitle,
        jobDescription: editJobData.jobDescription,
        companyName: editJobData.companyName,
        companyCode: editJobData.companyCode,
        companyLogo: editJobData.companyLogo,
        companyRating: editJobData.companyRating,
        companyLink: editJobData.companyLink,
        location: editJobData.location,
        jobType: editJobData.jobType,
        salary: editJobData.salary,
        availableUntil: editJobData.availableUntil,
        responsibilities: editJobData.responsibilities,
        qualifications: editJobData.qualifications,
        toolsAndTechnologies: editJobData.toolsAndTechnologies,
      });
    }
  }, [editJobData, reset]);

  const onSubmit = async (data) => {
    try {
      // PUT jobData to the backend API at the /Posted-Job/:id endpoint
      const response = await axiosPublic.put(
        `/Posted-Job/${editJobData._id}`,
        data
      );

      // Success alert with SweetAlert2
      Swal.fire({
        title: "Job Updated!",
        text: "Your job has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Refetch data (if needed)

        refetch();

        // Close the modal after success
      });

      console.log("Job updated successfully:", response.data);
    } catch (error) {
      // Error alert with SweetAlert2
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the job. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error updating job:", error);
    }
    document.getElementById("Edit_Job").close();
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p>Edit Job</p>
        <button onClick={() => document.getElementById("Edit_Job").close()}>
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        {/* Job Title */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Job Title:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("jobTitle", { required: true })}
            placeholder="Enter job title"
          />
        </div>

        {/* Job Description (Textarea) */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Job Description:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36"
            {...register("jobDescription", { required: true })}
            placeholder="Enter job description"
          />
        </div>

        {/* Company Name */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Company Name:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("companyName", { required: true })}
            placeholder="Enter company name"
          />
        </div>

        {/* Company Code (grayed-out) */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Company Code:</label>
          <input
            className="input input-bordered w-full bg-gray-300 border-black rounded-none"
            type="text"
            {...register("companyCode", { required: true })}
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
          <div className="flex items-center gap-2" key={name}>
            <label className="font-bold w-48 text-xl">{label}:</label>
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
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Available Until:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="date"
            {...register("availableUntil", { required: true })}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-14"
          >
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
};

const renderFieldArray = (fields, registerFn, removeFn, addFn, label, name) => (
  <div className="border border-gray-300 p-3">
    <label className="font-bold w-48 text-xl">{label}</label>
    {fields.map((item, index) => (
      <div key={item.id} className="flex mb-1">
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

export default ModalEditJob;
