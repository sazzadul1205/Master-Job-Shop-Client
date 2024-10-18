import PropTypes from "prop-types"; // Import PropTypes
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2"; // Import SweetAlert2

const ModalEditEvent = ({ EventData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      requiredResources: [""],
    },
  });

  const {
    fields: requiredResourcesFields,
    append: appendRequiredResources,
    remove: removeRequiredResources,
  } = useFieldArray({
    control,
    name: "requiredResources",
  });

  useEffect(() => {
    if (EventData) {
      reset({
        eventTitle: EventData.eventTitle || "",
        date: EventData.date || "",
        time: EventData.time || "",
        location: EventData.location || "",
        description: EventData.description || "",
        organizer: EventData.organizer || "",
        participationCriteria: EventData.participationCriteria || "",
        requiredResources: EventData.requiredResources || [""],
        registrationLink: EventData.registrationLink || "",
        contactEmail: EventData.contactEmail || "",
        participationFee: EventData.participationFee || "",
        participationLimit: EventData.participationLimit || "",
      });
    }
  }, [EventData, reset]);

  // On Submit
  const onSubmit = async (data) => {
    try {
      // Update your event using axios
      await axiosPublic.put(`/Upcoming-Events/${EventData._id}`, data); // Adjust URL as necessary

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "Event updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Optionally close the modal after submission
      document.getElementById("Edit_Event_Modal").close();
      refetch();
    } catch (error) {
      console.error("Error submitting the event:", error);
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the event.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      {/* Top section */}
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white ">
        <p className="text-xl">Edit My Company Profile</p>
        <button
          onClick={() => document.getElementById("Edit_Event_Modal").close()}
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        {/* Event Title */}
        <InputField
          label="Event Title:"
          type="text"
          placeholder="Enter Event Title"
          register={register("eventTitle", {
            required: "Event Title name is required",
          })}
          error={errors.eventTitle}
        />

        {/* Date */}
        <InputField
          label="Date:"
          type="date"
          placeholder="Enter Date"
          register={register("date", { required: "Date is required" })}
          error={errors.date}
        />

        {/* Time */}
        <InputField
          label="Time:"
          type="text"
          placeholder="Enter Time"
          register={register("time", { required: "Time is required" })}
          error={errors.time}
        />

        {/* Location */}
        <InputField
          label="Location:"
          type="text"
          placeholder="Enter Location"
          register={register("location", { required: "Location is required" })}
          error={errors.location}
        />

        {/* Description */}
        <TextAreaField
          label="Description:"
          register={register("description", { required: true })}
          placeholder="Enter Description"
        />

        {/* Organizer */}
        <InputField
          label="Organizer:"
          type="text"
          placeholder="Enter Organizer"
          register={register("organizer", {
            required: "Organizer name is required",
          })}
          error={errors.organizer}
        />

        {/* Participation Criteria */}
        <InputField
          label="Participation Criteria:"
          type="text"
          placeholder="Enter Participation Criteria"
          register={register("participationCriteria", {
            required: "Participation Criteria is required",
          })}
          error={errors.participationCriteria}
        />

        {/* Required Resources */}
        <div className="space-y-2 border border-gray-300 p-2">
          <label className="font-bold text-xl">Required Resources:</label>
          {requiredResourcesFields.map((item, index) => (
            <div key={item.id} className="flex mb-1">
              <input
                className="input input-bordered w-full bg-white border-black rounded-none"
                {...register(`requiredResources.${index}`)}
                defaultValue={item.value} // Set the initial value from existing data
                placeholder="Enter service"
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
                onClick={() => removeRequiredResources(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-5"
            onClick={() => appendRequiredResources({ value: "" })} // Ensure new items have a default value
          >
            Add Service
          </button>
        </div>

        {/* Registration Link */}
        <InputField
          label="Registration Link:"
          type="url"
          placeholder="Enter Registration Link"
          register={register("registrationLink", {
            required: "Registration Link is required",
          })}
          error={errors.registrationLink}
        />

        {/* Contact Email */}
        <InputField
          label="Contact Email:"
          type="email"
          placeholder="Enter Contact Email"
          register={register("contactEmail", {
            required: "Contact Email is required",
          })}
          error={errors.contactEmail}
        />

        {/* Participation Fee */}
        <InputField
          label="Participation Fee:"
          type="text"
          placeholder="Enter Participation Fee"
          register={register("participationFee", {
            required: "Participation Fee is required",
          })}
          error={errors.participationFee}
        />

        {/* Participation Limit */}
        <InputField
          label="Participation Limit:"
          type="number"
          placeholder="Enter Participation Limit"
          register={register("participationLimit", {
            required: "Participation Limit is required",
          })}
          error={errors.participationLimit}
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

// Helper Component for Input Fields
const InputField = ({ label, type, placeholder, register, error }) => (
  <div className="flex items-center gap-2">
    <label className="font-bold w-48 text-xl">{label}</label>
    <input
      className="input input-bordered w-full bg-white border-black rounded-none"
      type={type}
      {...register}
      placeholder={placeholder}
    />
    {error && <span className="text-red-500">{error.message}</span>}
  </div>
);

// Helper Component for TextArea
const TextAreaField = ({ label, register, placeholder }) => (
  <div className="flex gap-2">
    <label className="font-bold w-48 text-xl">{label}</label>
    <textarea
      className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36 text-lg"
      {...register}
      placeholder={placeholder}
    />
  </div>
);

// Define prop types for InputField
InputField.propTypes = {
  label: PropTypes.string.isRequired, // Assuming label is required
  type: PropTypes.string.isRequired, // Assuming type is required
  placeholder: PropTypes.string, // Placeholder can be optional
  register: PropTypes.object.isRequired, // register should be an object
  error: PropTypes.object, // Error can be an object or undefined
};

// Define prop types for TextAreaField
TextAreaField.propTypes = {
  label: PropTypes.string.isRequired, // Assuming label is required
  register: PropTypes.object.isRequired, // register should be an object
  placeholder: PropTypes.string, // Placeholder can be optional
};

// Define prop types for the component
ModalEditEvent.propTypes = {
  EventData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    eventTitle: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    organizer: PropTypes.string,
    participationCriteria: PropTypes.string,
    requiredResources: PropTypes.arrayOf(PropTypes.string),
    registrationLink: PropTypes.string,
    contactEmail: PropTypes.string,
    participationFee: PropTypes.string,
    participationLimit: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ModalEditEvent;
