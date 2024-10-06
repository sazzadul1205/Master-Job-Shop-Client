import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";

const UpcomingEventsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission for applicants
  const onSubmit = async (data) => {
    // Format the applicant data
    const applicantData = {
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      applicantDescription: data.applicantDescription,
      applicantState: "Pending", // Default state
      applicantAnonymity: data.applicantAnonymity || "Public", // Get selected anonymity or default to Public
    };

    reset();
    console.log(applicantData);
  };

  // Fetching event details by ID
  const {
    data: UpcomingEvents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["UpcomingEventsDetailsData", id],
    queryFn: () =>
      axiosPublic.get(`/Upcoming-Events/${id}`).then((res) => res.data),
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

        {/* Event Details */}
        <div className="py-5">
          <h2 className="text-3xl font-bold text-black">
            {UpcomingEvents.eventTitle}
          </h2>
          <p className="mt-2 text-xl">
            <strong>Date:</strong> {UpcomingEvents.date}
          </p>
          <p className="mt-2 text-xl">
            <strong>Time:</strong> {UpcomingEvents.time}
          </p>
          <p className="mt-2 text-xl">
            <strong>Location:</strong> {UpcomingEvents.location}
          </p>
          <p className="mt-2 text-xl">
            <strong>Description:</strong> {UpcomingEvents.description}
          </p>
          <p className="mt-2 text-xl">
            <strong>Organizer:</strong> {UpcomingEvents.organizer}
          </p>
          <p className="mt-2 text-xl">
            <strong>Participation Criteria:</strong>{" "}
            {UpcomingEvents.participationCriteria}
          </p>
          <p className="mt-2 text-xl">
            <strong>Required Resources:</strong>{" "}
            {UpcomingEvents.requiredResources.join(", ")}
          </p>
          <p className="mt-2 text-xl">
            <strong>Contact Email:</strong> {UpcomingEvents.contactEmail}
          </p>
          <p className="mt-2 text-xl">
            <strong>Participation Fee:</strong>{" "}
            {UpcomingEvents.participationFee}
          </p>
          <p className="mt-2 text-xl">
            <strong>Participation Limit:</strong>{" "}
            {UpcomingEvents.participationLimit}
          </p>
        </div>

        {/* List of Participant Applications */}
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold py-2">Participant Applications:</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-lg px-8 py-1 font-semibold text-white"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Apply{" "}
            </button>
          </div>
          <table className="table">
            {/* head */}
            <thead>
              <tr className="bg-gray-500 text-white">
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Description</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {UpcomingEvents.ParticipantApplications.filter(
                (application) => application.applicantAnonymity === "Public"
              ).map((application, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{application.applicantName}</td>
                  <td>{application.applicantEmail}</td>
                  <td>{application.applicantDescription}</td>
                  <td>{application.applicantState}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for applying */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white text-black border-2 border-red-500">
          <h3 className="font-bold text-xl text-center">Apply for Fair</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Applicant Name */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Name
              </label>
              <input
                id="applicantName"
                type="text"
                {...register("applicantName", {
                  required: "Applicant Name is required",
                })}
                className="w-full p-2 border border-gray-300 rounded bg-white"
              />
              {errors.applicantName && (
                <p className="text-red-500">{errors.applicantName.message}</p>
              )}
            </div>

            {/* Applicant Email */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Email
              </label>
              <input
                id="applicantEmail"
                type="email"
                {...register("applicantEmail", {
                  required: "Applicant Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-2 border border-gray-300 rounded bg-white"
              />
              {errors.applicantEmail && (
                <p className="text-red-500">{errors.applicantEmail.message}</p>
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
                  required: "Please tell us about yourself",
                })}
                className="w-full p-2 border border-gray-300 rounded bg-white"
              />
              {errors.applicantDescription && (
                <p className="text-red-500">
                  {errors.applicantDescription.message}
                </p>
              )}
            </div>

            {/* Applicant Anonymity Selector */}
            <div>
              <label className="block text-sm font-bold mb-2">Anonymity</label>
              <select
                id="applicantAnonymity"
                {...register("applicantAnonymity")}
                className="w-full p-2 border border-gray-300 rounded bg-white"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

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
      </dialog>
    </div>
  );
};

export default UpcomingEventsDetails;
