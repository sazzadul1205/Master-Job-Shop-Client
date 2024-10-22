import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import UpcomingEventsCard from "./UpcomingEventsCard/UpcomingEventsCard";
import { Helmet } from "react-helmet";
import BackButton from "../../Shared/BackButton/BackButton";

const UpcomingEventsDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false); // To track if user has applied
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
    <div className="bg-gradient-to-b from-blue-400 to-blue-50  min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Master Job Shop || Upcoming Events Details</title>
      </Helmet>
      <div className="max-w-[1200px] mx-auto text-black pt-28 bg-slate-50 opacity-80 px-5 py-5">
        {/* Back button with navigation */}
        <BackButton></BackButton>

        {/* Event Details */}
        <div className="py-5">
          <h2 className="text-3xl font-bold text-black">
            {UpcomingEvents?.eventTitle}
          </h2>
          <div className="mt-2 ">
            {/* date */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Date:</strong>{" "}
              <span className="ml-5">{UpcomingEvents?.date}</span>
            </p>
            {/* time */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Time:</strong>{" "}
              <span className="ml-5">{UpcomingEvents?.time}</span>
            </p>
            {/* location */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Location:</strong>{" "}
              <span className="ml-5">{UpcomingEvents?.location}</span>
            </p>
            {/* description */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Description:</strong>{" "}
              <span className="ml-5">{UpcomingEvents?.description}</span>
            </p>
            {/* organizer */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Organizer:</strong>{" "}
              <span className="ml-5">{UpcomingEvents?.organizer}</span>
            </p>
            {/* participationCriteria */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Participation Criteria:</strong>{" "}
              <span className="ml-5">
                {UpcomingEvents?.participationCriteria}
              </span>
            </p>
            {/* requiredResources */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Required Resources:</strong>{" "}
              <span className="ml-5">
                {UpcomingEvents?.requiredResources?.join(", ")}
              </span>
            </p>
            {/* contactEmail */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Contact Email:</strong>{" "}
              <span className="ml-5">{UpcomingEvents?.contactEmail}</span>
            </p>
            {/* participationFee */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Participation Fee:</strong>{" "}
              <span className="ml-5">{UpcomingEvents?.participationFee}</span>
            </p>
            {/* participationLimit */}
            <p className="text-xl flex flex-col md:flex-row py-2">
              <strong className="w-52">Participation Limit:</strong>{" "}
              <span className="ml-5">{UpcomingEvents?.participationLimit}</span>
            </p>
          </div>
        </div>

        {/* Application Section */}
        <div className="text-xl flex flex-col md:flex-row bg-sky-100 py-3 px-5 justify-between items-center mt-5">
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
