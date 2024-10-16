import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";

const ModalViewInternship = ({ internshipData }) => {
  return (
    <div className="modal-box bg-white max-w-[1000px] p-0 pb-10">
      {/* Top part */}
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p className="font-bold text-xl">View Internship</p>
        <button
          onClick={() =>
            document.getElementById("Modal_Internship_View").close()
          }
          title="Close"
          aria-label="Close Modal"
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <div className="py-1 px-5">
        {/* Content */}
        <div className="flex flex-wrap justify-between">
          <div className="py-2 w-full md:w-2/3">
            {/* Company Name */}
            <p className="font-bold text-3xl">{internshipData.companyName}</p>

            {/* Position */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Position:</span>
              {internshipData.position}
            </p>

            {/* Duration */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Duration:</span>
              {internshipData.duration}
            </p>

            {/* Location */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Location:</span>
              {internshipData.location}
            </p>

            {/* Stipend */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold pr-3">Stipend:</span>
              {internshipData.stipend}
            </p>

            {/* Application Deadline */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold pr-3">Application Deadline:</span>
              {internshipData.applicationDeadline}
            </p>
          </div>

          {/* Company Logo */}
          {internshipData.companyLogo && (
            <img
              src={internshipData.companyLogo}
              alt={`${internshipData.companyName} Logo`}
              className="w-60 h-60 object-cover mb-4 md:ml-5"
            />
          )}
        </div>

        {/* Skills Required */}
        <section className="py-2">
          <span className="font-bold pr-5 text-xl">Skills Required:</span>
          <ul className="list-disc pl-10">
            {internshipData.skillsRequired.map((skill, index) => (
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
            {internshipData.responsibilities.map((responsibility, index) => (
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
            {internshipData.qualifications.map((qualification, index) => (
              <li key={index} className="text-lg">
                {qualification}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact Information */}
        {internshipData.contact && (
          <section className="py-2">
            <span className="font-bold pr-5 text-xl">Contact:</span>
            <p className="text-lg">Email: {internshipData.contact.email}</p>
            {internshipData.contact.facebook && (
              <p className="text-lg">
                Facebook:{" "}
                <a
                  href={internshipData.contact.facebook}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {internshipData.contact.facebook}
                </a>
              </p>
            )}
            {internshipData.contact.website && (
              <p className="text-lg">
                Website:{" "}
                <a
                  href={internshipData.contact.website}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {internshipData.contact.website}
                </a>
              </p>
            )}
          </section>
        )}

        {/* Mentor Bio */}
        {internshipData.mentorBio && (
          <p className="text-lg py-2 leading-5">
            <span className="font-bold pr-5 text-xl">Mentor Bio:</span>
            {internshipData.mentorBio}
          </p>
        )}

        {/* Description */}
        {internshipData.description && (
          <p className="text-lg">
            <span className="font-bold pr-5 text-xl">Description:</span>
            {internshipData.description}
          </p>
        )}
      </div>

      {/* Applicant Section */}
      {internshipData.applicants?.length > 0 && (
        <div className="py-5">
          <p className="text-xl font-bold">Applicants</p>
          <div className="overflow-x-auto p-2">
            <table className="table border border-black">
              <thead className="bg-gray-500 text-white">
                <tr>
                  <th>No</th>
                  <th>img</th>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Applied Date</th>
                  <th>Details</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {internshipData.applicants.map((applicant, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={applicant.applicantImage}
                        alt=""
                        className="w-12"
                      />
                    </td>
                    <td>{applicant.applicantName}</td>
                    <td>{applicant.applicantEmail}</td>
                    <td>{applicant.aboutApplicant}</td>
                    <td>{applicant.applicantDetails}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for validation
ModalViewInternship.propTypes = {
  internshipData: PropTypes.shape({
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
    description: PropTypes.string,
    applicants: PropTypes.arrayOf(
      PropTypes.shape({
        applicantName: PropTypes.string.isRequired,
        applicantImage: PropTypes.string,
        applicantEmail: PropTypes.string.isRequired,
        aboutApplicant: PropTypes.string,
        applicantDetails: PropTypes.string,
        resumeLink: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default ModalViewInternship;
