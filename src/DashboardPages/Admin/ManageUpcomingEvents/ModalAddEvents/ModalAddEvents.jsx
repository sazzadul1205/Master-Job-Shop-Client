import { useForm, useFieldArray } from "react-hook-form";
import { ImCross } from "react-icons/im";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalAddEvents = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const {
    fields: resourceFields,
    append: addResource,
    remove: removeResource,
  } = useFieldArray({
    control,
    name: "requiredResources",
  });

  const onSubmit = async (data) => {
    const formattedData = {
      eventTitle: data.eventTitle,
      date: data.date,
      time: data.time,
      location: data.location,
      description: data.description,
      organizer: data.organizer,
      participationCriteria: data.participationCriteria,
      postedBy: user.email,
      requiredResources: data.requiredResources,
      registrationLink: data.registrationLink,
      contactEmail: data.contactEmail,
      participationFee: data.participationFee,
      participationLimit: data.participationLimit,
      ParticipantApplications: [],
    };

    try {
      const response = await axiosPublic.post(
        "/Upcoming-Events",
        formattedData
      );

      // Success alert
      Swal.fire({
        icon: "success",
        title: "Event Added",
        text: "The event has been added successfully!",
      });

      document.getElementById("Create_New_Events").close();
      refetch();
      reset();
      console.log(response);
    } catch (error) {
      console.error("Error adding event:", error);

      // Error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add the event. Please try again later.",
      });
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
    <div className="mb-3">
      <label className="font-bold ">{label}</label>
      {fields.map((item, index) => (
        <div key={item.id} className="flex space-x-2 mt-1">
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
        className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-2"
        onClick={() => addFn("")}
      >
        Add {label.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <div className="modal-box bg-white max-w-[800px] p-0">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p>Add New Event</p>
        <button
          onClick={() => document.getElementById("Create_New_Events").close()}
        >
          <ImCross className="hover:text-black font-bold" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5">
        {/* Event Title */}
        <div className="mb-4">
          <label className="block text-black font-bold">Event Title:</label>
          <input
            type="text"
            {...register("eventTitle", { required: "Event Title is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.eventTitle ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.eventTitle && (
            <span className="text-red-500">{errors.eventTitle.message}</span>
          )}
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-black font-bold">Date:</label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date && (
            <span className="text-red-500">{errors.date.message}</span>
          )}
        </div>

        {/* Time */}
        <div className="mb-4">
          <label className="block text-black font-bold">Time:</label>
          <input
            type="text"
            {...register("time", { required: "Time is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.time ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.time && (
            <span className="text-red-500">{errors.time.message}</span>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-black font-bold">Location:</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.location ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-black font-bold">Description:</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>

        {/* Organizer */}
        <div className="mb-4">
          <label className="block text-black font-bold">Organizer:</label>
          <input
            type="text"
            {...register("organizer", { required: "Organizer is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.organizer ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.organizer && (
            <span className="text-red-500">{errors.organizer.message}</span>
          )}
        </div>

        {/* Participation Criteria */}
        <div className="mb-4">
          <label className="block text-black font-bold">
            Participation Criteria:
          </label>
          <input
            type="text"
            {...register("participationCriteria", {
              required: "Participation Criteria is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.participationCriteria
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.participationCriteria && (
            <span className="text-red-500">
              {errors.participationCriteria.message}
            </span>
          )}
        </div>

        {/* Required Resources */}
        {renderFieldArray(
          resourceFields,
          register,
          removeResource,
          addResource,
          "Required Resources",
          "requiredResources"
        )}

        {/* Registration Link */}
        <div className="mb-4">
          <label className="block text-black font-bold">
            Registration Link:
          </label>
          <input
            type="text"
            {...register("registrationLink", {
              required: "Registration Link is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.registrationLink ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.registrationLink && (
            <span className="text-red-500">
              {errors.registrationLink.message}
            </span>
          )}
        </div>

        {/* Contact Email */}
        <div className="mb-4">
          <label className="block text-black font-bold">Contact Email:</label>
          <input
            type="email"
            {...register("contactEmail", {
              required: "Contact Email is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.contactEmail ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contactEmail && (
            <span className="text-red-500">{errors.contactEmail.message}</span>
          )}
        </div>

        {/* Participation Fee */}
        <div className="mb-4">
          <label className="block text-black font-bold">
            Participation Fee:
          </label>
          <input
            type="text"
            {...register("participationFee", {
              required: "Participation Fee is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.participationFee ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.participationFee && (
            <span className="text-red-500">
              {errors.participationFee.message}
            </span>
          )}
        </div>

        {/* Participation Limit */}
        <div className="mb-4">
          <label className="block text-black font-bold">
            Participation Limit:
          </label>
          <input
            type="number"
            {...register("participationLimit", {
              required: "Participation Limit is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.participationLimit ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.participationLimit && (
            <span className="text-red-500">
              {errors.participationLimit.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
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

export default ModalAddEvents;

// PropTypes validation
ModalAddEvents.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
