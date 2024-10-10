import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import UpcomingEventsCard from "./UpcomingEventsCard/UpcomingEventsCard";

const UpcomingEventsDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false); // To track if user has applied
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // Fetching event details by ID
  const {
    data: UpcomingEvents,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["UpcomingEventsDetailsData", id],
    queryFn: () =>
      axiosPublic.get(`/Upcoming-Events/${id}`).then((res) => res.data),
  });

  // Check if the user has already applied
  useEffect(() => {
    if (user && UpcomingEvents) {
      const applied = UpcomingEvents.ParticipantApplications.some(
        (app) => app.applicantEmail === user.email
      );
      setHasApplied(applied);
    }
  }, [user, UpcomingEvents]);

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
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-5" />
          Back
        </button>

        {/* Event Details */}
        <div className="py-5">
          <h2 className="text-3xl font-bold text-black">
            {UpcomingEvents?.eventTitle}
          </h2>
          <div className="mt-2 ">
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Date:</strong>{" "}
              <span>{UpcomingEvents?.date}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Time:</strong>{" "}
              <span>{UpcomingEvents?.time}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Location:</strong>{" "}
              <span>{UpcomingEvents?.location}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Description:</strong>{" "}
              <span>{UpcomingEvents?.description}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Organizer:</strong>{" "}
              <span>{UpcomingEvents?.organizer}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Participation Criteria:</strong>{" "}
              <span>{UpcomingEvents?.participationCriteria}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Required Resources:</strong>{" "}
              <span>{UpcomingEvents?.requiredResources?.join(", ")}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Contact Email:</strong>{" "}
              <span>{UpcomingEvents?.contactEmail}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Participation Fee:</strong>{" "}
              <span>{UpcomingEvents?.participationFee}</span>
            </p>
            <p className="text-xl grid grid-cols-2 py-2">
              <strong className="1/3">Participation Limit:</strong>{" "}
              <span>{UpcomingEvents?.participationLimit}</span>
            </p>
          </div>
        </div>

        {/* Application Section */}
        <div className="text-xl bg-sky-100 py-3 px-5 flex justify-between items-center">
          <p>
            People Applied:{" "}
            {UpcomingEvents?.ParticipantApplications?.length || 0}
          </p>
          <div>
            {user ? (
              hasApplied ? (
                <button
                  className="bg-gray-500 w-48 py-2 text-white font-bold"
                  disabled
                >
                  Already Applied
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-600 text-lg w-48 py-2 font-semibold text-white"
                  onClick={() =>
                    document.getElementById("Apply_To_Event").showModal()
                  }
                >
                  Apply
                </button>
              )
            ) : (
              <Link to={"/Login"}>
                <button className="bg-blue-500 hover:bg-blue-400 w-48 py-2 text-white font-bold">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Modal for applying */}
      <dialog id="Apply_To_Event" className="modal">
        <UpcomingEventsCard
          refetch={refetch}
          id={id}
          UpcomingEvents={UpcomingEvents}
        />
      </dialog>
    </div>
  );
};

export default UpcomingEventsDetails;
