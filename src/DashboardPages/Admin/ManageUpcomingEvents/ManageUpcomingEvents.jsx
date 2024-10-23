import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { useContext, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import ModalViewEvents from "./ModalViewEvents/ModalViewEvents";
import { CiViewBoard } from "react-icons/ci";

const ManageEvents = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [viewEventsData, setViewEventsData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Fetching Event Data
  const {
    data: UpcomingEventsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["EventData"],
    queryFn: () => axiosPublic.get(`/Upcoming-Events`).then((res) => res.data),
  });

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
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
    setViewEventsData(event);
    document.getElementById("Modal_Upcoming_Event_View").showModal();
  };

  // Handle single event deletion
  const handleSingleDelete = (event) => {
    setSelectedEvent(event); // Set the selected event for deletion
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
    const deleteEventLogData = {
      DeletedBy: user.email,
      PostedBy: selectedEvent?.postedBy,
      DeletedDate: formattedDateTime,
      Type: "Event",
      deletedContent: selectedEvent?.eventTitle,
      reason: data.deleteReason,
    };

    try {
      await axiosPublic.post(`/Delete-Log`, [deleteEventLogData]);
      await axiosPublic.delete(`/Upcoming-Events/${selectedEvent._id}`);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Event successfully deleted.",
        confirmButtonText: "Okay",
      });

      reset();
      setShowDeleteModal(false);
      setSelectedEvent(null);
      refetch();
    } catch (error) {
      console.error("Error deleting event:", error);
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

      {/* Event Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Event Title</th>
              <th>Location</th>
              <th>Posted Date</th>
              <th>Posted By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through fetched events */}
            {UpcomingEventsData.map((event, index) => {
              const eventDate = new Date(event.date);
              const isExpired = eventDate < currentDate;

              return (
                <tr key={event._id} className={isExpired ? "bg-gray-300" : ""}>
                  <td>{index + 1}</td>
                  <td>{event?.eventTitle}</td>
                  <td>{event?.location}</td>
                  <td>{event?.date}</td>
                  <td>{event?.postedBy}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                        onClick={() => handleViewInsights(event)}
                      >
                        <CiViewBoard />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                        onClick={() => handleSingleDelete(event)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View event modal */}
      <dialog id="Modal_Upcoming_Event_View" className="modal">
        <ModalViewEvents eventsData={viewEventsData} />
      </dialog>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[800px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Event</h2>
            {selectedEvent && (
              <div className="w-[400px]">
                <p className="font-bold">
                  Are you sure you want to delete this event?
                </p>
                <div className="mt-2 border border-gray-200 p-2 hover:bg-gray-200 hover:text-lg">
                  <p className="flex">
                    <span className="font-bold w-44">Event Name: </span>
                    {selectedEvent.eventTitle}
                  </p>
                  <p className="flex">
                    <span className="font-bold w-44">Event Organizer: </span>
                    {selectedEvent.postedBy}
                  </p>
                </div>
              </div>
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
              <div className="flex justify-end gap-2 mt-5">
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
