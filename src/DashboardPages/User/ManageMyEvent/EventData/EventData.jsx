import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const EventData = ({ event }) => {
  const axiosPublic = useAxiosPublic();
  const [participants, setParticipants] = useState(
    event.ParticipantApplications || []
  );

  // Update the participant's state to 'Approved'
  const handleUpdate = async (index) => {
    const participantToUpdate = participants[index];

    // Update the participant's state to 'Approved' in local state
    const newParticipants = [...participants];
    newParticipants[index].applicantState = "Approved";
    setParticipants(newParticipants);

    // API call to update the participant's state to 'Approved' using applicantEmail
    try {
      await axiosPublic.put(
        `/Upcoming-Events/${event._id}/participants/${participantToUpdate.applicantEmail}`,
        { applicantState: "Approved" }
      );

      // Show success alert
      Swal.fire({
        title: "Updated!",
        text: "Participant has been approved.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating participant:", error);
      Swal.fire({
        title: "Error!",
        text: "Could not update participant.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Delete the participant
  const handleDelete = async (index) => {
    const applicantToDelete = participants[index];

    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${applicantToDelete.applicantName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      // Remove the participant from the local state
      const newParticipants = participants.filter((_, i) => i !== index);
      setParticipants(newParticipants);

      // API call to delete the participant using applicantEmail
      try {
        await axiosPublic.delete(
          `/Upcoming-Events/${event._id}/participants/${applicantToDelete.applicantEmail}`
        );

        // Show success alert
        Swal.fire({
          title: "Deleted!",
          text: "Participant has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error deleting participant:", error);
        Swal.fire({
          title: "Error!",
          text: "Could not delete participant.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div>
      <div className="p-5">
        <h2 className="text-3xl font-bold text-black">{event?.eventTitle}</h2>
        <div className="mt-2">
          {/* Date */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Date:</p>{" "}
            <span>{event?.date}</span>
          </div>
          {/* Time */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Time:</p>{" "}
            <span>{event?.time}</span>
          </div>
          {/* Location */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Location:</p>{" "}
            <span>{event?.location}</span>
          </div>
          {/* Description */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Description:</p>{" "}
            <span>{event?.description}</span>
          </div>
          {/* Organizer */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Organizer:</p>{" "}
            <span>{event?.organizer}</span>
          </div>
          {/* Contact Email */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Contact Email:</p>{" "}
            <span>{event?.contactEmail}</span>
          </div>
          {/* Participation Fee */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Participation Fee:</p>{" "}
            <span>{event?.participationFee}</span>
          </div>
          {/* Participation Limit */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Participation Limit:</p>{" "}
            <span>{event?.participationLimit}</span>
          </div>
          {/* Participation Criteria */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Participation Criteria:</p>
            <span>{event?.participationCriteria}</span>
          </div>
          {/* Required Resources */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Required Resources:</p>
            <span>{event?.requiredResources?.join(", ")}</span>
          </div>
          {/* Registration Link */}
          <div className="text-lg flex py-1">
            <p className="font-bold w-[200px]">Registration Link:</p>
            <span>
              <a
                href={event?.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {event?.registrationLink}
              </a>
            </span>
          </div>
        </div>
      </div>
      {/* Participant Applications */}
      <div className="overflow-x-auto p-5">
        <h3 className="text-2xl font-bold mb-3">Participant Applications</h3>
        <table className="table border border-black w-full">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th className="w-1/5">Applicant Name</th>
              <th className="w-1/5">Email</th>
              <th>Description</th>
              <th>State</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((application, index) => (
              <tr key={application.applicantEmail}>
                <td>
                  <div className="border border-black">
                    <img
                      src={application.applicantImage}
                      alt="Applicant"
                      className="w-16 h-16 "
                    />
                  </div>
                </td>
                <td>{application.applicantName}</td>
                <td>{application.applicantEmail}</td>
                <td>{application.applicantDescription}</td>
                <td>{application.applicantState}</td>
                <td>{application.applicantDate}</td>
                <td>
                  <div className="space-y-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white text-lg w-20"
                      onClick={() => handleUpdate(index)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white text-lg w-20"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Define PropTypes for the EventData component
EventData.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    eventTitle: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    organizer: PropTypes.string.isRequired,
    contactEmail: PropTypes.string.isRequired,
    participationFee: PropTypes.string.isRequired,
    participationLimit: PropTypes.number.isRequired,
    participationCriteria: PropTypes.string.isRequired,
    requiredResources: PropTypes.arrayOf(PropTypes.string),
    registrationLink: PropTypes.string.isRequired,
    ParticipantApplications: PropTypes.arrayOf(
      PropTypes.shape({
        applicantName: PropTypes.string.isRequired,
        applicantEmail: PropTypes.string.isRequired,
        applicantImage: PropTypes.string.isRequired,
        applicantDescription: PropTypes.string.isRequired,
        applicantState: PropTypes.string.isRequired,
        applicantDate: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default EventData;
