import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { useContext, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import ModalAddEvents from "./ModalAddEvents/ModalAddEvents";
import ModalViewEvents from "./ModalViewEvents/ModalViewEvents";
import { CiViewBoard } from "react-icons/ci";

const ManageEvents = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [viewEventsData, setViewEventsData] = useState(null); // state to hold event details for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Fetching Event Data
  const {
    data: UpcomingEventsData = [], // Default to empty array
    isLoading: UpcomingEventsDataIsLoading,
    error: UpcomingEventsDataError,
    refetch,
  } = useQuery({
    queryKey: ["EventData"],
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

  // Handle viewing event details
  const handleViewInsights = (event) => {
    setViewEventsData(event); // Set the selected event details
    document.getElementById("Modal_Upcoming_Event_View").showModal(); // Show the modal
  };

  // Handle single event deletion
  const handleSingleDelete = (eventID) => {
    setSelectedEventId(eventID); // Set the selected event ID for deletion
    setShowDeleteModal(true); // Open delete confirmation modal
  };

  // Current date for deletion log
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Input submission for deletion reason
  const onSubmit = async (data) => {
    const event = UpcomingEventsData.find(
      (event) => event._id === selectedEventId
    );

    const deleteEventLogData = {
      DeletedBy: user.email,
      PostedBy: event?.postedBy,
      DeletedDate: formattedDateTime,
      Type: "Event",
      deletedContent: event?.eventTitle,
      reason: data.deleteReason,
    };

    try {
      // Post log data to the Delete-Log server, wrapping it in an array
      await axiosPublic.post(`/Delete-Log`, [deleteEventLogData]); // Send as an array
      // Delete event by ID
      await axiosPublic.delete(`/Upcoming-Events/${selectedEventId}`);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Event successfully deleted.",
        confirmButtonText: "Okay",
      });

      reset(); // Reset form
      setShowDeleteModal(false); // Close modal
      setSelectedEventId(null); // Clear selected event ID
      refetch(); // Refetch events after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete event. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Events
      </p>

      {/* Search */}
      <div className="py-5 flex justify-between items-center px-5">
        <div>
          <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
            <input type="text" className="grow" placeholder="Search" />
            <FaSearch />
          </label>
        </div>
      </div>

      {/* Add and Delete selected insights button */}
      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 px-10 py-2 text-white font-bold"
          onClick={() =>
            document.getElementById("Create_New_Events").showModal()
          }
        >
          + Add New Event
        </button>
      </div>

      {/* Event Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Event Title</th>
              <th>Organizer</th>
              <th>Event Type</th>
              <th>Posted Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through fetched events */}
            {UpcomingEventsData.map((event, index) => (
              <tr key={event._id}>
                <td>{index + 1}</td>
                <td>{event?.eventTitle}</td>
                <td>{event?.organizer}</td>
                <td>{event?.eventType}</td>
                <td>{new Date(event.postedDate).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                      onClick={() => handleViewInsights(event)} // Pass event data on view
                    >
                      <CiViewBoard />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                      onClick={() => handleSingleDelete(event._id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View event modal */}
      <dialog id="Modal_Upcoming_Event_View" className="modal">
        <ModalViewEvents eventsData={viewEventsData} />
      </dialog>

      <dialog id="Create_New_Events" className="modal">
        <ModalAddEvents refetch={refetch} />
      </dialog>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Event</h2>
            {selectedEventId && (
              <p className="font-bold">
                Are you sure you want to delete this event?
              </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-2 font-bold">
                  Reason for Deletion:
                </label>
                <textarea
                  {...register("deleteReason", { required: true })}
                  className="textarea textarea-bordered w-full bg-white border-black h-40"
                  placeholder="Enter the reason for deletion"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-400 text-white px-5 py-2"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-400 text-white px-5 py-2"
                >
                  Confirm Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
