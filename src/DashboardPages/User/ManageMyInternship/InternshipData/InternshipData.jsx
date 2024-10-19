import { FaRegTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import PropTypes from "prop-types";

const InternshipData = ({ InternshipData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Function to handle applicant deletion with Swal confirmation
  const handleDeleteApplicant = async (applicantEmail) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this applicant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPublic.delete(
            `/Internship/applicants/${InternshipData?._id}`,
            {
              data: { applicantEmail }, // Passing applicantEmail in the body
            }
          );
          if (response.status === 200) {
            Swal.fire("Deleted!", "The applicant has been deleted.", "success");
            refetch(); // Refresh the data after successful deletion
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an error deleting the applicant.",
            "error"
          );
          console.error("Delete applicant error:", error);
        }
      }
    });
  };

  return (
    <div>
      <div className="py-1 px-5">
        {/* Content */}
        <div className="flex flex-wrap justify-between">
          <div className="py-2 w-full md:w-2/3">
            {/* Company Name */}
            <p className="font-bold text-3xl">{InternshipData.companyName}</p>

            {/* Position */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Position:</span>
              {InternshipData.position}
            </p>

            {/* Duration */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Duration:</span>
              {InternshipData.duration}
            </p>

            {/* Location */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Location:</span>
              {InternshipData.location}
            </p>

            {/* Stipend */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold pr-3">Stipend:</span>
              {InternshipData.stipend}
            </p>

            {/* Application Deadline */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold pr-3">Application Deadline:</span>
              {InternshipData.applicationDeadline}
            </p>
          </div>

          {/* Company Logo */}
          {InternshipData.companyLogo && (
            <img
              src={InternshipData.companyLogo}
              alt={`${InternshipData.companyName} Logo`}
              className="w-60 h-60 object-cover mb-4 md:ml-5"
            />
          )}
        </div>

        {/* Skills Required */}
        <section className="py-2">
          <span className="font-bold pr-5 text-xl">Skills Required:</span>
          <ul className="list-disc pl-10">
            {InternshipData.skillsRequired.map((skill, index) => (
              <li key={index} className="text-lg">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {/* Responsibilities */}
        <section className="py-2">
          <span className="font-bold pr-5 text-xl">Responsibilities:</span>
          <ul className="list-disc pl-10">
            {InternshipData.responsibilities.map((responsibility, index) => (
              <li key={index} className="text-lg">
                {responsibility}
              </li>
            ))}
          </ul>
        </section>

        {/* Qualifications */}
        <section className="py-2">
          <span className="font-bold pr-5 text-xl">Qualifications:</span>
          <ul className="list-disc pl-10">
            {InternshipData.qualifications.map((qualification, index) => (
              <li key={index} className="text-lg">
                {qualification}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact Information */}
        {InternshipData.contact && (
          <section className="py-2">
            <span className="font-bold pr-5 text-xl">Contact:</span>
            <p className="text-lg">Email: {InternshipData.contact.email}</p>
            {InternshipData.contact.facebook && (
              <p className="text-lg">
                Facebook:{" "}
                <a
                  href={InternshipData.contact.facebook}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {InternshipData.contact.facebook}
                </a>
              </p>
            )}
            {InternshipData.contact.website && (
              <p className="text-lg">
                Website:{" "}
                <a
                  href={InternshipData.contact.website}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {InternshipData.contact.website}
                </a>
              </p>
            )}
          </section>
        )}

        {/* Mentor Bio */}
        {InternshipData.mentorBio && (
          <p className="text-lg py-2 leading-5">
            <span className="font-bold pr-5 text-xl">Mentor Bio:</span>
            {InternshipData.mentorBio}
          </p>
        )}

        {/* Description */}
        {InternshipData.description && (
          <p className="text-lg">
            <span className="font-bold pr-5 text-xl">Description:</span>
            {InternshipData.description}
          </p>
        )}
      </div>

      {/* Applicants section */}
      <div className="p-5">
        <p className="text-xl font-bold">Applicants</p>
        <div className="overflow-x-auto p-2">
          <table className="table border border-black">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th>No</th>
                <th>img</th>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>About Applicant</th>
                <th>Resume</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {InternshipData.applicants?.length > 0 ? (
                InternshipData.applicants.map((applicant, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={applicant.applicantImage}
                        alt={applicant.applicantName}
                        className="w-16 h-16"
                      />
                    </td>
                    <td>{applicant.applicantName}</td>
                    <td>{applicant.applicantEmail}</td>
                    <td>{applicant.aboutApplicant}</td>
                    <td>
                      <a
                        href={applicant.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Resume
                      </a>
                    </td>
                    <td>
                      <button
                        className="border-2 border-red-500 p-2 hover:bg-red-500 hover:text-white text-lg"
                        onClick={() =>
                          handleDeleteApplicant(applicant.applicantEmail)
                        }
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No applicants have applied yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InternshipData;

// Define PropTypes for InternshipData
InternshipData.propTypes = {
  InternshipData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    stipend: PropTypes.string,
    applicationDeadline: PropTypes.string.isRequired,
    companyLogo: PropTypes.string,
    skillsRequired: PropTypes.arrayOf(PropTypes.string).isRequired,
    responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    qualifications: PropTypes.arrayOf(PropTypes.string).isRequired,
    contact: PropTypes.shape({
      email: PropTypes.string.isRequired,
      facebook: PropTypes.string,
      website: PropTypes.string,
    }),
    mentorBio: PropTypes.string,
    description: PropTypes.string, // Description field
    applicants: PropTypes.arrayOf(
      PropTypes.shape({
        applicantName: PropTypes.string.isRequired,
        applicantEmail: PropTypes.string.isRequired,
        applicantImage: PropTypes.string,
        aboutApplicant: PropTypes.string,
        resumeLink: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};
