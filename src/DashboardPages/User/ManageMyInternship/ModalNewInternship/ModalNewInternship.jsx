import { ImCross } from "react-icons/im";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalNewInternship = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

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

  useEffect(() => {
    if (fieldsSkillsRequired.length === 0) {
      appendSkillsRequired(""); // Ensure at least one empty skill field exists
    }
    if (fieldsResponsibilities.length === 0) {
      appendResponsibility(""); // Ensure at least one empty responsibility field exists
    }
    if (fieldsQualifications.length === 0) {
      appendQualification(""); // Ensure at least one empty qualification field exists
    }
  }, [
    fieldsSkillsRequired,
    appendSkillsRequired,
    fieldsResponsibilities,
    appendResponsibility,
    fieldsQualifications,
    appendQualification,
  ]);

  // Submit function to handle form data
  const onSubmit = async (data) => {
    try {
      const internshipData = {
        ...data,
        postedBy: user.email, // Assign the current user's email
        applicants: [],
      };

      // Post the formatted data to the Internship API endpoint
      const response = await axiosPublic.post("/Internship", internshipData);

      if (response.data.insertedId) {
        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Internship has been created successfully!",
          icon: "success",
          button: "OK",
        });
      }

      // Close modal and reset form
      document.getElementById("Create_New_Internship").close();
      refetch();
      reset();
    } catch (error) {
      console.error("Error creating internship:", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to create the internship. Please try again.",
        icon: "error",
        button: "OK",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white">
        <p className="text-xl">Create New Internship</p>
        <button
          onClick={() =>
            document.getElementById("Create_New_Internship").close()
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
  <div className="flex items-center gap-2">
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

// Add prop types validation
FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
};
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
  <div className="space-y-2">
    <label className="font-bold w-48 text-xl">{label}:</label>
    {fields.map((item, index) => (
      <div key={item.id} className="flex mb-1">
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
    {errors && <span className="text-red-500">{errors.message}</span>}
  </div>
);

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

export default ModalNewInternship;

// PropTypes validation
ModalNewInternship.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
