import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const ModalEditInternship = ({ InternshipData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      skillsRequired: [""],
      responsibilities: [""],
      qualifications: [""],
      applicants: [],
    },
  });

  const {
    fields: fieldsSkillsRequired,
    append: appendSkillsRequired,
    remove: removeSkillsRequired,
  } = useFieldArray({ control, name: "skillsRequired" });

  const {
    fields: fieldsResponsibilities,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({ control, name: "responsibilities" });

  const {
    fields: fieldsQualifications,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({ control, name: "qualifications" });

  // Populate form with fetched internship data
  useEffect(() => {
    if (InternshipData) {
      reset({
        companyName: InternshipData?.companyName,
        companyLogo: InternshipData?.companyLogo,
        postedBy: InternshipData?.postedBy,
        position: InternshipData?.position,
        duration: InternshipData?.duration,
        description: InternshipData?.description,
        location: InternshipData?.location,
        stipend: InternshipData?.stipend,
        skillsRequired: InternshipData?.skillsRequired || [""], // Populate skillsRequired or set default empty array
        applicationDeadline: InternshipData?.applicationDeadline,
        responsibilities: InternshipData?.responsibilities || [""], // Populate responsibilities or set default empty array
        qualifications: InternshipData?.qualifications || [""], // Populate qualifications or set default empty array
        contact: {
          email: InternshipData?.contact?.email,
          facebook: InternshipData?.contact?.facebook,
          website: InternshipData?.contact?.website,
        },
      });
    }
  }, [InternshipData, reset]);

  const onSubmit = async (data) => {
    try {
      // Make the PUT request to update the mentorship by ID
      await axiosPublic.put(`/Internship/${InternshipData._id}`, data);

      // Show a success alert
      Swal.fire({
        title: "Success!",
        text: "Mentorship updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      document.getElementById("Edit_Internship_Modal").close();
      refetch();
    } catch (error) {
      // Show an error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to update mentorship. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error updating mentorship:", error);
    }
  };
  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      {/* Top section */}
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white ">
        <p className="text-xl">Edit My Mentorship</p>
        <button
          onClick={() =>
            document.getElementById("Edit_Internship_Modal").close()
          }
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        <FormInput
          label="Company Name"
          register={register("companyName", {
            required: "Company Name is required",
          })}
          errors={errors.companyName}
          placeholder="Enter company name"
        />
        <FormInput
          label="Company Logo URL"
          register={register("companyLogo", {
            required: "Company Logo is required",
          })}
          errors={errors.companyLogo}
          placeholder="Enter company logo URL"
        />
        <FormInput
          label="Position"
          register={register("position", { required: "Position is required" })}
          errors={errors.position}
          placeholder="Enter internship position"
        />
        <FormInput
          label="Duration"
          register={register("duration", { required: "Duration is required" })}
          errors={errors.duration}
          placeholder="Enter duration"
        />
        <FormInput
          label="Location"
          register={register("location", { required: "Location is required" })}
          errors={errors.location}
          placeholder="Enter location"
        />
        <FormInput
          label="Stipend"
          register={register("stipend", { required: "Stipend is required" })}
          errors={errors.stipend}
          placeholder="Enter stipend"
        />
        <FormInput
          label="Application Deadline"
          type="date"
          register={register("applicationDeadline", {
            required: "Deadline is required",
          })}
          errors={errors.applicationDeadline}
        />
        <FormInput
          label="Description"
          type="textarea"
          register={register("description", {
            required: "Description is required",
          })}
          errors={errors.description}
          placeholder="Enter internship description"
        />

        {/* Dynamic Skills Required */}
        <DynamicFieldList
          label="Skills Required"
          fields={fieldsSkillsRequired}
          register={register}
          remove={removeSkillsRequired}
          append={appendSkillsRequired}
          fieldName="skillsRequired"
          placeholder="Enter a skill"
          errors={errors.skillsRequired}
        />

        {/* Dynamic Responsibilities */}
        <DynamicFieldList
          label="Responsibilities"
          fields={fieldsResponsibilities}
          register={register}
          remove={removeResponsibility}
          append={appendResponsibility}
          fieldName="responsibilities"
          placeholder="Enter a responsibility"
          errors={errors.responsibilities}
        />

        {/* Dynamic Qualifications */}
        <DynamicFieldList
          label="Qualifications"
          fields={fieldsQualifications}
          register={register}
          remove={removeQualification}
          append={appendQualification}
          fieldName="qualifications"
          placeholder="Enter a qualification"
          errors={errors.qualifications}
        />

        {/* Contact Information */}
        <FormInput
          label="Contact Email"
          register={register("contact.email", {
            required: "Email is required",
          })}
          errors={errors.contact?.email}
          placeholder="Enter contact email"
        />
        <FormInput
          label="Contact Facebook"
          register={register("contact.facebook")}
          placeholder="Enter Facebook link"
        />
        <FormInput
          label="Contact Website"
          register={register("contact.website")}
          placeholder="Enter website link"
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 font-bold text-white px-5 py-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable FormInput component
const FormInput = ({ label, type = "text", register, errors, placeholder }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2">
    <label className="font-bold w-48 text-xl">{label}:</label>
    {type === "textarea" ? (
      <textarea
        className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36 text-lg"
        {...register}
        placeholder={placeholder}
      />
    ) : (
      <input
        className="input input-bordered w-full bg-white border-black rounded-none"
        type={type}
        {...register}
        placeholder={placeholder}
      />
    )}
    {errors && <span className="text-red-500">{errors.message}</span>}
  </div>
);

// Reusable DynamicFieldList component
const DynamicFieldList = ({
  label,
  fields,
  register,
  remove,
  append,
  fieldName,
  placeholder,
  errors,
}) => (
  <div className="border border-gray-300 p-3">
    <label className="font-bold w-48 text-xl">{label}</label>
    {fields.map((item, index) => (
      <div key={item.id} className="flex flex-col md:flex-row mb-1">
        <input
          className="input input-bordered w-full bg-white border-black rounded-none"
          {...register(`${fieldName}.${index}`)}
          defaultValue={item}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
          onClick={() => remove(index)}
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-5"
      onClick={() => append("")}
    >
      Add {label}
    </button>
    {errors && errors[fieldName] && (
      <span className="text-red-500">{errors[fieldName].message}</span>
    )}
  </div>
);

// Add prop types validation
FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
};

// Add prop types validation
DynamicFieldList.propTypes = {
  label: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  append: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  errors: PropTypes.object,
};

export default ModalEditInternship;

// Define prop types for the component
ModalEditInternship.propTypes = {
  InternshipData: PropTypes.shape({
    _id: PropTypes.string,
    companyName: PropTypes.string,
    companyLogo: PropTypes.string,
    postedBy: PropTypes.string,
    position: PropTypes.string,
    duration: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    stipend: PropTypes.string,
    skillsRequired: PropTypes.arrayOf(PropTypes.string),
    applicationDeadline: PropTypes.string,
    responsibilities: PropTypes.arrayOf(PropTypes.string),
    qualifications: PropTypes.arrayOf(PropTypes.string),
    contact: PropTypes.shape({
      email: PropTypes.string,
      facebook: PropTypes.string,
      website: PropTypes.string,
    }),
  }),
};

// PropTypes validation
ModalEditInternship.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
