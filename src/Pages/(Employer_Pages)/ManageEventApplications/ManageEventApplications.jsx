import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

// Icons
import {
  FaAngleLeft,
  FaAngleRight,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// Assets
import EventApplicationBlue from "../../../assets/EmployerLayout/EventApplication/EventApplicationBlue.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Component - Table
import EventApplicantTable from "./EventApplicantTable/EventApplicantTable";

// Modal
import MyEventApplicationModal from "./MyEventApplicationModal/MyEventApplicationModal";
import ViewMemberProfileModal from "../CompanyDashboard/CompanyDashboardRecentApplicant/ViewMemberProfileModal/ViewMemberProfileModal";

const ManageEventApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Pagination States
  const [pageStates, setPageStates] = useState({});

  // Expanded Event Id
  const [expandedEventId, setExpandedEventId] = useState(null);

  // Selected Application ID
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // User Email State
  const [userEmail, setUserEmail] = useState("");


  // Items Per Page
  const ITEMS_PER_PAGE = 10;

  // Event Data
  const {
    data: EventData = [],
    isLoading: EventIsLoading,
    error: EventError,
    refetch: EventRefetch,
  } = useQuery({
    queryKey: ["EventData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Events?postedBy=${user?.email}`);
        const data = res.data;
        if (Array.isArray(data)) return data;
        if (data && typeof data === "object") return [data];
        return [];
      } catch (err) {
        console.log(err);
        return []; // return empty array on any error
      }
    },
  });

  // Getting Event Ids
  const eventIds = EventData.map((event) => event._id);

  // Event Applications Data
  const {
    data: EventApplicationsData = [],
    isLoading: EventApplicationsLoading,
    error: EventApplicationsError,
    refetch: EventApplicationsRefetch,
  } = useQuery({
    queryKey: ["EventApplicationsData", eventIds],
    queryFn: async () => {
      try {
        if (eventIds.length === 0) return [];
        const query = eventIds.map((id) => `eventIds[]=${id}`).join("&");
        const res = await axiosPublic.get(`/EventApplications?${query}`);
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.log(err);
        return []; // return empty array on any error
      }
    },
    enabled: eventIds.length > 0,
  });

  // Combine Events and Applications
  const EventWithApplicants = EventData.map((event) => {
    const applicants = EventApplicationsData.filter(
      (app) => app.eventId === event._id
    );
    return { ...event, Applicants: applicants };
  });

  // Refetching Data
  const refetch = () => {
    EventRefetch();
    EventApplicationsRefetch();
  };

  // Loading / Error UI Handling
  if (EventIsLoading || EventApplicationsLoading || loading) return <Loading />;
  if (EventError || EventApplicationsError) return <Error />;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center py-3 px-5">
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          {/* Icon */}
          <img
            src={EventApplicationBlue}
            alt="Manage Job Applicant Icons"
            className="w-6 h-6"
          />
          {/* Title */}
          Manage Event Applications
        </h3>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Event Container */}
      <div className="px-4 py-4 space-y-3">
        {EventWithApplicants?.length > 0 ? (
          EventWithApplicants?.map((event, index) => {
            // Pagination
            const currentPage = pageStates[event._id] || 1;

            // Sort applicants by status
            const sortedApplicants = [...event.Applicants].sort((a, b) => {
              const getOrder = (status) => {
                if (!status) return 0; // No status first
                if (status === "Accepted") return 1;
                if (status === "Rejected") return 2;
                return 3; // Any other status last, just in case
              };
              return getOrder(a.status) - getOrder(b.status);
            });

            // Apply pagination
            const paginatedApplicants = sortedApplicants.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            );

            // Calculate total pages
            const totalPages = Math.ceil(
              sortedApplicants.length / ITEMS_PER_PAGE
            );

            return (
              <div
                key={event._id}
                className="w-full border border-gray-200 rounded p-6 bg-white shadow hover:shadow-lg transition duration-300"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                  {/* Title */}
                  <h2 className="flex items-center text-lg font-semibold text-gray-900">
                    #{index + 1}. {event.title}
                  </h2>

                  {/* Category */}
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Category:</span>{" "}
                    {event.category}
                    {event.subCategory && (
                      <span className="ml-2 text-gray-500">
                        ({event.subCategory})
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200 mb-4" />

                {/* Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-800 mb-4">
                  {/* Location */}
                  <div>
                    <span className="font-medium text-gray-900">Location:</span>{" "}
                    {event.location?.venue}, {event.location?.city}
                  </div>

                  {/* Type */}
                  <div>
                    <span className="font-medium text-gray-900">Type:</span>{" "}
                    {event.type}
                  </div>

                  {/* Format */}
                  <div>
                    <span className="font-medium text-gray-900">Format:</span>{" "}
                    {event.format}
                  </div>

                  {/* Price */}
                  <div>
                    <span className="font-medium text-gray-900">Price:</span>{" "}
                    {event.price?.isFree
                      ? "Free"
                      : `${event.price?.standard} ${event.price?.currency}`}
                  </div>

                  {/* Start Date */}
                  <div>
                    <span className="font-medium text-gray-900">Start:</span>{" "}
                    {new Date(event.startDate).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>

                  {/* End Date */}
                  <div>
                    <span className="font-medium text-gray-900">End:</span>{" "}
                    {new Date(event.endDate).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Applicants Section */}
                <div className="flex justify-between items-center pt-4 text-sm font-medium text-gray-700">
                  {/* Applicants Number */}
                  <div className="flex text-sm font-medium text-gray-700 gap-4">
                    {/* Total Applicants  */}
                    <p>
                      Applicants:{" "}
                      <span className="text-gray-900">
                        {event.Applicants.length}
                      </span>
                    </p>

                    {/* Accepted Applicants */}
                    {event.Applicants.filter((app) => app.status === "Accepted")
                      .length > 0 && (
                        <>
                          {" | "}
                          <p>
                            Accepted:{" "}
                            <span className="text-green-600 font-semibold">
                              {
                                event.Applicants.filter(
                                  (app) => app.status === "Accepted"
                                ).length
                              }
                            </span>
                          </p>
                        </>
                      )}

                    {/* Rejected Applicants */}
                    {event.Applicants.filter((app) => app.status === "Rejected")
                      .length > 0 && (
                        <>
                          {" | "}
                          <p>
                            Rejected:{" "}
                            <span className="text-red-600 font-semibold">
                              {
                                event.Applicants.filter(
                                  (app) => app.status === "Rejected"
                                ).length
                              }
                            </span>
                          </p>
                        </>
                      )}
                  </div>

                  {/* Open / Close Applicants Table Button */}
                  <button
                    onClick={() =>
                      expandedEventId === event._id
                        ? setExpandedEventId(null)
                        : setExpandedEventId(event._id)
                    }
                    className="flex items-center gap-1 text-blue-600 hover:underline transition cursor-pointer"
                  >
                    {expandedEventId === event._id ? (
                      <>
                        <FaChevronUp className="text-base" /> Close Applicants
                      </>
                    ) : (
                      <>
                        <FaChevronDown className="text-base" /> View Applicants
                      </>
                    )}
                  </button>
                </div>

                {/* Applicants Table */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedEventId === event._id
                    ? "max-h-[1000px] pt-4"
                    : "max-h-0"
                    }`}
                >
                  {/* Applicants Table */}
                  <EventApplicantTable
                    refetch={refetch}
                    currentPage={currentPage}
                    setUserEmail={setUserEmail}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    paginatedApplicants={paginatedApplicants}
                    selectedApplicationID={selectedApplicationID}
                    setSelectedApplicationID={setSelectedApplicationID}
                  />

                  {/* Pagination Controls */}
                  {event.Applicants.length > ITEMS_PER_PAGE && (
                    <div className="flex justify-center pt-2">
                      <div className="join">
                        {/* Left Button */}
                        <button
                          className="join-item bg-white text-black border border-gray-400 hover:bg-gray-300 px-3 py-2 cursor-pointer"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setPageStates((prev) => ({
                              ...prev,
                              [event._id]: currentPage - 1,
                            }))
                          }
                        >
                          <FaAngleLeft />
                        </button>

                        {/* Page Count */}
                        <button className="join-item bg-white text-black border border-gray-400 px-3 py-2 cursor-default">
                          Page {currentPage}
                        </button>

                        {/* Right Button */}
                        <button
                          className="join-item bg-white text-black border border-gray-400 hover:bg-gray-300 px-3 py-2 cursor-pointer"
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setPageStates((prev) => ({
                              ...prev,
                              [event._id]: currentPage + 1,
                            }))
                          }
                        >
                          <FaAngleRight />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-16 px-4">
            <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              No Events Posted Yet
            </p>
            <p className="text-sm text-gray-500 max-w-xs text-center">
              Looks like you haven&apos;t posted any events yet. Start creating
              events now to engage your community!
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {/* View Application Modal */}
      <dialog id="View_Event_Applications_Modal" className="modal">
        <MyEventApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* View User Profile Modal */}
      <dialog id="View_Profile_Modal" className="modal">
        <ViewMemberProfileModal userEmail={userEmail} setUserEmail={setUserEmail} />
      </dialog>
    </>
  );
};

// Prop Validation
EventApplicantTable.propTypes = {
  refetch: PropTypes.func.isRequired,
  paginatedApplicants: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.string,
      profileImage: PropTypes.string,
      fullName: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      attendees: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      appliedAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    })
  ).isRequired,
  setSelectedApplicationID: PropTypes.func.isRequired,
};
export default ManageEventApplications;
