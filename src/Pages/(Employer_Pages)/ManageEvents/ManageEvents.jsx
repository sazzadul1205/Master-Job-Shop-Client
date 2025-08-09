import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa";

// Assets
import EventsBlue from "../../../assets/EmployerLayout/Events/EventsBlue.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Modal
import AddNewEventModal from "./AddNewEventModal/AddNewEventModal";
import EventCard from "../../../Shared/EventCard/EventCard";
import EditEventModal from "./EditEventModal/EditEventModal";

import EventDetailsModal from "../../(Public_Pages)/Home/FeaturedEvents/EventDetailsModal/EventDetailsModal";


const ManageEvents = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [selectedEventData, setSelectedEventData] = useState(null);

  // Events Data
  const {
    data: EventsData,
    isLoading: EventsIsLoading,
    error: EventsError,
    refetch: EventsRefetch,
  } = useQuery({
    queryKey: ["EventsData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Events?postedBy=${user?.email}`);
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") return [data]; // wrap single object in array
      return [];
    },
  });

  // Company Data
  const {
    data: CompanyData,
    isLoading: CompanyIsLoading,
    error: CompanyError,
    refetch: CompanyRefetch,
  } = useQuery({
    queryKey: ["CompanyData"],
    queryFn: () =>
      axiosPublic.get(`/Company?email=${user?.email}`).then((res) => res.data),
  });

  // Company Data Destructuring
  const company = CompanyData || {};

  // Refetching Data
  const refetch = () => {
    EventsRefetch();
    CompanyRefetch();
  };

  // Loading / Error UI
  if (CompanyIsLoading || EventsIsLoading || loading) return <Loading />;
  if (CompanyError || EventsError) return <Error />;

  console.log(EventsData[0]);

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center py-3 px-5 ">
        {/* Title */}
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-4">
          <img src={EventsBlue} alt="Events Blue Icon" className="w-8 h-8" />{" "}
          Manage Events
        </h3>

        {/* Add New Events Button */}
        <button
          onClick={() =>
            document.getElementById("Add_New_Event_Modal").showModal()
          }
          className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
        >
          <FaPlus />
          Add New Internship
        </button>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Event Display */}
      <div className="py-3 px-5">
        {EventsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {EventsData.map((event) => (
              <div key={event._id}>
                <EventCard
                  event={event}
                  poster={true}
                  refetch={refetch}
                  setSelectedEventID={setSelectedEventID}
                  setSelectedEventData={setSelectedEventData}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-black text-2xl font-medium bg-white/10 rounded p-6">
            {/* Title */}
            <h3>No Internship postings available at the moment.</h3>

            {/* Content */}
            <p className="text-lg text-gray-800 mt-2 w-3xl mx-auto">
              You haven’t posted any internships yet. Share a new opportunity to
              attract talented interns eager to learn and contribute to your
              projects.
            </p>

            {/* Add New Internship Button */}
            <div className="flex justify-center pt-5">
              <button
                onClick={() =>
                  document
                    .getElementById("Add_New_Internship_Modal")
                    .showModal()
                }
                className="flex items-center text-lg gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
              >
                <FaPlus />
                Add New Internship
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Event Modals */}
      <dialog id="Add_New_Event_Modal" className="modal">
        <AddNewEventModal CompanyData={company} refetch={refetch} />
      </dialog>

      {/* Edit Event Modals */}
      <dialog id="Edit_Event_Modal" className="modal">
        <EditEventModal
          refetch={refetch}
          selectedEventData={selectedEventData}
        />
      </dialog>

      {/* Event Modal */}
      <dialog id="Event_Details_Modal" className="modal">
        <EventDetailsModal
          selectedEventID={selectedEventID}
          setSelectedEventID={setSelectedEventID}
        />
      </dialog>
    </>
  );
};

export default ManageEvents;
