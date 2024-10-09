import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Provider/AuthProvider";
import Swal from "sweetalert2";

const MentorshipDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [hasApplied, setHasApplied] = useState(false); // To track if user has applied
  const [hasReview, setHasReview] = useState(false); // To track if user has applied
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const reviewsPerPage = 3;
  const {
    register: registerApplicant,
    handleSubmit: handleApplicantSubmit,
    reset: resetApplicant,
    formState: { errors: applicantErrors },
  } = useForm();
  const {
    register: registerReview,
    handleSubmit: handleReviewSubmit,
    reset: resetReview,
    formState: { errors: reviewErrors },
  } = useForm();

  // Fetching Mentorship details by ID
  const {
    data: Mentorship,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MentorshipDetailsData", id],
    queryFn: () => axiosPublic.get(`/Mentorship/${id}`).then((res) => res.data),
  });

  // Function to check if the user has already applied
  const checkIfApplied = async () => {
    if (user) {
      try {
        const response = await axiosPublic.get(`/Mentorship/${id}`);
        const { applicant } = response.data;

        // Check if the user's email is in the applicant array
        const hasApplied = applicant.some(
          (applicant) => applicant.applicantEmail === user.email
        );
        setHasApplied(hasApplied);
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    }
  };
  
  // Function to check if the user has already Review
  const checkIfReview = async () => {
    if (user) {
      try {
        const response = await axiosPublic.get(`/Mentorship/${id}`);
        const { reviews } = response.data;

        // Check if the user's email is in the reviews array
        const hasApplied = reviews.some(
          (reviews) => reviews.reviewerEmail === user.email
        );
        setHasReview(hasApplied);
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    }
  };

  // Use effect to fetch job data and check application status when the component loads
  useEffect(() => {
    if (user) {
      checkIfApplied(); // Check application status when the user is available
      checkIfReview();
    }
  }, [id, user]);

  // Handle form submission for applicants
  const onSubmitApplicant = async (data) => {
    const applicantData = {
      applicantName: data.applicantName,
      applicantEmail: user.email,
      applicantImage: data.applicantImage,
      applicantDetails: data.applicantDetails,
    };


    try {
      const response = await axiosPublic.post(
        `/Mentorship/${id}/applyApplicant`,
        applicantData
      );

      if (response.status === 200) {
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

  // Handle form submission for reviews
  const onSubmitReview = async (data) => {
    const reviewData = {
      reviewerName: user.displayName,
      reviewerEmail: user.email,
      reviewerImage: user.photoURL,
      reviewText: data.reviewText,
      rating: ratingValue,
    };

    resetReview();
    try {
      const response = await axiosPublic.post(
        `/Mentorship/${id}/applyReview`,
        reviewData
      );

      if (response.status === 200) {
        // Show success Swal alert
        Swal.fire({
          title: "Success!",
          text: "Your application has been submitted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Close the modal
        document.getElementById("Add_Reviews").close();
        refetch();

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
      console.error("Error submitting application:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit the application. Please try again later.",
        icon: "error",
        button: "OK",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong:{" "}
          {error.response?.data?.message || "Please reload the page."}
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // State for reviews carousel

  // Handling next and previous review navigation
  const nextReviews = () => {
    if (currentReviewIndex < Mentorship.reviews.length - reviewsPerPage) {
      setCurrentReviewIndex(currentReviewIndex + reviewsPerPage);
    }
  };

  const prevReviews = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - reviewsPerPage);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto text-black pt-24 pb-5">
        {/* Back button with navigation */}
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          <FaArrowLeft className="mr-5" />
          Back
        </button>

        <div className="py-1">
          {/* Content */}
          <div className="flex justify-between">
            <div className="py-2">
              {/* Mentor Name */}
              <p className="font-bold text-3xl">{Mentorship.mentorName}</p>

              {/* Expertise */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold mr-5">Expertise:</span>
                {Mentorship.expertise}
              </p>

              {/* Duration */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold mr-5">Duration:</span>
                {Mentorship.duration}
              </p>

              {/* Contact Email */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold mr-5">Contact Email:</span>
                {Mentorship.contactEmail}
              </p>

              {/* Price */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold pr-3">Price:</span>
                {Mentorship.price}
              </p>

              {/* Session Format */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold pr-3">Session Format:</span>
                {Mentorship.sessionFormat}
              </p>
            </div>

            {/* Mentor Image */}
            {Mentorship.mentorImage && (
              <img
                src={Mentorship.mentorImage}
                alt={`${Mentorship.mentorName} Image`}
                className="w-60 h-60 object-cover mb-4"
              />
            )}
          </div>

          {/* Bio */}
          <p className="text-lg py-2 leading-5">
            <span className="font-bold pr-5 text-xl">Bio:</span>
            {Mentorship.mentorBio}
          </p>

          {/* Description */}
          <p className="text-lg">
            <span className="font-bold pr-5 text-xl">Description:</span>
            {Mentorship.description}
          </p>

          {/* Reviews Section */}
          <div className="py-5">
            {/* Top */}
            <div className="flex justify-between items-center py-5">
              <p className="text-xl font-bold py-2">Reviews:</p>
              {user ? (
                hasReview ? (
                  // If the user has already applied, show the "Already Applied" button
                  <button
                    className="bg-gray-500 px-10 py-3 text-white font-bold"
                    disabled
                  >
                    Already Applied
                  </button>
                ) : (
                  // If the user is logged in and hasn't applied, show the "Apply" button
                  <button
                    className="bg-green-500 hover:bg-green-600 px-10 py-2 text-white font-semibold"
                    onClick={() =>
                      document.getElementById("Add_Reviews").showModal()
                    }
                  >
                    Make Review
                  </button>
                )
              ) : (
                // If the user is not logged in, show the "Login" button
                <Link to={"/Login"}>
                  <button className="bg-blue-500 hover:bg-blue-400 px-10 py-3 text-white font-bold">
                    Login
                  </button>
                </Link>
              )}
            </div>
            {/* Bottom */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevReviews}
                disabled={currentReviewIndex === 0}
                className={`p-2 ${
                  currentReviewIndex === 0 ? "opacity-50" : "hover:bg-gray-300"
                }`}
              >
                <FaArrowLeft />
              </button>

              <div className="flex gap-4">
                {Mentorship.reviews
                  .slice(
                    currentReviewIndex,
                    currentReviewIndex + reviewsPerPage
                  )
                  .map((review, index) => (
                    <div
                      key={index}
                      className="card bg-gradient-to-br bg-sky-300 to-sky-50 w-96 shadow-lg hover:shadow-2xl mb-4"
                    >
                      <div className="card-body">
                        <h2 className="card-title">{review.reviewerName}</h2>
                        <div className="flex gap-5">
                          <div className="avatar">
                            <div className="w-12 rounded-full">
                              <img
                                src={review.reviewerImage}
                                alt={review.reviewerName}
                              />
                            </div>
                          </div>
                          <p className="leading-6">{review.reviewText}</p>
                        </div>
                        <div className="flex justify-end pt-5">
                          <p className="text-lg font-bold">Rating:</p>
                          <Rating
                            initialRating={review.rating}
                            emptySymbol={
                              <FaStar className="text-gray-400 text-2xl" />
                            }
                            fullSymbol={
                              <FaStar className="text-yellow-500 text-2xl" />
                            }
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                onClick={nextReviews}
                disabled={
                  currentReviewIndex + reviewsPerPage >=
                  Mentorship.reviews.length
                }
                className={`p-2 ${
                  currentReviewIndex + reviewsPerPage >=
                  Mentorship.reviews.length
                    ? "opacity-50"
                    : "hover:bg-gray-300"
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* Language & Rating */}
          <div className="flex justify-between items-center">
            {/* Languages */}
            <p className="text-lg py-2 leading-5">
              <span className="font-bold pr-3">Languages:</span>
              <ul className="list-disc list-inside p-1">
                {Mentorship.languages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </p>

            <div>
              <h4 className="font-semibold mb-2">Company Rating:</h4>
              <Rating
                initialRating={Mentorship.rating}
                emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                readonly
              />
            </div>
          </div>

          {/* Applications */}
          <div className="overflow-x-auto mt-6">
            <div className="flex justify-between items-center py-5">
              <p className="text-xl font-bold py-2">
                Participant Applications:
              </p>
              {user ? (
                hasApplied ? (
                  // If the user has already applied, show the "Already Applied" button
                  <button
                    className="bg-gray-500 px-10 py-3 text-white font-bold"
                    disabled
                  >
                    Already Applied
                  </button>
                ) : (
                  // If the user is logged in and hasn't applied, show the "Apply" button
                  <button
                    className="bg-green-500 hover:bg-green-600 text-lg px-8 py-1 font-semibold text-white"
                    onClick={() =>
                      document.getElementById("Add_applicant").showModal()
                    }
                  >
                    Apply{" "}
                  </button>
                )
              ) : (
                // If the user is not logged in, show the "Login" button
                <Link to={"/Login"}>
                  <button className="bg-blue-500 hover:bg-blue-400 px-10 py-3 text-white font-bold">
                    Login
                  </button>
                </Link>
              )}
            </div>
            <table className="table">
              <thead>
                <tr className="bg-gray-500 text-white">
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {Mentorship.applicant.map((application, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={application.applicantImage}
                        alt={application.applicantName}
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                    <td>{application.applicantName}</td>
                    <td>{application.applicantEmail}</td>
                    <td>{application.applicantDetails}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add Applicant */}
      <dialog id="Add_applicant" className="modal">
        <div className="modal-box bg-white text-black border-2 border-red-500">
          <h3 className="font-bold text-xl text-center">Apply for Course</h3>
          <form
            onSubmit={handleApplicantSubmit(onSubmitApplicant)}
            className="space-y-4"
          >
            {/* Applicant Name */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Name
              </label>
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

            {/* Applicant Details */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Details
              </label>
              <textarea
                id="applicantDetails"
                {...registerApplicant("applicantDetails", {
                  required: "Applicant Details is required",
                })}
                className="w-full p-2 h-32 border border-gray-400 bg-white"
                placeholder="Enter Applicant Details"
              />
              {applicantErrors.applicantDetails && (
                <p className="text-red-600">
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
      </dialog>

      {/* Modal for Add Reviews */}
      <dialog id="Add_Reviews" className="modal">
        <div className="modal-box bg-white text-black border-2 border-red-500">
          <h3 className="font-bold text-xl text-center">Add Reviews</h3>
          <form
            onSubmit={handleReviewSubmit(onSubmitReview)}
            className="space-y-4"
          >
            {/* Review Text */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Review Text
              </label>
              <textarea
                id="reviewText"
                {...registerReview("reviewText", {
                  required: "Review Text is required",
                })}
                className="w-full p-2 h-44 border border-gray-400 bg-white"
                placeholder="Enter Review Text"
              />
              {reviewErrors.reviewText && (
                <p className="text-red-600">
                  {reviewErrors.reviewText.message}
                </p>
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
      </dialog>
    </div>
  );
};

export default MentorshipDetails;
