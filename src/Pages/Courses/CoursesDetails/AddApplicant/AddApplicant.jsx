import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import PropTypes from "prop-types";

const AddApplicant = ({ id, refetch, course }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
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

  // Handle form submission for applicants
  const onSubmit = async (data) => {
    // Format the applicant data
    const applicantData = {
      applicantName: data.applicantName,
      applicantEmail: user.email,
      applicantImage: data.applicantImage,
      applicantDescription: data.applicantDescription,
      registrationDate: formattedDateTime, // registrationDate in yyyy-mm-dd format
      batch: data.batch,
    };

    const applyToJobLogData = {
      CourseName: course.courseTitle,
      email: user.email,
      name: data.applicantName,
      instructor: course.instructor,
      level: course.level,
      jobId: course._id,
      appliedDate: formattedDateTime,
    };

    try {
      const response = await axiosPublic.post(
        `/Courses/${id}/apply`,
        applicantData
      );

      // Post the log of the application
      const logResponse = await axiosPublic.post(
        `/Apply-To-Job-Log`,
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
        document.getElementById("my_modal_1").close();
        refetch();
        window.location.reload();
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
      <h3 className="font-bold text-xl text-center">Apply for Course</h3>
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
            className="w-full p-2 border border-gray-400 bg-white"
            placeholder="Enter applicant name"
          />
          {errors.applicantName && (
            <p className="text-red-600">{errors.applicantName.message}</p>
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
            {...register("applicantImage", {
              required: "Applicant Image URL is required",
            })}
            className="w-full p-2 border border-gray-400 bg-white"
            placeholder="Enter applicant image URL"
          />
          {errors.applicantImage && (
            <p className="text-red-600">{errors.applicantImage.message}</p>
          )}
        </div>

        {/* Applicant Description */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Applicant Description
          </label>
          <textarea
            id="applicantDescription"
            {...register("applicantDescription", {
              required: "Applicant Description is required",
            })}
            className="w-full p-2 h-32 border border-gray-400 bg-white"
            placeholder="Enter applicant description"
          />
          {errors.applicantDescription && (
            <p className="text-red-600">
              {errors.applicantDescription.message}
            </p>
          )}
        </div>

        {/* Batch */}
        <div>
          <label className="label">Batch</label>
          <select
            className="select select-bordered w-full bg-white border border-gray-400"
            {...register("batch", { required: true })}
          >
            <option disabled value="">
              Select a batch
            </option>
            {course.batches.map((batch, index) => (
              <option key={index} value={batch.batchName}>
                {batch.batchName}
              </option>
            ))}
          </select>
          {errors.batch && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Submit Button */}
        <div className="modal-action">
          <button
            type="button"
            onClick={() => document.getElementById("my_modal_1").close()}
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

// Define the prop types
AddApplicant.propTypes = {
  id: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  course: PropTypes.shape({
    courseTitle: PropTypes.string.isRequired,
    instructor: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    batches: PropTypes.arrayOf(
      PropTypes.shape({
        batchName: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default AddApplicant;
