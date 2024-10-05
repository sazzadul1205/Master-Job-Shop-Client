import { useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Shared/Loader/Loader";
import Rating from "react-rating";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { useForm } from "react-hook-form";

const PostedGigDetail = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate for back navigation
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission for applicants
  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  // Fetching Gig detail by ID
  const {
    data: gigDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["PostedGigsDetailsData", id],
    queryFn: () => axiosPublic.get(`/Posted-Gig/${id}`).then((res) => res.data), // Fetch job by ID
  });

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
            <button
              className="bg-green-500 hover:bg-green-400 px-10 py-3 text-white font-bold"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Apply
            </button>
          </div>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Applied Date</th>
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
                    <td className="border px-4 py-2">{applicant.biderID}</td>
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
        <dialog id="my_modal_1" className="modal">
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

              {/* Bidder ID */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Bidder ID
                </label>
                <input
                  id="biderID"
                  type="text"
                  {...register("biderID", {
                    required: "Bidder ID is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded bg-white"
                />
                {errors.biderID && (
                  <p className="text-red-500">{errors.biderID.message}</p>
                )}
              </div>

              {/* Bidder Email */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Bidder Email
                </label>
                <input
                  id="biderEmail"
                  type="email"
                  {...register("biderEmail", {
                    required: "Bidder Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full p-2 border border-gray-300 rounded bg-white"
                />
                {errors.biderEmail && (
                  <p className="text-red-500">{errors.biderEmail.message}</p>
                )}
              </div>

              {/* About Bidder */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  About Bidder
                </label>
                <textarea
                  id="AboutBider"
                  {...register("AboutBider", {
                    required: "Please tell us about yourself",
                  })}
                  className="w-full p-2 border border-gray-300 rounded bg-white"
                />
                {errors.AboutBider && (
                  <p className="text-red-500">{errors.AboutBider.message}</p>
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
                  onClick={() => document.getElementById("my_modal_1").close()}
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
