import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { FaInfo } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assets
import Events from "../../../assets/Navbar/Member/Events.png";
import EventDetailsModal from "../../(Public_Pages)/Home/FeaturedEvents/EventDetailsModal/EventDetailsModal";
import MyEventApplicationsModal from "./MyEventApplicationsModal/MyEventApplicationsModal";

const MyEventApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Events ID
  const [selectedEventApplicationID, setSelectedEventApplicationID] =
    useState(null);
  const [selectedEventID, setSelectedEventID] = useState(null);

  // Step 1: Fetch Events Bids
  const {
    data: EventApplicationsData = [],
    isLoading: EventApplicationsIsLoading,
    error: EventApplicationsError,
    refetch: refetchEventApplications,
  } = useQuery({
    queryKey: ["EventApplicationsData"],
    queryFn: () =>
      axiosPublic.get(`/EventApplications?email=${user?.email}`).then((res) => {
        const data = res.data;
        return Array.isArray(data) ? data : [data]; // normalize to array
      }),
    enabled: !!user?.email,
  });

  // Step 2: Extract unique EventsIds
  const eventIds = EventApplicationsData.map((app) => app.eventId);
  const uniqueEventIds = [...new Set(eventIds)];

  //   Step 3: Fetch Events Data
  const {
    data: EventsData = [],
    isLoading: EventsIsLoading,
    error: EventsError,
    refetch: EventsRefetch,
  } = useQuery({
    queryKey: ["EventsData", uniqueEventIds],
    queryFn: () =>
      axiosPublic
        .get(`/Events?eventIds=${uniqueEventIds.join(",")}`)
        .then((res) => res.data),
    enabled: !!user?.email && uniqueEventIds.length > 0,
  });

  // Refetch All
  const refetchAll = async () => {
    await refetchEventApplications();
    await EventsRefetch();
  };

  //   UI Error / Loading
  if (loading || EventApplicationsIsLoading || EventsIsLoading)
    return <Loading />;
  if (EventApplicationsError || EventsError) return <Error />;

  // Merge application & Events data
  const mergedData = EventApplicationsData.map((application) => {
    const event = EventsData.find((event) => event._id === application.eventId);
    return {
      ...application,
      event,
    };
  }).filter((item) => item.event);

  // Delete Bid Handler
  const handleDeleteEventApplication = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the Event Application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`/EventApplications/${id}`);

        if (res.status === 200) {
          // Refetch updated data
          await refetchAll();

          // Temporary success toast (auto-dismiss)
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Event Application has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
        // Show detailed error
        Swal.fire({
          icon: "error",
          title: "Failed to delete",
          text:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  console.log("merged Data :", mergedData);

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Mentorship Applications
      </h3>

      {/* Divider */}
      <p className="bg-white py-[2px] w-1/3 mx-auto" />

      {/* Table */}
      <div className="overflow-x-auto shadow mt-5">
        <table className="min-w-full text-sm text-gray-800">
          {/* Table Header */}
          <thead className="bg-gray-500 text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="px-3 py-4 text-left">Event Title</th>
              <th className="px-3 py-4 text-left">Type</th>
              <th className="px-3 py-4 text-left">Category</th>
              <th className="px-3 py-4 text-left">Format</th>
              <th className="px-3 py-4 text-left">Price</th>
              <th className="px-3 py-4 text-left">organize</th>
              <th className="px-3 py-4 text-left">Attendance</th>
              <th className="px-3 py-4 text-left">Applied On</th>
              <th className="px-3 py-4 text-left">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y bg-white">
            {mergedData.length > 0 ? (
              mergedData.map((app) => {
                // Extract event data
                const event = app.event;

                // Format appliedAt
                const fullDate = new Date(app.appliedAt).toLocaleString(
                  "en-BD",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }
                );

                return (
                  <tr key={app._id} className="hover:bg-gray-50 transition">
                    {/* Event Title & Location */}
                    <td className="px-4 py-3 text-sm font-semibold">
                      <div>{event.title}</div>
                      <div className="text-xs text-gray-500 italic">
                        {event?.location?.venue}, {event?.location?.city}
                      </div>
                    </td>

                    {/* Type / Subcategory */}
                    <td className="px-4 py-3 text-sm">
                      {event.type}
                      <div className="text-xs text-gray-500">
                        {event.subCategory}
                      </div>
                    </td>

                    {/* Category & Tags */}
                    <td className="px-4 py-3 text-sm">
                      <div>{event.category}</div>
                      <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                        {event.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 border px-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Format & Capacity */}
                    <td className="px-4 py-3 text-sm">
                      {event.format}
                      <div className="text-xs text-gray-500">
                        Capacity: {event.capacity || "N/A"}
                      </div>
                    </td>

                    {/* Price Details */}
                    <td className="px-4 py-3 text-sm">
                      {event.price?.isFree
                        ? "Free"
                        : `$${event.price?.standard ?? "?"}`}
                      {event.price?.earlyBird && (
                        <div className="text-xs text-green-600">
                          Early Bird: ${event.price.earlyBird}
                        </div>
                      )}
                      {event.price?.vip && (
                        <div className="text-xs text-yellow-600">
                          VIP: ${event.price.vip}
                        </div>
                      )}
                    </td>

                    {/* Organizer */}
                    <td className="px-4 py-3 text-sm">
                      {event.organizer?.name || "N/A"}
                      <div className="text-xs text-blue-600 truncate">
                        {event.organizer?.contactEmail}
                      </div>
                    </td>

                    {/* Application Info */}
                    <td className="px-4 py-3 text-sm">
                      <div className="capitalize">{app.attendanceType}</div>
                      <div className="text-xs text-gray-500">
                        {app.attendees} attendee(s)
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Phone: {app.phone}
                      </div>
                    </td>

                    {/* Applied Timestamp */}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{fullDate}</div>
                      <div className="text-xs italic text-gray-500">
                        {formatDistanceToNow(new Date(app.appliedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 flex items-center gap-2">
                      {/* View Application */}
                      <button
                        id={`view-events-application-${app._id}`}
                        data-tooltip-content="View Events Application Data"
                        onClick={() => {
                          setSelectedEventApplicationID(app._id);
                          document
                            .getElementById("View_Event_Application_Modal")
                            .showModal();
                        }}
                        className="bg-white hover:bg-blue-300/50 border-2 border-blue-600 rounded-full p-3 cursor-pointer"
                      >
                        <img src={Events} alt="events app" className="w-5" />
                      </button>
                      <Tooltip
                        anchorSelect={`#view-events-application-${app._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white"
                      />

                      {/* Delete */}
                      <div
                        id={`delete-events-application-${app._id}`}
                        data-tooltip-content="Cancel Event Application"
                        onClick={() => handleDeleteEventApplication(app._id)}
                        className="p-3 text-lg border-2 border-red-500 hover:bg-red-200 rounded-full cursor-pointer"
                      >
                        <ImCross />
                      </div>
                      <Tooltip
                        anchorSelect={`#delete-events-application-${app._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white"
                      />

                      {/* View Details */}
                      <div
                        id={`event-details-btn-${app._id}`}
                        data-tooltip-content="View Event Details"
                        onClick={() => {
                          setSelectedEventID(event._id);
                          document
                            .getElementById("Event_Details_Modal")
                            .showModal();
                        }}
                        className="p-3 text-lg border-2 border-yellow-500 hover:bg-yellow-200 rounded-full cursor-pointer"
                      >
                        <FaInfo />
                      </div>
                      <Tooltip
                        anchorSelect={`#event-details-btn-${app._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <dialog id="View_Event_Application_Modal" className="modal">
        <MyEventApplicationsModal
          selectedEventApplicationID={selectedEventApplicationID}
          setSelectedEventApplicationID={setSelectedEventApplicationID}
        />
      </dialog>

      <dialog id="Event_Details_Modal" className="modal">
        <EventDetailsModal
          selectedEventID={selectedEventID}
          setSelectedEventID={setSelectedEventID}
        />
      </dialog>
    </section>
  );
};

export default MyEventApplications;
