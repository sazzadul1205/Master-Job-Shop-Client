import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Shared/Loader/Loader";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component"; // Make sure you have installed this package

const UpcomingEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9; // Set how many events per page
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

  // Filtered events based on search term
  const filteredEvents = UpcomingEventsData.filter((event) =>
    event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const hasMore = currentPage * eventsPerPage < filteredEvents.length; // Check if more events are available

  const loadMoreJobs = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <div className=" pt-20">
        {/* Search Box and Filters */}
        <div className="flex flex-col md:flex-row justify-between space-x-4 pt-5 mx-auto max-w-[1200px]">
          {/* Title */}
          <div className="text-black">
            <p className="text-2xl font-bold">Our Upcoming Events</p>
            <p>Don’t miss out on these great opportunities!</p>
          </div>

          {/* Search bar */}
          <label className="input input-bordered flex items-center gap-2 w-[500px] bg-white">
            <input
              type="text"
              className="grow py-2 px-3 focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="h-4 w-4 opacity-70 text-black" />
          </label>
        </div>

        {/* Event Cards Section with Infinite Scroll */}
        <InfiniteScroll
          dataLength={currentPage * eventsPerPage}
          next={loadMoreJobs}
          hasMore={hasMore}
          loader={
            <h4 className="text-2xl text-center font-bold py-5 text-blue-500">
              Loading...
            </h4>
          }
          endMessage={
            <p className="text-2xl text-center font-bold py-5 text-red-500">
              No more events to load
            </p>
          }
        >
          <div className="grid grid-cols-3 gap-4 pt-5 mx-auto max-w-[1200px]">
            {filteredEvents.length > 0 ? (
              filteredEvents
                .slice(0, currentPage * eventsPerPage) // Display events based on current page
                .map((event, index) => (
                  <div
                    key={index}
                    className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-2xl"
                  >
                    <div className="card-body">
                      {/* Event Title */}
                      <p className="font-bold text-2xl">{event.eventTitle}</p>

                      {/* Date and Time */}
                      <p className="text-gray-500">
                        {event.date} at {event.time}
                      </p>

                      {/* Location */}
                      <p className="text-gray-500">{event.location}</p>

                      {/* Description */}
                      <p className="text-gray-700 mt-2">{event.description}</p>

                      {/* Card Actions */}
                      <div className="card-actions justify-end mt-5">
                        <Link to={`/UpcomingEventsDetails/${event._id}`}>
                          <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-lg font-semibold text-white">
                            RSVP Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-xl font-bold">No events found.</p>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default UpcomingEvents;
