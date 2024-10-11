import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import Rating from "react-rating";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const AddReviews = ({ refetch, id, Mentorship }) => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [ratingValue, setRatingValue] = useState(0);

  const {
    register: registerReview,
    handleSubmit: handleReviewSubmit,
    reset: resetReview,
    formState: { errors: reviewErrors },
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

  // Handle form submission for reviews
  const onSubmitReview = async (data) => {
    const reviewData = {
      reviewerName: user.displayName,
      reviewerEmail: user.email,
      reviewerImage: user.photoURL,
      reviewText: data.reviewText,
      rating: ratingValue,
      appliedDate: formattedDateTime,
    };
    const ReviewLogData = {
      mentorName: Mentorship.mentorName,
      email: user.email,
      name: user.displayName,
      expertise: Mentorship.expertise,
      reviewText: data.reviewText,
      jobId: Mentorship._id,
      appliedDate: formattedDateTime,
    };

    console.log(reviewData);
    console.log(ReviewLogData);

    try {
      const applyResponse = await axiosPublic.post(
        `/Mentorship/${id}/applyReview`,
        reviewData
      );

      // Post the log of the application
      const logResponse = await axiosPublic.post(
        `/Apply-To-Job-Log`,
        ReviewLogData
      );

      if (applyResponse.status === 200 && logResponse.status === 200) {
        // Show success Swal alert
        Swal.fire({
          title: "Success!",
          text: "Your review has been submitted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Close the modal
        document.getElementById("Add_Reviews").close();
        refetch();
        window.location.reload();
        // Reset the form after submission
        resetReview();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit the review. Please try again later.",
        icon: "error",
        button: "OK",
      });
    }
  };

  return (
    <div className="modal-box bg-white text-black border-2 border-red-500">
      <h3 className="font-bold text-xl text-center">Add Reviews</h3>
      <form onSubmit={handleReviewSubmit(onSubmitReview)} className="space-y-4">
        {/* Review Text */}
        <div>
          <label className="block text-sm font-bold mb-2">Review Text</label>
          <textarea
            id="reviewText"
            {...registerReview("reviewText", {
              required: "Review Text is required",
            })}
            className="w-full p-2 h-44 border border-gray-400 bg-white"
            placeholder="Enter Review Text"
          />
          {reviewErrors.reviewText && (
            <p className="text-red-600">{reviewErrors.reviewText.message}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-bold mb-2">Rating</label>
          <Rating
            emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
            fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
            onChange={(value) => setRatingValue(value)} // Update state on change
          />
        </div>

        {/* Submit Button */}
        <div className="modal-action">
          <button
            type="button"
            onClick={() => document.getElementById("Add_Reviews").close()}
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

// Define prop types for validation
AddReviews.propTypes = {
  refetch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  Mentorship: PropTypes.shape({
    mentorName: PropTypes.string.isRequired,
    expertise: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddReviews;
