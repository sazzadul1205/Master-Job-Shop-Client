import { useContext, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import Swal from "sweetalert2";
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
    defaultValues: { requiredResources: [""] },
  });

  const {
    fields: resources,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "requiredResources",
  });

  useEffect(() => {
    if (resources.length === 0) append("");
  }, [resources, append]);

  const formattedDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
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
      postedDate: formattedDate,
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
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Event Created!",
          text: "Your event has been successfully created.",
        });
        document.getElementById("Create_New_Event").close();
        reset();
        refetch();
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an issue creating your event. Please try again.",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white">
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
        {renderField("Event Title", "eventTitle", "text", register, errors)}
        {renderField("Date", "date", "date", register, errors)}
        {renderField("Time", "time", "text", register, errors)}
        {renderField("Location", "location", "text", register, errors)}
        {renderTextArea("Description", "description", register, errors)}
        {renderField("Organizer", "organizer", "text", register, errors)}
        {renderField(
          "Participation Criteria",
          "participationCriteria",
          "text",
          register,
          errors
        )}
        {renderFieldArray(
          resources,
          register,
          remove,
          append,
          "Required Resources",
          "requiredResources"
        )}
        {renderField(
          "Registration Link",
          "registrationLink",
          "url",
          register,
          errors
        )}
        {renderField(
          "Contact Email",
          "contactEmail",
          "email",
          register,
          errors
        )}
        {renderField(
          "Participation Fee",
          "participationFee",
          "text",
          register,
          errors
        )}
        {renderField(
          "Participation Limit",
          "participationLimit",
          "number",
          register,
          errors
        )}
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

const renderField = (label, name, type, register, errors) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2">
    <label className="font-bold w-48 text-xl">{label}:</label>
    <input
      className="input input-bordered w-full bg-white border-black rounded-none"
      type={type}
      {...register(name, { required: `${label} is required` })}
      placeholder={`Enter ${label}`}
    />
    {errors[name] && (
      <span className="text-red-500">{errors[name].message}</span>
    )}
  </div>
);

const renderTextArea = (label, name, register, errors) => (
  <div className="flex flex-col md:flex-row  gap-2">
    <label className="font-bold w-48 text-xl">{label}:</label>
    <textarea
      className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36 text-lg"
      {...register(name, { required: true })}
      placeholder={`Enter ${label}`}
    />
    {errors[name] && (
      <span className="text-red-500">{errors[name].message}</span>
    )}
  </div>
);

const renderFieldArray = (fields, registerFn, removeFn, addFn, label, name) => (
  <div className="border border-gray-300 p-3">
    <label className="font-bold w-48 text-xl">{label}</label>
    {fields.map((item, index) => (
      <div key={item.id} className="flex flex-col md:flex-row mb-1">
        <input
          className="input input-bordered w-full bg-white border-black rounded-none"
          {...registerFn(`${name}.${index}`)}
          defaultValue={item}
          placeholder={`Enter ${label}`}
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
    <button
      type="button"
      className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-full md:w-52 mt-5"
      onClick={() => addFn("")}
    >
      Add {label}
    </button>
  </div>
);

ModalNewEvent.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ModalNewEvent;
