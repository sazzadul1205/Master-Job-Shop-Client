import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import DefaultCompanyLogo from "../../../../../assets/DefaultCompanyLogo.jpg";

// Shared Components
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Helpers
const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // convert 0 to 12 for 12-hour clock

  return `${
    months[date.getMonth()]
  }, ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
};

const EventDetailsModal = ({ selectedEventID, setSelectedEventID }) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedEventData", selectedEventID],
    queryFn: () =>
      axiosPublic.get(`/Events?id=${selectedEventID}`).then((res) => res.data),
    enabled: !!selectedEventID,
  });

  const handleClose = () => {
    setSelectedEventID("");
    document.getElementById("Event_Details_Modal")?.close();
  };

  // Loading State
  if (isLoading)
    return (
      <div className="min-w-5xl max-h-[90vh] relative">
        <div
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );

  // Error State
  if (error)
    return (
      <div className="min-w-5xl max-h-[90vh] relative">
        <div
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );

  if (!event) return null;

  return (
    <div
      id="Event_Details_Modal"
      className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6 text-black"
    >
      {/* Close Button */}
      <div
        onClick={handleClose}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={event?.organizer?.logo || DefaultCompanyLogo}
          alt={event?.organizer?.name}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold">{event?.title}</h2>
          <p className="text-gray-500">
            {event?.category} - {event?.subCategory}
          </p>
          <p className="text-sm text-gray-400">
            Posted on {formatDateTime(event?.publishedAt)}
          </p>
        </div>
      </div>

      {/* Banner */}
      {event?.media?.banner && (
        <img
          src={event.media.banner}
          alt="Event Banner"
          className="w-full rounded-lg mb-4"
        />
      )}

      {/* Description */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{event?.description}</p>
      </section>

      {/* Tags */}
      {event?.tags?.length > 0 && (
        <section className="py-4 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Audience */}
      {event?.audience?.length > 0 && (
        <section className="py-4 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-2">Audience</h3>
          <ul
            className="list-disc pl-5 text-gray-700"
            style={{
              columnCount: 2, // 3 columns for example, adjust as needed
              columnGap: "1.5rem",
            }}
          >
            {event.audience.map((item, idx) => (
              <li key={idx} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Location */}
      <section className="py-4 border-t border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Location</h3>

        {event?.format === "Online" ? (
          event?.liveLink ? (
            <a
              href={event.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Join Online Event
            </a>
          ) : (
            <p className="text-gray-500">Online event link not available.</p>
          )
        ) : (
          <>
            <p>{event?.location?.venue}</p>
            <p>{event?.location?.address}</p>
            <p>
              {event?.location?.city}, {event?.location?.country}
            </p>
            {event?.location?.googleMapLink && (
              <a
                href={event.location.googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm"
              >
                View on Google Maps
              </a>
            )}
          </>
        )}
      </section>

      {/* Dates */}
      <section className="py-4 border-t border-gray-300">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">Event Start Date : </h3>
            <p>{formatDateTime(event?.startDate)}</p>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">Event End Date : </h3>
            <p>{formatDateTime(event?.endDate)}</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-4 border-t border-gray-300">
        <div className="flex items-center gap-3">
          {/* Title */}
          <h3 className="font-semibold">Price Per Ticket :</h3>

          {/* If free or Price */}
          {event?.price?.isFree ? (
            <p className="text-green-600 font-semibold">Free</p>
          ) : (
            <p>
              {event?.price?.standard} {event?.price?.currency}
            </p>
          )}
        </div>
      </section>

      {/* Registration */}
      <section className="py-4 border-t border-gray-300">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">Registration</h3>

        {/* Registration Content */}
        <div className="grid grid-cols-2 gap-3">
          {/* Opens */}
          <p>
            <strong>Registration Opens:</strong>{" "}
            {formatDateTime(event?.registration?.openDate)}
          </p>

          {/* Closes */}
          <p>
            <strong>Registration Closes:</strong>{" "}
            {formatDateTime(event?.registration?.closeDate)}
          </p>

          {/* Tickets Per Person */}
          <p>
            <strong>Max Tickets per Person:</strong>{" "}
            {event?.registration?.maxTicketsPerPerson}{" "}
            {event?.registration?.maxTicketsPerPerson === "1" ||
            event?.registration?.maxTicketsPerPerson === 1
              ? "Person"
              : "Persons"}
          </p>

          {/* Requires Approval */}
          <p>
            <strong>Requires Approval:</strong>{" "}
            {event?.registration?.requiresApproval ? "Yes" : "No"}
          </p>
        </div>

        {/* Registration Link */}
        <div className="mt-2">
          {event?.registration?.registrationUrl && (
            <a
              href={event.registration.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Registration Link
            </a>
          )}
        </div>
      </section>

      {/* Organizer */}
      <section className="py-4 border-t border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Organizer</h3>
        <div className="flex items-center gap-4 mb-3">
          <img
            src={event?.organizer?.logo || DefaultCompanyLogo}
            alt={event?.organizer?.name || "Organizer Logo"}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <p className="font-semibold text-lg">{event?.organizer?.name}</p>
            <p className="text-sm text-gray-600">
              Email: {event?.organizer?.contactEmail}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {event?.organizer?.contactPhone}
            </p>
            {event?.organizer?.website && (
              <a
                href={event.organizer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Schedule */}
      {event?.schedule?.length > 0 && (
        <section className="py-4 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-2">Schedule</h3>
          <ul className="space-y-6">
            {event.schedule.map((item, idx) => (
              <li
                key={idx}
                className="border-b border-gray-300 pb-4 last:border-b-0"
                style={{ scrollMarginTop: "100px" }}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {idx + 1}. {item.title}
                  </h4>
                  <span className="text-sm text-gray-500 font-mono whitespace-nowrap">
                    {formatDateTime(item.startTime)} -{" "}
                    {formatDateTime(item.endTime)}
                  </span>
                </div>

                {item.speaker && (
                  <p className="text-sm italic text-gray-600 mb-2">
                    Speaker: {item.speaker}
                  </p>
                )}

                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sponsors */}
      {/* Sponsors */}
      {event?.sponsors?.length > 0 && (
        <section className="py-6 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-6">Sponsors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {event.sponsors.map((sponsor, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <p className="font-semibold text-gray-900 mb-2">
                  {sponsor.tier} Sponsor
                </p>
                <p className="mb-4">{sponsor.name}</p>
                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Area */}
      <div className="flex justify-end mt-6">
        <Link to={`/Events/Apply/${event?._id}`}>
          <CommonButton
            text="Register"
            textColor="text-white"
            bgColor="blue"
            px="px-4"
            py="py-2"
            width="auto"
            className="text-sm font-medium"
          />
        </Link>
      </div>
    </div>
  );
};

EventDetailsModal.propTypes = {
  selectedEventID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedEventID: PropTypes.func.isRequired,
};

export default EventDetailsModal;
