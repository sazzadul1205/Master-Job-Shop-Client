import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";

const ModalViewEvents = ({ eventsData }) => {
  return (
    <div className="modal-box bg-white max-w-[1000px] p-0 pb-10">
      {/* Top part */}
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p className="font-bold text-xl">View Upcoming Event</p>
        <button
          onClick={() =>
            document.getElementById("Modal_Upcoming_Event_View").close()
          }
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h2 className="text-3xl font-bold text-black">
          {eventsData?.eventTitle}
        </h2>
        <div className="mt-2">
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Date:</p> <span>{eventsData?.date}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Time:</p> <span>{eventsData?.time}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Location:</p> <span>{eventsData?.location}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Description:</p> <span>{eventsData?.description}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Organizer:</p> <span>{eventsData?.organizer}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Participation Criteria:</p>{" "}
            <span>{eventsData?.participationCriteria}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Required Resources:</p>{" "}
            <span>{eventsData?.requiredResources?.join(", ")}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Contact Email:</p> <span>{eventsData?.contactEmail}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Participation Fee:</p>{" "}
            <span>{eventsData?.participationFee}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Participation Limit:</p>{" "}
            <span>{eventsData?.participationLimit}</span>
          </p>
          <p className="text-xl grid grid-cols-2 py-2">
            <p>Registration Link:</p>{" "}
            <span>
              <a
                href={eventsData?.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {eventsData?.registrationLink}
              </a>
            </span>
          </p>
        </div>
      </div>

      {/* Participant Applications */}
      <div className="overflow-x-auto p-5">
        <h3 className="text-2xl font-bold mb-3">Participant Applications</h3>
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Description</th>
              <th>State</th>
              <th>Date</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {eventsData?.ParticipantApplications?.map((application, index) => (
              <tr key={application._id}>
                <td>{index + 1}</td>
                <td>{application.applicantName}</td>
                <td>{application.applicantEmail}</td>
                <td>{application.applicantDescription}</td>
                <td>{application.applicantState}</td>
                <td>{application.applicantDate}</td>
                <td>
                  <img
                    src={application.applicantImage}
                    alt="Applicant"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Prop types validation
ModalViewEvents.propTypes = {
  eventsData: PropTypes.shape({
    eventTitle: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    organizer: PropTypes.string,
    participationCriteria: PropTypes.string,
    requiredResources: PropTypes.arrayOf(PropTypes.string),
    contactEmail: PropTypes.string,
    participationFee: PropTypes.string,
    participationLimit: PropTypes.number,
    registrationLink: PropTypes.string,
    ParticipantApplications: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        applicantName: PropTypes.string,
        applicantEmail: PropTypes.string,
        applicantDescription: PropTypes.string,
        applicantState: PropTypes.string,
        applicantDate: PropTypes.string,
        applicantImage: PropTypes.string,
      })
    ),
  }),
};

export default ModalViewEvents;
