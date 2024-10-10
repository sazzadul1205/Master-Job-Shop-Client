import { useContext } from "react";
import { AuthContext } from "../../../../Provider/AuthProvider";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import PropTypes from "prop-types"; // Import PropTypes

const UpcomingEventsCard = ({ refetch, id, UpcomingEvents }) => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission for applicants
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const onSubmit = async (data) => {
    // Format the applicant data
    const applicantData = {
      applicantName: data.applicantName,
      applicantEmail: user.email,
      applicantImage: data.applicantImage,
      applicantDate: formattedDateTime,
      applicantDescription: data.applicantDescription,
      applicantState: "Pending", // Default state
    };

    const applyToUpcomingEventsLogData = {
      eventTitle: UpcomingEvents.eventTitle,
      email: user.email,
      name: data.applicantName,
      organizer: UpcomingEvents.organizer,
      UpcomingEventsId: UpcomingEvents._id,
      appliedDate: formattedDateTime,
    };

    reset();
    console.log(applicantData);
    console.log(applyToUpcomingEventsLogData);

    try {
      const response = await axiosPublic.post(
        `/Upcoming-Events/${id}/apply`,
        applicantData
      );

      // Post the log of the application
      const logResponse = await axiosPublic.post(
        `/Apply-To-Upcoming-Event-Log`,
        applyToUpcomingEventsLogData
      );

      if (response.status === 200 && logResponse.status === 200) {
        // Show success Swal alert
        Swal.fire({
          title: "Success!",
          text: "Your application has been submitted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Close the modal
        document.getElementById("Apply_To_Event").close();
        refetch();

        // Reset the form after submission
        reset();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit the application. Please try again later.",
        icon: "error",
        button: "OK",
      });
    }
  };

  return (
    <div className="modal-box bg-white text-black border-2 border-red-500">
      <h3 className="font-bold text-xl text-center">Apply for Fair</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Applicant Name */}
        <div>
          <label className="block text-sm font-bold mb-2">Applicant Name</label>
          <input
            id="applicantName"
            type="text"
            {...register("applicantName", {
              required: "Applicant Name is required",
            })}
            className="w-full p-2 border border-gray-300 rounded bg-white"
          />
          {errors.applicantName && (
            <p className="text-red-500">{errors.applicantName.message}</p>
          )}
        </div>

        {/* Applicant Image */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Applicant Image URL
          </label>
          <input
            id="applicantImage"
            type="url"
            {...register("applicantImage")}
            className="w-full p-2 border border-gray-300 rounded bg-white"
          />
        </div>

        {/* Applicant Description */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Applicant Description
          </label>
          <textarea
            id="applicantDescription"
            {...register("applicantDescription", {
              required: "Please tell us about yourself",
            })}
            className="w-full p-2 h-32 border border-gray-300 rounded bg-white"
          />
          {errors.applicantDescription && (
            <p className="text-red-500">
              {errors.applicantDescription.message}
            </p>
          )}
        </div>

        {/* Button */}
        <div className="modal-action">
          <button
            type="button"
            onClick={() => document.getElementById("Apply_To_Event").close()}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 font-semibold text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 px-5 py-3 font-semibold text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes validation
UpcomingEventsCard.propTypes = {
  refetch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  UpcomingEvents: PropTypes.shape({
    eventTitle: PropTypes.string.isRequired,
    organizer: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default UpcomingEventsCard;
