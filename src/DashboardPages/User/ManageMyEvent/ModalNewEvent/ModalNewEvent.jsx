import { useContext, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import Swal from "sweetalert2"; // Import SweetAlert2
import PropTypes from "prop-types";

const ModalNewEvent = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

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
    fields: fieldsRequiredResources,
    append: appendRequiredResources,
    remove: removeRequiredResources,
  } = useFieldArray({
    control,
    name: "requiredResources",
  });

  useEffect(() => {
    if (fieldsRequiredResources.length === 0) {
      appendRequiredResources(""); // Automatically add an empty field if none exist
    }
  }, [fieldsRequiredResources, appendRequiredResources]);

  // On Submit
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
      // Send data to the server
      const response = await axiosPublic.post(
        "/Upcoming-Events",
        formattedData
      );
      if (response.status === 200) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Event Created!",
          text: "Your event has been successfully created.",
        });
        // Optionally, close the modal or reset the form here
        document.getElementById("Create_New_Event").close();
        reset();
        refetch();
      }
    } catch (error) {
      console.error("Error creating event:", error);
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an issue creating your event. Please try again.",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white ">
        <p className="text-xl">Create New Event</p>
        <button
          onClick={() => document.getElementById("Create_New_Event").close()}
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        {/* Event Title */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Event Title:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("eventTitle", {
              required: "Event Title name is required",
            })}
            placeholder="Enter Event Title"
          />
          {errors.eventTitle && (
            <span className="text-red-500">{errors.eventTitle.message}</span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Date:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="date"
            {...register("date", {
              required: "Date name is required",
            })}
            placeholder="Enter Date"
          />
          {errors.date && (
            <span className="text-red-500">{errors.date.message}</span>
          )}
        </div>

        {/* Time */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Time:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("time", {
              required: "Time name is required",
            })}
            placeholder="Enter Time"
          />
          {errors.time && (
            <span className="text-red-500">{errors.time.message}</span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Location:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("location", {
              required: "Location name is required",
            })}
            placeholder="Enter Location"
          />
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex gap-2">
          <label className="font-bold w-48 text-xl">Description:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36  text-lg"
            {...register("description", { required: true })}
            placeholder="Enter Description"
          />
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Organizer:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("organizer", {
              required: "Organizer name is required",
            })}
            placeholder="Enter Organizer"
          />
          {errors.organizer && (
            <span className="text-red-500">{errors.organizer.message}</span>
          )}
        </div>

        {/* Participation Criteria */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-lg">
            Participation Criteria:
          </label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("participationCriteria", {
              required: "Participation Criteria name is required",
            })}
            placeholder="Enter Participation Criteria"
          />
          {errors.participationCriteria && (
            <span className="text-red-500">
              {errors.participationCriteria.message}
            </span>
          )}
        </div>

        {/* RequiredResources */}
        <div className="space-y-2 border border-gray-300 p-2">
          <label className="font-bold w-48 text-xl">Required Resources:</label>
          {fieldsRequiredResources.map((item, index) => (
            <div key={item.id} className="flex mb-1">
              <input
                className="input input-bordered w-full bg-white border-black rounded-none"
                {...register(`requiredResources.${index}`)}
                defaultValue={item}
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
            onClick={() => appendRequiredResources("")}
          >
            Add Service
          </button>
        </div>

        {/* Registration Link */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Registration Link:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="url"
            {...register("registrationLink", {
              required: "Registration Link name is required",
            })}
            placeholder="Enter Registration Link"
          />
          {errors.registrationLink && (
            <span className="text-red-500">
              {errors.registrationLink.message}
            </span>
          )}
        </div>

        {/* Contact Email */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Contact Email:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="email"
            {...register("contactEmail", {
              required: "Contact Email name is required",
            })}
            placeholder="Enter Contact Email"
          />
          {errors.contactEmail && (
            <span className="text-red-500">{errors.contactEmail.message}</span>
          )}
        </div>

        {/* Participation Fee */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Participation Fee:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("participationFee", {
              required: "Participation Fee is required",
            })}
            placeholder="Enter Participation Fee"
          />
          {errors.participationFee && (
            <span className="text-red-500">
              {errors.participationFee.message}
            </span>
          )}
        </div>

        {/* Participation Limit */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Participation Limit:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="number"
            {...register("participationLimit", {
              required: "Participation Limit is required",
            })}
            placeholder="Enter Participation Limit"
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
            className="bg-green-500 hover:bg-green-600 font-bold text-white px-5 py-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalNewEvent;

// PropTypes validation
ModalNewEvent.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
