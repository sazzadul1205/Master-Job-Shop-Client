import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const PostedGigDetail = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate for back navigation
  const [hasApplied, setHasApplied] = useState(false); // To track if user has applied
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetching Gig detail by ID
  const {
    data: gigDetails,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["PostedGigsDetailsData", id],
    queryFn: () => axiosPublic.get(`/Posted-Gig/${id}`).then((res) => res.data), // Fetch job by ID
  });

  // Function to check if the user has already applied
  const checkIfApplied = async () => {
    if (user) {
      try {
        const response = await axiosPublic.get(`/Posted-Gig/${id}`);
        const { peopleBided } = response.data;

        // Check if the user's email is in the peopleBided array
        const hasApplied = peopleBided.some(
          (applicant) => applicant.biderEmail === user.email
        );
        setHasApplied(hasApplied);
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    }
  };

  // Use effect to fetch job data and check application status when the component loads
  useEffect(() => {
    if (user) {
      checkIfApplied(); // Check application status when the user is available
    }
  }, [id, user]);

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
      biderEmail: user.email, // Assuming user email is from the AuthContext
      biderImage: data.biderImage,
      bidderID: data.bidderID,
      AboutBider: data.AboutMe,
      appliedDate: formattedDateTime,
      resumeLink: data.resumeLink,
    };

    try {
      const response = await axiosPublic.post(
        `/Posted-Gig/${id}/apply`,
        bidData
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
        document.getElementById("Apply_for_Gig").close();
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

  // Render Gig details
  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto text-black pt-24">
        {/* Back button with navigation */}
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          <FaArrowLeft className="mr-5" />
          Back
        </button>

        {/* Content */}
        <div className="py-5">
          {/* Top Content */}
          <div className=" w-1/2">
            <p className="font-bold text-3xl py-2">{gigDetails.gigTitle}</p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Client Name:</span>
              {gigDetails.clientName}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Gig Type:</span>
              {gigDetails.gigType}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Location:</span>
              {gigDetails.location}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Payment Rate:</span>
              {gigDetails.paymentRate}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Duration:</span>
              {gigDetails.duration}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Responsibilities:</h4>
            <p>{gigDetails.responsibilities}</p>
          </div>

          {/* Required Skills  */}
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Required Skills :</h4>
            <p>{gigDetails.requiredSkills}</p>
          </div>

          {/* Working Hours  */}
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Working Hours :</h4>
            <p>{gigDetails.workingHours}</p>
          </div>

          {/* Project Expectations */}
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Project Expectations :</h4>
            <p>{gigDetails.projectExpectations}</p>
          </div>

          {/* Communication */}
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Communication :</h4>
            <p>{gigDetails.Communication}</p>
          </div>

          {/* Additional Benefits */}
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Additional Benefits :</h4>
            <p>{gigDetails.additionalBenefits}</p>
          </div>

          {/* Bottom Part */}
          <div className="flex justify-between items-center mt-5">
            <p>
              <span className="font-bold">Posted:</span>
              {new Date(gigDetails.postedDate).toLocaleDateString()}
            </p>
            <div>
              <h4 className="font-semibold mb-2">Company Rating:</h4>
              <Rating
                initialRating={parseFloat(gigDetails.rating)}
                emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                readonly
              />
            </div>
          </div>
        </div>

        {/* List of Applicants */}
        <div className="overflow-x-auto py-5">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold my-4">Applicants</p>
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
                  className="bg-green-500 hover:bg-green-400 px-10 py-3 text-white font-bold"
                  onClick={() =>
                    document.getElementById("Apply_for_Gig").showModal()
                  }
                >
                  Apply
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
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">bidderID</th>
                <th className="border px-4 py-2">About Me</th>
              </tr>
            </thead>
            <tbody>
              {gigDetails.peopleBided && gigDetails.peopleBided.length > 0 ? (
                gigDetails.peopleBided.map((applicant, index) => (
                  <tr key={index} className="border-t">
                    <td className="border px-4 py-2">
                      {applicant.biderImage ? (
                        <img
                          src={applicant.biderImage}
                          alt={applicant.biderName}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">{applicant.biderName}</td>
                    <td className="border px-4 py-2">{applicant.biderEmail}</td>
                    <td className="border px-4 py-2">{applicant.bidderID}</td>
                    <td className="border px-4 py-2">{applicant.AboutBider}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-red-500 font-bold py-4"
                  >
                    No applicants yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for applying */}
        <dialog id="Apply_for_Gig" className="modal">
          <div className="modal-box bg-white text-black border-2 border-red-500">
            <h3 className="font-bold text-xl text-center">Apply for the Job</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Bidder Name */}
              <div>
                <label className="block text-sm font-bold mb-2">
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
                <label className="block text-sm font-bold mb-2">
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
                <label className="block text-sm font-bold mb-2">
                  Bidder ID
                </label>
                <input
                  id="bidderID"
                  type="text"
                  {...register("bidderID", {
                    required: "Bidder ID is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded bg-white"
                />
                {errors.bidderID && (
                  <p className="text-red-500">{errors.bidderID.message}</p>
                )}
              </div>

              {/* About Bidder */}
              <div>
                <label className="block text-sm font-bold mb-2">About Me</label>
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

              {/* resumeLink URL */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  resumeLink URL
                </label>
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
                  className="bg-green-500 hover:bg-green-400 px-5 py-3 text-white font-bold rounded"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 px-5 py-3 text-black font-bold rounded"
                  onClick={() =>
                    document.getElementById("Apply_for_Gig").close()
                  }
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default PostedGigDetail;
