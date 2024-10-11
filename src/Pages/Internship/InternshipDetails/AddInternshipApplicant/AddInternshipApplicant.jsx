import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";

const AddInternshipApplicant = ({ refetch, Internship, id }) => {
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

  // Handle form submission for applicants
  const onSubmit = async (data) => {
    // Format the applicant data
    const applicantData = {
      applicantName: data.applicantName,
      applicantEmail: user.email,
      applicantImage: data.applicantImage,
      aboutApplicant: data.aboutApplicant,
      portfolioLink: data.portfolioLink,
      resumeLink: data.resumeLink,
      appliedDate: formattedDateTime,
    };

    const applyToJobLogData = {
      companyName: Internship.companyName,
      email: user.email,
      name: data.applicantName,
      duration: Internship.duration,
      position: Internship.position,
      InternshipId: Internship._id,
      appliedDate: formattedDateTime,
    };

    try {
      const response = await axiosPublic.post(
        `/Internship/${id}/apply`,
        applicantData
      );

      // Post the log of the application
      const logResponse = await axiosPublic.post(
        `/Apply-To-Internship-Log`,
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
        document.getElementById("Add_Application").close();
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
      <h3 className="font-bold text-xl text-center">Add Reviews</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Applicant Name */}
        <div>
          <label className="block text-sm font-bold mb-2">Applicant Name</label>
          <input
            id="applicantName"
            type="text"
            {...register("applicantName", {
              required: "applicantName is required",
            })}
            className="w-full p-2 border border-gray-400 bg-white"
            placeholder="Enter Applicant Name"
          />
          {errors.applicantName && (
            <p className="text-red-600">{errors.applicantName.message}</p>
          )}
        </div>

        {/* applicant Image */}
        <div>
          <label className="block text-sm font-bold mb-2">
            applicant Image URL
          </label>
          <input
            id="applicantImage"
            type="url"
            {...register("applicantImage", {
              required: "applicant Image URL is required",
            })}
            className="w-full p-2 border border-gray-400 bg-white"
            placeholder="Enter applicant Image URL"
          />
          {errors.applicantImage && (
            <p className="text-red-600">{errors.applicantImage.message}</p>
          )}
        </div>

        {/* About Applicant */}
        <div>
          <label className="block text-sm font-bold mb-2">
            About Applicant
          </label>
          <textarea
            id="aboutApplicant"
            {...register("aboutApplicant", {
              required: "About Applicant is required",
            })}
            className="w-full p-2 border h-36 border-gray-400 bg-white"
            placeholder="Enter About Applicant"
          />
          {errors.aboutApplicant && (
            <p className="text-red-600">{errors.aboutApplicant.message}</p>
          )}
        </div>

        {/* Portfolio Link */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Portfolio Link URL
          </label>
          <input
            id="portfolioLink"
            type="url"
            {...register("portfolioLink", {
              required: "Portfolio Link URL is required",
            })}
            className="w-full p-2 border border-gray-400 bg-white"
            placeholder="Enter Portfolio Link URL"
          />
          {errors.portfolioLink && (
            <p className="text-red-600">{errors.portfolioLink.message}</p>
          )}
        </div>

        {/* Resume Link */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Resume Link URL
          </label>
          <input
            id="resumeLink"
            type="url"
            {...register("resumeLink", {
              required: "Resume Link URL is required",
            })}
            className="w-full p-2 border border-gray-400 bg-white"
            placeholder="Enter Resume Link URL"
          />
          {errors.resumeLink && (
            <p className="text-red-600">{errors.resumeLink.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="modal-action">
          <button
            type="button"
            onClick={() => document.getElementById("Add_Application").close()}
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

export default AddInternshipApplicant;
