import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ModalInternship = ({ selectedInternship, closeModal }) => {
  return (
    <div className="modal-box bg-emerald-50 text-black max-w-[800px]">
      {/* Modal Content */}
      <div className="py-1">
        <div className="flex justify-between">
          {/* Internship Details */}
          <div>
            {/* Company Name */}
            <p className="font-bold text-2xl">
              {selectedInternship?.companyName}
            </p>

            {/* Position */}
            <p className="text-lg">
              <span className="font-bold mr-5">Position:</span>
              {selectedInternship?.position}
            </p>

            {/* Duration */}
            <p className="text-lg">
              <span className="font-bold mr-5">Duration:</span>
              {selectedInternship?.duration}
            </p>

            {/* Location */}
            <p className="text-lg">
              <span className="font-bold mr-5">Location:</span>
              {selectedInternship?.location}
            </p>

            {/* Stipend */}
            <p className="text-lg py-2 leading-5">
              <span className="font-bold pr-3">Stipend:</span>
              {selectedInternship?.stipend}
            </p>

            {/* Application Deadline */}
            <p className="text-lg py-2 leading-5">
              <span className="font-bold pr-3">Application Deadline:</span>
              {selectedInternship?.applicationDeadline}
            </p>
          </div>

          {/* Company Logo */}
          {selectedInternship?.companyLogo && (
            <img
              src={selectedInternship?.companyLogo}
              alt={`${selectedInternship?.companyName} Image`}
              className="w-60 h-60 object-cover mb-4"
            />
          )}
        </div>

        {/* Description */}
        <p className="text-lg py-2 leading-5">
          <span className="font-bold pr-3">Description:</span>
          {selectedInternship?.description}
        </p>

        {/* Skills Required */}
        <p className="text-lg py-2 leading-5">
          <span className="font-bold pr-3">Skills Required:</span>
          {selectedInternship?.skillsRequired.join(", ")}
        </p>

        {/* Responsibilities */}
        <p className="text-lg py-2 leading-5">
          <span className="font-bold pr-3">Responsibilities:</span>
        </p>
        <ul className="list-disc list-inside">
          {selectedInternship?.responsibilities.map((responsibility, i) => (
            <li key={i}>{responsibility}</li>
          ))}
        </ul>

        {/* Qualifications */}
        <p className="text-lg py-2 leading-5">
          <span className="font-bold pr-3">Qualifications:</span>
        </p>
        <ul className="list-disc list-inside">
          {selectedInternship?.qualifications.map((qualification, i) => (
            <li key={i}>{qualification}</li>
          ))}
        </ul>

        {/* Contact */}
        <p className="text-lg py-2 leading-5">
          <span className="font-bold pr-3">Contact:</span>
          <a
            href={`mailto:${selectedInternship?.contact.email}`}
            className="text-blue-600 underline"
          >
            {selectedInternship?.contact.email}
          </a>
          {selectedInternship?.contact.website && (
            <>
              {" | "}
              <a
                href={selectedInternship?.contact.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Website
              </a>
            </>
          )}
        </p>
      </div>

      {/* Modal Actions */}
      <div className="modal-action">
        <Link to={`/Internship/${selectedInternship?._id}`}>
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Join Now
          </button>
        </Link>
        <button
          className="bg-red-500 hover:bg-red-600 px-5 py-2 text-lg font-semibold text-white"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Define prop types for selectedInternship and closeModal
ModalInternship.propTypes = {
  selectedInternship: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    stipend: PropTypes.string,
    applicationDeadline: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    skillsRequired: PropTypes.arrayOf(PropTypes.string).isRequired,
    responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    qualifications: PropTypes.arrayOf(PropTypes.string).isRequired,
    contact: PropTypes.shape({
      email: PropTypes.string.isRequired,
      website: PropTypes.string,
    }).isRequired,
    companyLogo: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModalInternship;
