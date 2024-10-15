import { CiViewBoard } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { useState } from "react";
import ModalViewEvents from "./ModalViewEvents/ModalViewEvents";
import ModalAddEvents from "./ModalAddEvents/ModalAddEvents";
import Swal from "sweetalert2";

const ManageUpcomingEvents = () => {
  const axiosPublic = useAxiosPublic();
  const [viewEventsData, setViewEventsData] = useState(null); // state to hold event details for modal

  // Fetching UpcomingEventsData
  const {
    data: UpcomingEventsData,
    isLoading: UpcomingEventsDataIsLoading,
    error: UpcomingEventsDataError,
    refetch,
  } = useQuery({
    queryKey: ["UpcomingEventsData"],
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

  // Handle view salary insight
  const handleViewInsights = (event) => {
    setViewEventsData(event); // Set the selected event details
    document.getElementById("Modal_Upcoming_Event_View").showModal(); // Show the modal
  };

  // Handle delete event by ID
  const handleDeleteEvent = async (eventId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axiosPublic.delete(`/Upcoming-Events/${eventId}`);
        Swal.fire("Deleted!", "The event has been deleted.", "success");
        refetch(); // Refetch data to update the list after deletion
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire("Error!", "Failed to delete the event. Try again.", "error");
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Gigs
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

      {/* Add and Delete selected Event button */}
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

      {/* Salary Insight Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Job Title</th>
              <th>Location</th>
              <th>Posted By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {UpcomingEventsData.map((event, index) => (
              <tr key={event._id}>
                <td>{index + 1}</td>
                <td>{event?.eventTitle}</td>
                <td>{event?.location}</td>
                <td>{event?.postedBy}</td>

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
                      onClick={() => handleDeleteEvent(event._id)} // Handle individual deletion
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
    </div>
  );
};

export default ManageUpcomingEvents;
