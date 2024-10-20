import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import EventData from "./EventData/EventData";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useState } from "react";
import ModalNewEvent from "./ModalNewEvent/ModalNewEvent";
import ModalEditEvent from "./ModalEditEvent/ModalEditEvent";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ManageMyEvent = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [editEventData, setEditEventData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Fetch Upcoming Events data
  const {
    data: MyUpcomingEvent,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MyUpcomingEvent"],
    queryFn: () =>
      axiosPublic
        .get(`/Upcoming-Events?postedBy=${user.email}`)
        .then((res) => res.data),
  });

  // Handle loading state
  if (isLoading) return <Loader />;

  // Handle error state
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

  // Check if there are no upcoming events
  if (!MyUpcomingEvent || MyUpcomingEvent.length === 0) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <p className="text-center text-gray-800 font-bold text-2xl mb-4">
              No Event Found
            </p>
            <p className="text-center text-gray-600 mb-4">
              Please create an event profile to manage your event information.
            </p>
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={() =>
                document.getElementById("Create_New_Event").showModal()
              }
            >
              Create Event
            </button>
          </div>
        </div>

        {/* Modal Create a new Event */}
        <dialog id="Create_New_Event" className="modal rounded-none">
          <ModalNewEvent refetch={refetch} />
        </dialog>
      </div>
    );
  }

  const event = MyUpcomingEvent[0]; // Assuming you're using the first event, you might want to loop through or manage differently

  // Handle Edit Event
  const handleEditEvent = (event) => {
    setEditEventData(event); // Set the event profile data for editing
    document.getElementById("Edit_Event_Modal").showModal();
  };

  // Handle Delete Event
  const handleDeleteEvent = (eventId) => {
    setSelectedEventId(eventId); // Set the selected event ID
    setShowDeleteModal(true);
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
    const eventToDelete = MyUpcomingEvent.find(
      (event) => event._id === selectedEventId
    );
    if (!eventToDelete) return; // Early exit if event not found

    const deleteEventLogData = {
      DeletedBy: user.email,
      PostedBy: eventToDelete.postedBy,
      DeletedDate: formattedDateTime,
      Type: "Event",
      deletedContent: eventToDelete.eventTitle,
      reason: data.deleteReason,
    };

    try {
      // Post log data to the Delete-Log server
      await axiosPublic.post(`/Delete-Log`, [deleteEventLogData]);
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
      {/* Top Section */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage My Event
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex justify-between items-center px-5 pt-2">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleEditEvent(event)}
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleDeleteEvent(event._id)} // Pass the event ID
        >
          <MdDelete className="mr-2" />
          Delete
        </button>
      </div>

      {/* EventData */}
      <EventData event={event} />

      {/* Edit Event Modal */}
      <dialog id="Edit_Event_Modal" className="modal">
        <ModalEditEvent EventData={editEventData} refetch={refetch} />
      </dialog>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[800px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Event</h2>
            <p>Are you sure you want to delete this event?</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
                className="textarea textarea-bordered w-full bg-white border-black h-40"
                placeholder="Enter the reason for deletion"
                {...register("deleteReason", { required: true })}
              ></textarea>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-400 px-4 py-2 text-white font-bold mt-4"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 hover:bg-gray-400 px-4 py-2 text-white font-bold mt-4 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMyEvent;
