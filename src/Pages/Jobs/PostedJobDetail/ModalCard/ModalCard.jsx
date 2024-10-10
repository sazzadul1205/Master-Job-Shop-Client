import { useContext } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const ModalCard = ({ id, refetch, jobDetails }) => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
    const applicantData = {
      name: data.name,
      email: user.email, // Assuming user email is from the AuthContext
      appliedDate: formattedDateTime,
      AboutMe: data.AboutMe,
      image: data.image,
      resumeLink: data.resumeLink,
    };

    const applyToJobLogData = {
      companyName: jobDetails.companyName,
      email: user.email,
      name: data.name,
      jobName: jobDetails.jobTitle,
      jobType: jobDetails.jobType,
      jobId: jobDetails._id,
      appliedDate: formattedDateTime,
    };

    try {
      // Post the application
      const applyResponse = await axiosPublic.post(
        `/Posted-Job/${id}/apply`,
        applicantData
      );

      // Post the log of the application
      const logResponse = await axiosPublic.post(
        `/Apply-To-Job-Log`,
        applyToJobLogData
      );

      if (applyResponse.status === 200 && logResponse.status === 200) {
        // Show success Swal alert
        Swal.fire({
          title: "Success!",
          text: "Your application and log have been submitted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Close the modal
        document.getElementById("Apply_To_Job").close();

        // Reset the form after submission
        refetch();
        reset();
        window.location.reload();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      console.error("Error submitting application or log:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit the application or log. Please try again later.",
        icon: "error",
        button: "OK",
      });
    }
  };

  return (
    <div className="modal-box bg-white text-black border-2 border-red-500">
      <h3 className="font-bold text-xl text-center">Apply for the Job</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold mb-2">Name</label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border bg-white"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* About Me */}
        <div>
          <label className="block text-sm font-bold mb-2">About Me</label>
          <textarea
            id="AboutMe"
            {...register("AboutMe", {
              required: "Please tell us about yourself",
            })}
            className="w-full h-36 p-2 border bg-white"
          />
          {errors.AboutMe && (
            <p className="text-red-500">{errors.AboutMe.message}</p>
          )}
        </div>

        {/* Profile Image URL */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Profile Image URL
          </label>
          <input
            id="image"
            type="url"
            {...register("image")}
            className="w-full p-2 border bg-white"
          />
        </div>

        {/* resumeLink URL */}
        <div>
          <label className="block text-sm font-bold mb-2">resumeLink URL</label>
          <input
            id="resumeLink"
            type="url"
            {...register("resumeLink")}
            className="w-full p-2 border bg-white"
          />
        </div>

        {/* Buttons */}
        <div className="modal-action justify-between mt-10">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 px-5 py-3 text-white font-bold"
          >
            Submit Application
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-400 px-5 py-3 text-white font-bold"
            onClick={() => document.getElementById("Apply_To_Job").close()}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

// Define PropTypes for the component
ModalCard.propTypes = {
  id: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  jobDetails: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ModalCard;
