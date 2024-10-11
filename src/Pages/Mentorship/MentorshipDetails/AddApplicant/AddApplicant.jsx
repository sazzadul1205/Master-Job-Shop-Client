import PropTypes from "prop-types";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import { useForm } from "react-hook-form";

const AddApplicant = ({ refetch, id, Mentorship }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const {
    register: registerApplicant,
    handleSubmit: handleApplicantSubmit,
    reset: resetApplicant,
    formState: { errors: applicantErrors },
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

  // Handle form submission for applicants
  const onSubmitApplicant = async (data) => {
    const applicantData = {
      applicantName: data.applicantName,
      applicantEmail: user.email,
      appliedDate: formattedDateTime,
      applicantImage: data.applicantImage,
      applicantDetails: data.applicantDetails,
      resumeLink: data.resumeLink,
    };

    const applyToJobLogData = {
      mentorName: Mentorship.mentorName,
      email: user.email,
      name: data.applicantName,
      expertise: Mentorship.expertise,
      duration: Mentorship.duration,
      jobId: Mentorship._id,
      appliedDate: formattedDateTime,
    };

    try {
      const response = await axiosPublic.post(
        `/Mentorship/${id}/applyApplicant`,
        applicantData
      );

      // Post the log of the application
      const logResponse = await axiosPublic.post(
        `/Apply-To-Mentorship-Log`,
        applyToJobLogData
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
        document.getElementById("Add_applicant").close();
        refetch();
        window.location.reload();
        // Reset the form after submission
        resetApplicant();
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
      <h3 className="font-bold text-xl text-center">Apply for Course</h3>
      <form
        onSubmit={handleApplicantSubmit(onSubmitApplicant)}
        className="space-y-4"
      >
        {/* Applicant Name */}
        <div>
          <label className="block text-sm font-bold mb-2">Applicant Name</label>
          <input
            id="applicantName"
            type="text"
            {...registerApplicant("applicantName", {
              required: "applicantName is required",
            })}
            className="w-full p-2 border border-gray-400 bg-white"
            placeholder="Enter Applicant Name"
          />
          {applicantErrors.applicantName && (
            <p className="text-red-600">
              {applicantErrors.applicantName.message}
            </p>
          )}
        </div>

        {/* Applicant Image */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Applicant Image URL
          </label>
          <input
            id="applicantImage"
            type="text"
            {...registerApplicant("applicantImage", {
              required: "Applicant Image URL is required",
            })}
            className="w-full p-2 border border-gray-400 bg-white"
            placeholder="Enter applicant image URL"
          />
          {applicantErrors.applicantImage && (
            <p className="text-red-600">
              {applicantErrors.applicantImage.message}
            </p>
          )}
        </div>

        {/* resumeLink URL */}
        <div>
          <label className="block text-sm font-bold mb-2">resumeLink URL</label>
          <input
            id="resumeLink"
            type="url"
            {...registerApplicant("resumeLink")}
            className="w-full p-2 border bg-white"
          />
        </div>

        {/* Applicant Details */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Applicant Details
          </label>
          <textarea
            id="applicantDetails"
            {...registerApplicant("applicantDetails", {
              required: "Please tell us about yourself",
            })}
            className="w-full h-36 p-2 border bg-white"
          />
          {applicantErrors.applicantDetails && (
            <p className="text-red-500">
              {applicantErrors.applicantDetails.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="modal-action">
          <button
            type="button"
            onClick={() => document.getElementById("Add_applicant").close()}
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

// Add prop types validation
AddApplicant.propTypes = {
  refetch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  Mentorship: PropTypes.shape({
    mentorName: PropTypes.string.isRequired,
    expertise: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddApplicant;
