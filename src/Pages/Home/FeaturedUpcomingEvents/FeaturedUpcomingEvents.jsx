import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";

const FeaturedUpcomingEvents = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching UpcomingEventsData
  const {
    data: UpcomingEventsData,
    isLoading: UpcomingEventsDataIsLoading,
    error: UpcomingEventsDataError,
  } = useQuery({
    queryKey: ["UpcomingEventsData"],
    queryFn: () => axiosPublic.get(`/Upcoming-Events`).then((res) => res.data),
  });

  // Loading state
  if (UpcomingEventsDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (UpcomingEventsDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
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
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="flex items-center pt-20 px-5">
          <div className="">
            <p className="text-5xl font-bold italic text-blue-700">
              Upcoming Events
            </p>
            <p className="text-xl">
              Don’t miss out on these great opportunities!
            </p>
          </div>
          <button className="ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/UpcomingEvents"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Event Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {UpcomingEventsData.slice(0, 3).map((event, index) => (
            <div
              key={index}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-2xl"
            >
              <div className="card-body">
                {/* Event Title */}
                <p className="font-bold text-2xl">
                  {event.eventTitle || "Event Title"}
                </p>

                {/* Date and Time */}
                <p className="text-gray-500">
                  {event.date || "Date"} at {event.time || "Time"}
                </p>

                {/* Location */}
                <p className="text-gray-500">{event.location || "Location"}</p>

                {/* Description */}
                <p className="text-gray-700 mt-2">
                  {event.description || "Event Description"}
                </p>

                {/* Card Actions */}
                <div className="card-actions justify-end mt-5">
                  <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-lg font-semibold text-white">
                    RSVP Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedUpcomingEvents;
