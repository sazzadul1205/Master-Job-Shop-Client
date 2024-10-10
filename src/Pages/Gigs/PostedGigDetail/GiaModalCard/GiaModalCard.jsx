import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const GiaModalCard = ({ gigDetails, id, refetch }) => {
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
    const bidData = {
      biderName: data.biderName,
      biderEmail: user?.email || "", // Ensure it handles null values
      biderImage: data.biderImage,
      bidderID: data.bidderID,
      AboutBider: data.AboutMe,
      appliedDate: formattedDateTime,
      resumeLink: data.resumeLink,
    };

    const applyToGigLogData = {
      email: user?.email || "",
      name: data.biderName,
      clientName: gigDetails.clientName,
      gigType: gigDetails.gigType,
      gigId: gigDetails._id,
      appliedDate: formattedDateTime,
    };

    try {
      const response = await axiosPublic.post(
        `/Posted-Gig/${id}/apply`,
        bidData
      );

      const logResponse = await axiosPublic.post(
        `/Apply-To-Gig-Log`,
        applyToGigLogData
      );

      if (response.status === 200 && logResponse.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Your application and log have been submitted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Close the modal
        document.getElementById("Apply_for_Gig").close();

        // Reset the form after submission
        refetch();
        reset();
        // window.location.reload();
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
      <h3 className="font-bold text-xl text-center">Bid for the</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Bidder Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Bidder Name
          </label>
          <input
            id="name"
            type="text"
            {...register("biderName", {
              required: "Bidder Name is required",
            })}
            className="w-full p-2 border border-gray-300 rounded bg-white"
          />
          {errors.biderName && (
            <p className="text-red-500">{errors.biderName.message}</p>
          )}
        </div>

        {/* Bidder Image */}
        <div>
          <label htmlFor="biderImage" className="block text-sm font-bold mb-2">
            Bidder Image URL
          </label>
          <input
            id="biderImage"
            type="url"
            {...register("biderImage")}
            className="w-full p-2 border border-gray-300 rounded bg-white"
          />
        </div>

        {/* Bidder ID */}
        <div>
          <label htmlFor="bidderID" className="block text-sm font-bold mb-2">
            Bidder ID
          </label>
          <input
            id="bidderID"
            type="text"
            {...register("bidderID", { required: "Bidder ID is required" })}
            className="w-full p-2 border border-gray-300 rounded bg-white"
          />
          {errors.bidderID && (
            <p className="text-red-500">{errors.bidderID.message}</p>
          )}
        </div>

        {/* About Bidder */}
        <div>
          <label htmlFor="AboutMe" className="block text-sm font-bold mb-2">
            About Me
          </label>
          <textarea
            id="AboutMe"
            {...register("AboutMe", {
              required: "Please tell us about yourself",
            })}
            className="w-full p-2 border border-gray-300 rounded bg-white"
          />
          {errors.AboutMe && (
            <p className="text-red-500">{errors.AboutMe.message}</p>
          )}
        </div>

        {/* Resume Link URL */}
        <div>
          <label htmlFor="resumeLink" className="block text-sm font-bold mb-2">
            Resume Link URL
          </label>
          <input
            id="resumeLink"
            type="url"
            {...register("resumeLink", {
              required: "Resume Link is required",
              pattern: {
                value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                message: "Please provide a valid URL",
              },
            })}
            className="w-full p-2 border bg-white"
          />
          {errors.resumeLink && (
            <p className="text-red-500">{errors.resumeLink.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="modal-action justify-between mt-10">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 px-5 py-3 text-white font-bold rounded"
          >
            Submit Application
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 px-5 py-3 text-black font-bold rounded"
            onClick={() => document.getElementById("Apply_for_Gig").close()}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

// Define prop types for the component
GiaModalCard.propTypes = {
  gigDetails: PropTypes.shape({
    clientName: PropTypes.string.isRequired,
    gigType: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default GiaModalCard;
