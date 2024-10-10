import PropTypes from "prop-types";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ModalCompanyProfilesDetails = ({ selectedCompany, closeModal }) => {
  return (
    <div className="modal-box bg-green-50 text-black max-w-[800px]">
      {/* Top */}
      <div className="py-1">
        <div className="flex justify-between">
          <div>
            <p className="font-bold text-2xl">{selectedCompany.companyName}</p>
            <p className="text-lg">
              <span className="font-bold mr-5">Location:</span>
              {selectedCompany.location}
            </p>
            <p className="text-lg">
              <span className="font-bold mr-5">Industry:</span>
              {selectedCompany.industry}
            </p>
            <p className="text-lg">
              <span className="font-bold mr-5">Website:</span>
              <a
                href={selectedCompany.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {selectedCompany.website}
              </a>
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Description:</span>
              {selectedCompany.description}
            </p>
          </div>
          {/* Company Logo */}
          {selectedCompany.logo && (
            <img
              src={selectedCompany.logo}
              alt={`${selectedCompany.companyName} Logo`}
              className="w-52 h-w-52 object-cover mb-4"
            />
          )}
        </div>

        {/* Company Details */}
        <div className="w-1/2 mt-4">
          <h4 className="font-bold text-lg text-blue-500">Company Details:</h4>
          <p className="text-lg grid grid-cols-2">
            <span className="font-bold">Founding Year:</span>
            {selectedCompany.companyDetails.foundingYear}
          </p>
          <p className="text-lg grid grid-cols-2">
            <span className="font-bold">Employees:</span>
            {selectedCompany.companyDetails.employees}
          </p>
          <p className="text-lg grid grid-cols-2">
            <span className="font-bold">Revenue:</span>
            {selectedCompany.companyDetails.revenue}
          </p>
          <p className="text-lg grid grid-cols-2">
            <span className="font-bold">CEO:</span>
            {selectedCompany.companyDetails.ceo}
          </p>
        </div>

        {/* Services Section */}
        <div className="mt-4">
          <h4 className="font-bold text-lg text-blue-500">Services:</h4>
          <ul className="list-disc list-inside">
            {selectedCompany.companyDetails.services.map((service, index) => (
              <li key={index} className="text-lg">
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-between mt-4">
          <div>
            <h4 className="font-bold text-lg mt-4 text-blue-500">
              Social Media:
            </h4>
            <div className="flex gap-5">
              <a
                href={selectedCompany.companyDetails.socialMedia.LinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl py-1 underline"
              >
                <FaLinkedin />
              </a>
              <a
                href={selectedCompany.companyDetails.socialMedia.Twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl py-1 underline"
              >
                <FaSquareXTwitter />
              </a>
              <a
                href={selectedCompany.companyDetails.socialMedia.Facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl py-1 underline"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-action">
        <Link to={`/CompanyProfiles/${selectedCompany._id}`}>
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            View Jobs
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

// Adding prop-types validation
ModalCompanyProfilesDetails.propTypes = {
  selectedCompany: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    industry: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logo: PropTypes.string,
    companyDetails: PropTypes.shape({
      foundingYear: PropTypes.string.isRequired,
      employees: PropTypes.string.isRequired,
      revenue: PropTypes.string.isRequired,
      ceo: PropTypes.string.isRequired,
      services: PropTypes.arrayOf(PropTypes.string).isRequired,
      socialMedia: PropTypes.shape({
        LinkedIn: PropTypes.string.isRequired,
        Twitter: PropTypes.string.isRequired,
        Facebook: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModalCompanyProfilesDetails;
