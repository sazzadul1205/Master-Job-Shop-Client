import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2"; // Import Swal for alerts

const ModalEditMentorship = ({ MentorshipData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      languages: [""],
    },
  });

  // Field arrays setup for languages
  const {
    fields: fieldsLanguages,
    append: appendLanguages,
    remove: removeLanguages,
  } = useFieldArray({
    control,
    name: "languages",
  });

  // Populate form with fetched mentorship data
  useEffect(() => {
    if (MentorshipData) {
      reset({
        mentorName: MentorshipData?.mentorName,
        mentorImage: MentorshipData?.mentorImage,
        expertise: MentorshipData?.expertise,
        duration: MentorshipData?.duration,
        description: MentorshipData?.description,
        mentorBio: MentorshipData?.mentorBio,
        contactEmail: MentorshipData?.contactEmail,
        price: MentorshipData?.price,
        sessionFormat: MentorshipData?.sessionFormat,
        languages: MentorshipData?.languages || [], // Populate languages
      });
    }
  }, [MentorshipData, reset]);

  const onSubmit = async (data) => {
    try {
      // Make the PUT request to update the mentorship by ID
      await axiosPublic.put(`/Mentorship/${MentorshipData._id}`, data);

      // Show a success alert
      Swal.fire({
        title: "Success!",
        text: "Mentorship updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      document.getElementById("Edit_Mentorship_Modal").close();
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
            document.getElementById("Edit_Mentorship_Modal").close()
          }
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        {/* Mentor Name */}
        <FormInput
          label="Mentor Name"
          register={register("mentorName", {
            required: "Mentor Name is required",
          })}
          errors={errors.mentorName}
          placeholder="Enter Mentor Name"
        />

        {/* Mentor Image */}
        <FormInput
          label="Mentor Image URL"
          register={register("mentorImage", {
            required: "Mentor Image URL is required",
          })}
          errors={errors.mentorImage}
          placeholder="Enter Image URL"
        />

        {/* Expertise */}
        <FormInput
          label="Expertise"
          register={register("expertise", {
            required: "Expertise is required",
          })}
          errors={errors.expertise}
          placeholder="Enter Expertise"
        />

        {/* Duration */}
        <FormInput
          label="Duration"
          register={register("duration", { required: "Duration is required" })}
          errors={errors.duration}
          placeholder="Enter Duration (e.g., 6 weeks)"
        />

        {/* Description */}
        <FormInput
          label="Description"
          type="textarea"
          register={register("description", {
            required: "Description is required",
          })}
          errors={errors.description}
          placeholder="Enter Description"
        />

        {/* Mentor Bio */}
        <FormInput
          label="Mentor Bio"
          type="textarea"
          register={register("mentorBio", {
            required: "Mentor Bio is required",
          })}
          errors={errors.mentorBio}
          placeholder="Enter Mentor Bio"
        />

        {/* Contact Email */}
        <FormInput
          label="Contact Email"
          register={register("contactEmail", {
            required: "Contact Email is required",
          })}
          errors={errors.contactEmail}
          placeholder="Enter Contact Email"
        />

        {/* Price */}
        <FormInput
          label="Price"
          register={register("price", { required: "Price is required" })}
          errors={errors.price}
          placeholder="Enter Price (e.g., $500)"
        />

        {/* Languages */}
        <DynamicFieldList
          label="Languages"
          fields={fieldsLanguages}
          register={register}
          remove={removeLanguages}
          append={appendLanguages}
          fieldName="languages"
          placeholder="Enter Language"
          errors={errors}
        />

        {/* Session Format */}
        <FormInput
          label="Session Format"
          register={register("sessionFormat", {
            required: "Session Format is required",
          })}
          errors={errors.sessionFormat}
          placeholder="Enter Session Format (e.g., Online)"
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
const FormInput = ({
  label,
  type = "text",
  register,
  errors,
  placeholder,
  defaultValue,
}) => (
  <div className="flex items-center gap-2">
    <label className="font-bold w-48 text-xl">{label}:</label>
    {type === "textarea" ? (
      <textarea
        className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36 text-lg"
        {...register}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    ) : (
      <input
        className="input input-bordered w-full bg-white border-black rounded-none"
        type={type}
        {...register}
        placeholder={placeholder}
        defaultValue={defaultValue}
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
          {...register(`${fieldName}.${index}`, {
            required: "Language is required",
          })}
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
    {errors && errors.languages && (
      <span className="text-red-500">{errors.languages.message}</span>
    )}
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

export default ModalEditMentorship;

// PropTypes definition
ModalEditMentorship.propTypes = {
  MentorshipData: PropTypes.shape({
    _id: PropTypes.string,
    mentorName: PropTypes.string,
    mentorImage: PropTypes.string,
    expertise: PropTypes.string,
    duration: PropTypes.string,
    description: PropTypes.string,
    mentorBio: PropTypes.string,
    contactEmail: PropTypes.string,
    price: PropTypes.number,
    sessionFormat: PropTypes.string, // Add this line for sessionFormat
    languages: PropTypes.arrayOf(PropTypes.string), // Define as array of strings
  }),
};

// PropTypes validation
ModalEditMentorship.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
