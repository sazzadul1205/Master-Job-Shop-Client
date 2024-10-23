/* eslint-disable react/prop-types */
import { ImCross } from "react-icons/im";
import { AuthContext } from "../../../../Provider/AuthProvider";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useContext, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ModalNewMentorship = ({ refetch }) => {
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

  useEffect(() => {
    if (fieldsLanguages.length === 0) {
      appendLanguages(""); // Ensure at least one empty language field exists
    }
  }, [fieldsLanguages, appendLanguages]);

  const onSubmit = async (data) => {
    try {
      // Format the data to match your backend structure
      const formattedData = {
        mentorName: data.mentorName, // Corrected from courseTitle to mentorName
        mentorImage: data.mentorImage,
        expertise: data.expertise,
        duration: data.duration,
        description: data.description,
        mentorBio: data.mentorBio,
        contactEmail: data.contactEmail,
        postedBy: user.email,
        rating: 0,
        reviews: [],
        applicant: [],
        price: data.price,
        languages: data.languages, // Filter out empty languages
        sessionFormat: data.sessionFormat,
      };

      // Post the formatted data to the Mentorship API endpoint
      const response = await axiosPublic.post("/mentorship", formattedData);

      if (response.data.insertedId) {
        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Mentorship has been created successfully!",
          icon: "success",
          button: "OK",
        });
      }
      document.getElementById("Create_New_Mentorship").close();
      refetch();
      reset();
    } catch (error) {
      console.error("Error creating mentorship:", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to create the mentorship. Please try again.",
        icon: "error",
        button: "OK",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white">
        <p className="text-xl">Create New Mentorship</p>
        <button
          onClick={() =>
            document.getElementById("Create_New_Mentorship").close()
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


export default ModalNewMentorship;

