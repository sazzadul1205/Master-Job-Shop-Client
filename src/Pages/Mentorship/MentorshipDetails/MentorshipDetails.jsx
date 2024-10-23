import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import AddApplicant from "./AddApplicant/AddApplicant";
import AddReviews from "./AddReviews/AddReviews";
import BackButton from "../../Shared/BackButton/BackButton";
import { Helmet } from "react-helmet";

const MentorshipDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [hasApplied, setHasApplied] = useState(false); // To track if user has applied
  const [hasReview, setHasReview] = useState(false); // To track if user has applied
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewsToShow, setReviewsToShow] = useState(3); // Default to 3 reviews for desktop
  const reviewsPerPage = 3;

  useEffect(() => {
    const updateReviewsToShow = () => {
      if (window.innerWidth < 640) {
        setReviewsToShow(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setReviewsToShow(2); // Tablet
      } else {
        setReviewsToShow(3); // Desktop
      }
    };

    updateReviewsToShow(); // Set initial value based on current window size
    window.addEventListener("resize", updateReviewsToShow); // Add resize listener

    return () => {
      window.removeEventListener("resize", updateReviewsToShow); // Cleanup on unmount
    };
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Master Job Shop || Mentorship Details  </title>
      </Helmet>
      <div className="max-w-[1200px] mx-auto text-black pt-24 pb-5">
        {/* Back button with navigation */}
        <BackButton></BackButton>

        <div className="px-5 py-5">
          {/* Top */}
          <div className="flex flex-col-reverse md:flex-row justify-between gap-5">
            {/* Content */}
            <div>
              {/* Name */}
              <p className="font-bold text-2xl">{Mentorship.mentorName}</p>

              {/* Expertise */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28  mr-5">Expertise:</span>
                <span className="ml-5">{Mentorship.expertise}</span>
              </p>

              {/* Duration */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28  mr-5">Duration:</span>
                <span className="ml-5">{Mentorship.duration}</span>
              </p>

              {/* price */}
              <p className="text-lg flex flex-col md:flex-row py-2 leading-5">
                <span className="font-bold w-28  mr-5">Price:</span>
                <span className="ml-5">{Mentorship.price}</span>
              </p>

              {/* contactEmail */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28  mr-5">ContactEmail:</span>
                <span className="ml-5">{Mentorship.contactEmail}</span>
              </p>
            </div>
            {/* Mentor Image */}
            <div>
              {Mentorship.mentorImage && (
                <img
                  src={Mentorship.mentorImage}
                  alt={`${Mentorship.mentorName} Image`}
                  className="w-60 h-60 object-cover mb-4"
                />
              )}
            </div>
          </div>

          {/* Bio */}
          <p className="text-lg flex flex-col md:flex-row py-2 leading-5">
            <span className="font-bold pr-3">Bio:</span>
            <span className="ml-5">{Mentorship.mentorBio}</span>
          </p>

          {/* Description */}
          <p className="text-lg flex flex-col md:flex-row py-2 leading-5">
            <span className="font-bold mr-5">Description:</span>
            <span className="ml-5 overflow-hidden break-words">{Mentorship.description}</span>
          </p>

          {/* sessionFormat */}
          <p className="text-lg flex flex-col md:flex-row py-2 leading-5">
            <span className="font-bold pr-3">Session Format:</span>
            <span className="ml-5">{Mentorship.sessionFormat}</span>
          </p>

          {/* People Applied */}
          <div className="text-xl flex flex-col md:flex-row bg-sky-100 py-3 px-5 justify-between items-center mt-5">
            <p>People Applied: {Mentorship?.applicant?.length || 0}</p>{" "}
            {/* Displaying the total count */}
            <div>
              {user ? (
                hasApplied ? (
                  // If the user has already applied, show the "Already Applied" button
                  <button
                    className="bg-gray-500 w-40 py-2 text-white font-bold"
                    disabled
                  >
                    Already Applied
                  </button>
                ) : (
                  // If the user is logged in and hasn't applied, show the "Apply" button
                  <button
                    className="bg-green-500 hover:bg-green-600 text-lg w-40 py-2 font-semibold text-white"
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
                  <button className="bg-blue-500 hover:bg-blue-400 w-40 py-2 text-white font-bold">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="py-5">
            {/* Top */}
            <div className="text-xl flex flex-col md:flex-row py-3 px-5 justify-between items-center mt-5">
              <p className="text-xl font-bold py-2">
                Reviews: {Mentorship?.reviews?.length || 0}
              </p>
              {user ? (
                hasReview ? (
                  <button
                    className="bg-gray-500 px-10 py-3 text-white font-bold"
                    disabled
                  >
                    Already Applied
                  </button>
                ) : (
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
                  .slice(currentReviewIndex, currentReviewIndex + reviewsToShow)
                  .map((review, index) => (
                    <div
                      key={index}
                      className="card bg-gradient-to-br bg-sky-300 to-sky-50 lg:w-96 shadow-lg hover:shadow-2xl mb-4"
                    >
                      <div className="card-body">
                        <h2 className="card-title">{review.reviewerName}</h2>
                        <div className="flex flex-col md:flex-row gap-3">
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
                  currentReviewIndex + reviewsToShow >=
                  Mentorship.reviews.length
                }
                className={`p-2 ${
                  currentReviewIndex + reviewsToShow >=
                  Mentorship.reviews.length
                    ? "opacity-50"
                    : "hover:bg-gray-300"
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add Applicant */}
      <dialog id="Add_applicant" className="modal">
        <AddApplicant
          refetch={refetch}
          id={id}
          Mentorship={Mentorship}
        ></AddApplicant>
      </dialog>

      {/* Modal for Add Reviews */}
      <dialog id="Add_Reviews" className="modal">
        <AddReviews
          refetch={refetch}
          id={id}
          Mentorship={Mentorship}
        ></AddReviews>
      </dialog>
    </div>
  );
};

export default MentorshipDetails;
