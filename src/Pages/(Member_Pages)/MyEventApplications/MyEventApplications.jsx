import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

// Modals
import MyEventApplicationsModal from "./MyEventApplicationsModal/MyEventApplicationsModal";
import EventDetailsModal from "../../(Public_Pages)/Home/FeaturedEvents/EventDetailsModal/EventDetailsModal";

const MyEventApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Events ID
  const [applicationList, setApplicationList] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

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

  // Step 3: Fetch Events Data
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
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email && uniqueEventIds.length > 0,
  });

  // Set application list
  useEffect(() => {
    if (EventApplicationsData.length > 0) {
      setApplicationList(EventApplicationsData);
    }
  }, [EventApplicationsData]);

  // Delete Event Handler
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
          // Optimistically update state
          setApplicationList((prev) =>
            prev.filter((internship) => internship._id !== id)
          );

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Event has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Silent refetch
          await refetchEventApplications({ throwOnError: false });
          await EventsRefetch({ throwOnError: false });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
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

  //   UI Error / Loading
  if (loading || EventApplicationsIsLoading || EventsIsLoading)
    return <Loading />;
  if (EventApplicationsError || EventsError) return <Error />;

  // Merge application with Event
  const mergedData = applicationList
    .map((application) => {
      const event = EventsData.find(
        (event) => event._id === application.eventId
      );
      return {
        ...application,
        event,
      };
    })
    .filter((item) => item.event);

  console.log(mergedData[0]);

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Mentorship Applications
      </h3>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      {/* Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {mergedData.length > 0 ? (
          mergedData.map((app) => {
            const event = app.event;
            const fullDate = new Date(app.appliedAt).toLocaleDateString(
              "en-BD",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            );
            const relative = formatDistanceToNow(new Date(app.appliedAt), {
              addSuffix: true,
            });

            return (
              <div
                key={app._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
              >
                {/* Header: Event Title & Location */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {event?.location?.venue}, {event?.location?.city}
                  </p>
                </div>

                {/* Event Details */}
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p>
                    <span className="font-medium text-gray-800">Type:</span>{" "}
                    {event.type}
                    {event.subCategory && (
                      <span className="ml-1 text-xs text-gray-500">
                        ({event.subCategory})
                      </span>
                    )}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">Category:</span>{" "}
                    {event.category}
                  </p>

                  {event.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                      {event.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 border px-1.5 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p>
                    <span className="font-medium text-gray-800">Format:</span>{" "}
                    {event.format}
                    {event.capacity && (
                      <span className="ml-1 text-xs text-gray-500">
                        (Capacity: {event.capacity})
                      </span>
                    )}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">Price:</span>{" "}
                    {event.price?.isFree ? (
                      "Free"
                    ) : (
                      <>
                        ${event.price?.standard ?? "—"}
                        {event.price?.earlyBird && (
                          <span className="ml-2 text-xs text-green-600">
                            Early: ${event.price.earlyBird}
                          </span>
                        )}
                        {event.price?.vip && (
                          <span className="ml-2 text-xs text-yellow-600">
                            VIP: ${event.price.vip}
                          </span>
                        )}
                      </>
                    )}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Attendance:
                    </span>{" "}
                    {app.attendanceType} ({app.attendees})
                  </p>
                </div>

                {/* Application Timestamp */}
                <div className="text-xs text-gray-500 italic">
                  Applied on {fullDate} &mdash; {relative}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-4 mt-6">
                  {/* View Application */}
                  <button
                    id={`view-events-application-${app._id}`}
                    data-tooltip-content="View Application"
                    onClick={() => {
                      setSelectedApplicationID(event?._id);
                      document
                        .getElementById("View_Event_Application_Modal")
                        .showModal();
                    }}
                    className="flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    <img src={Events} alt="View" className="w-5" />
                  </button>
                  <Tooltip
                    anchorSelect={`#view-events-application-${app._id}`}
                    place="top"
                  />

                  {/* Delete */}
                  <div
                    id={`delete-events-application-${app._id}`}
                    data-tooltip-content="Cancel Application"
                    onClick={() => handleDeleteEventApplication(app._id)}
                    className="flex items-center justify-center w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    <ImCross />
                  </div>
                  <Tooltip
                    anchorSelect={`#delete-events-application-${app._id}`}
                    place="top"
                  />

                  {/* View Event Details */}
                  <div
                    id={`event-details-btn-${app._id}`}
                    data-tooltip-content="View Event Details"
                    onClick={() => {
                      setSelectedEventID(event._id);
                      document
                        .getElementById("Event_Details_Modal")
                        .showModal();
                    }}
                    className="flex items-center justify-center w-11 h-11 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    <FaInfo />
                  </div>
                  <Tooltip
                    anchorSelect={`#event-details-btn-${app._id}`}
                    place="top"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center col-span-full mt-24 px-6 max-w-xl mx-auto">
            <p className="text-2xl font-medium text-white mb-3">
              No Event Applications Found
            </p>
            <p className="text-gray-200 font-semibold text-lg mb-5">
              You haven’t applied to any events yet. Start exploring and get
              involved.
            </p>
            <Link
              to="/Events"
              className="inline-block bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-200 text-black font-semibold py-3 px-10 shadow-lg hover:shadow-xl rounded transition"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* View Event Application Modal */}
      <dialog id="View_Event_Application_Modal" className="modal">
        <MyEventApplicationsModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* Event Details Modal */}
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
