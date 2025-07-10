import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaArrowRight } from "react-icons/fa";

// Modal
import EventDetailsModal from "./EventDetailsModal/EventDetailsModal";

// Shared
import EventCard from "../../../../Shared/EventCard/EventCard";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

const FeaturedEvents = ({ EventsData }) => {
  const [selectedEventID, setSelectedEventID] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-tl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <div>
            <h2 className="text-4xl font-bold text-white">Upcoming Events</h2>
            <p className="lg:text-xl text-gray-200">
              Don’t miss out on these great opportunities!
            </p>
          </div>

          {/* Go To Button */}
          <Link
            to="/Events"
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Show More <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Event Cards Section */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {EventsData.slice(0, 6).map((event, index) => (
            <div
              key={event._id}
              data-aos="fade-up"
              data-aos-delay={index * 150} // 150ms delay between cards
            >
              <EventCard
                event={event}
                setSelectedEventID={setSelectedEventID}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Event Modal */}
      <dialog id="Event_Details_Modal" className="modal">
        <EventDetailsModal
          selectedEventID={selectedEventID}
          setSelectedEventID={setSelectedEventID}
        />
      </dialog>
    </section>
  );
};

// PropTypes validation
FeaturedEvents.propTypes = {
  EventsData: PropTypes.arrayOf(
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

export default FeaturedEvents;
