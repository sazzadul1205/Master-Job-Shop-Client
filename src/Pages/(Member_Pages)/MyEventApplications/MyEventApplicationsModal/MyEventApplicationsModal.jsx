// Packages
import { format } from "date-fns";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../../Shared/Loading/Loading";
import Error from "../../../../Shared/Error/Error";

import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

const EventDetailsModal = ({
  selectedApplicationID,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Event Details
  const {
    data: event = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["EventDetails", selectedApplicationID],
    queryFn: () =>
      axiosPublic
        .get(`/Events?id=${selectedApplicationID}`)
        .then((res) => res.data),
    enabled: !!selectedApplicationID,
  });

  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );

  if (error) return <Error />;

  const formattedDate = event?.date
    ? format(new Date(event.date), "dd MMM yyyy, hh:mm a")
    : "N/A";

  return (
    <div className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800">Event Details</h3>
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedApplicationID(null);
            document.getElementById("View_Event_Application_Modal").close();
          }}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-4 text-sm text-gray-700">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-gray-900">
            {event?.title}
          </h4>
          <p className="text-sm text-gray-500 truncate">
            {event?.location?.venue}, {event?.location?.city}
          </p>
          <p>
            <span className="font-medium">Date & Time:</span> {formattedDate}
          </p>
          <p>
            <span className="font-medium">Type:</span> {event?.type}{" "}
            <span className="text-xs text-gray-500">
              ({event?.subCategory})
            </span>
          </p>
          <p>
            <span className="font-medium">Category:</span> {event?.category}
          </p>
          <p>
            <span className="font-medium">Format:</span> {event?.format}{" "}
            <span className="text-xs text-gray-500">
              (Capacity: {event?.capacity || "N/A"})
            </span>
          </p>
          <p>
            <span className="font-medium">Price:</span>{" "}
            {event?.price?.isFree ? (
              "Free"
            ) : (
              <>
                ${event?.price?.standard ?? "?"}
                {event?.price?.earlyBird && (
                  <span className="ml-2 text-xs text-green-600">
                    Early: ${event.price.earlyBird}
                  </span>
                )}
                {event?.price?.vip && (
                  <span className="ml-2 text-xs text-yellow-600">
                    VIP: ${event.price.vip}
                  </span>
                )}
              </>
            )}
          </p>

          {/* Tags */}
          {Array.isArray(event?.tags) && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 text-xs text-gray-500 mt-2">
              {event.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 border px-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Modules (if present) */}
          {Array.isArray(event?.modules) && event.modules.length > 0 && (
            <div>
              <span className="font-medium block mt-4">Modules:</span>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                {event.modules.map((mod, i) => (
                  <li key={i}>{mod.name || `Module ${i + 1}`}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Speakers (if present) */}
          {Array.isArray(event?.speakers) && event.speakers.length > 0 && (
            <div>
              <span className="font-medium block mt-4">Speakers:</span>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                {event.speakers.map((speaker, i) => (
                  <li key={i}>
                    {speaker.name}
                    {speaker.title && ` — ${speaker.title}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EventDetailsModal.propTypes = {
  selectedApplicationID: PropTypes.string,
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default EventDetailsModal;
