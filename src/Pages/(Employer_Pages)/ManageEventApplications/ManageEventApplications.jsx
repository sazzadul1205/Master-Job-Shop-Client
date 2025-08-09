import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaRegClock,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assets
import EventApplicationBlue from "../../../assets/EmployerLayout/EventApplication/EventApplicationBlue.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import EventApplicantTable from "./EventApplicantTable/EventApplicantTable";

const ManageEventApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Pagination States
  const [pageStates, setPageStates] = useState({});

  // Expanded Event Id
  const [expandedEventId, setExpandedEventId] = useState(null);

  // Selected Application ID
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // Items Per Page
  const ITEMS_PER_PAGE = 10;

  // Event Data
  const {
    data: EventData,
    isLoading: EventIsLoading,
    error: EventError,
    refetch: EventRefetch,
  } = useQuery({
    queryKey: ["EventData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Events?postedBy=${user?.email}`);
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") return [data]; // wrap single object in array
      return [];
    },
  });

  // Getting Event Ids
  const eventIds = EventData?.map((event) => event._id) || [];

  // Fetching Event Applications Data
  const {
    data: EventApplicationsData,
    isLoading: EventApplicationsLoading,
    error: EventApplicationsError,
    refetch: EventApplicationsRefetch,
  } = useQuery({
    queryKey: ["EventApplicationsData", eventIds],
    queryFn: () => {
      const query = eventIds.map((id) => `eventIds[]=${id}`).join("&");
      return axiosPublic
        .get(`/EventApplications?${query}`)
        .then((res) => res.data);
    },
    enabled: eventIds.length > 0,
  });

  // Combining Event and Job Applications Data
  const EventWithApplicants = EventData?.map((event) => {
    const applicants =
      EventApplicationsData?.filter((app) => app.eventId === event._id) || [];
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

  // Handle Reject Applications
  const handleRejectApplicant = async (applicantId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to reject this applicant?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reject",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusCancel: true,
      });

      if (!isConfirmed) return;

      const response = await axiosPublic.put(
        `/EventApplications/Status/${applicantId}`,
        {
          status: "Rejected",
        }
      );

      if (response.status !== 200) {
        console.error("Failed to reject applicant:", response.statusText);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to reject applicant. Please try again.",
          confirmButtonText: "Ok",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Applicant has been rejected.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      refetch();

      // Optionally trigger refresh or state update here
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center py-3 px-5">
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <img
            src={EventApplicationBlue}
            alt="Manage Job Applicant Icons"
            className="w-6 h-6"
          />
          Manage Event Applications
        </h3>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Event Container */}
      <div className="px-4 pt-4 space-y-3">
        {EventWithApplicants?.map((event, index) => {
          // Pagination
          const currentPage = pageStates[event._id] || 1;

          const sortedApplicants = [...event.Applicants].sort((a, b) => {
            const getOrder = (status) => {
              if (status === "Accepted") return 0;
              if (status === "Rejected") return 2;
              return 1;
            };
            return getOrder(a.status) - getOrder(b.status);
          });

          const paginatedApplicants = sortedApplicants.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
          );

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
                <p>
                  Applicants:{" "}
                  <span className="text-gray-900">
                    {event.Applicants?.length || 0}
                  </span>
                </p>
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
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  expandedEventId === event._id
                    ? "max-h-[1000px] pt-4"
                    : "max-h-0"
                }`}
              >
                {/* Applicants Table */}
                <EventApplicantTable
                  paginatedApplicants={paginatedApplicants}
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
        })}
      </div>
    </>
  );
};

export default ManageEventApplications;
