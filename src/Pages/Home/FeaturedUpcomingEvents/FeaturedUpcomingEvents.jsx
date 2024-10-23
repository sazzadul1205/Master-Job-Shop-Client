import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const FeaturedUpcomingEvents = ({ UpcomingEventsData }) => {
  // Determine the number of events to show based on the viewport width
  const getEventsToShow = () => {
    const width = window.innerWidth;
    if (width < 768) {
      return 3; // Mobile view: show 3 events
    } else if (width < 1024) {
      return 4; // Tablet view: show 4 events
    } else {
      return 3; // PC view: show 3 events
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center pt-20 px-5">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-4xl md:text-5xl font-bold italic text-blue-700">
              Upcoming Events
            </p>
            <p className="lg:text-xl">
              Don’t miss out on these great opportunities!
            </p>
          </div>
          <button className="mt-4 md:mt-0 md:ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/UpcomingEvents"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Event Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10 px-5 lg:px-0">
          {UpcomingEventsData.slice(0, getEventsToShow()).map(
            (event, index) => (
              <div
                key={index}
                className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-2xl"
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
                  <p className="text-gray-500">
                    {event.location || "Location"}
                  </p>

                  {/* Description */}
                  <p className="text-gray-700 mt-2">
                    {event?.description?.split(" ").slice(0, 20).join(" ") +
                      (event?.description?.split(" ").length > 20 ? "..." : "")}
                  </p>

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
            )
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
FeaturedUpcomingEvents.propTypes = {
  UpcomingEventsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      eventTitle: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FeaturedUpcomingEvents;
