/* eslint-disable react/prop-types */
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ModalCompanyProfilesDetails = ({ company, closeModal }) => {
  return (
    <div className="modal-box bg-white text-black max-w-[700px] bg-gradient-to-br from-blue-100 to-blue-50">
      {/* Top */}
      <div className="flex flex-col-reverse md:flex-row justify-between gap-5">
        {/* Content */}
        <div>
          {/* companyName */}
          <p className="font-bold text-2xl">{company.companyName}</p>

          {/* Location */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Location:</span>
            <span className="ml-5"> {company.location}</span>
          </p>

          {/* Industry */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Industry:</span>
            <span className="ml-5"> {company.industry}</span>
          </p>

          {/* Website */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold mr-5">Website:</span>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-5"
            >
              {company.website}
            </a>
          </p>

          {/* Description */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Description:</span>
            <span className="ml-5">{company.description}</span>
          </p>
        </div>
        {/* Company Logo */}
        <div>
          {company.logo && (
            <img
              src={company.logo}
              alt={`${company.companyName} Logo`}
              className="w-full md:w-52 h-full md:h-w-52 object-cover mb-4"
            />
          )}
        </div>
      </div>

      {/* Company Details */}
      <div className=" mt-4">
        <h4 className="font-bold text-lg text-blue-500">Company Details:</h4>

        {/* foundingYear */}
        <p className="text-lg flex flex-col md:flex-row">
          <span className="font-bold w-28">Founding Year:</span>
          <span className="ml-5">{company.companyDetails.foundingYear}</span>
        </p>

        {/* employees */}
        <p className="text-lg flex flex-col md:flex-row">
          <span className="font-bold w-28">Employees:</span>
          <span className="ml-5">{company.companyDetails.employees}</span>
        </p>

        {/* revenue */}
        <p className="text-lg flex flex-col md:flex-row">
          <span className="font-bold w-28">Revenue:</span>
          <span className="ml-5"> {company.companyDetails.revenue}</span>
        </p>

        {/* ceo */}
        <p className="text-lg flex flex-col md:flex-row">
          <span className="font-bold w-28">CEO:</span>
          <span className="ml-5"> {company.companyDetails.ceo}</span>
        </p>
      </div>

      {/* Services Section */}
      <div className="mt-4">
        <h4 className="font-bold text-lg text-blue-500">Services:</h4>
        <ul className="list-disc list-inside">
          {company.companyDetails.services.map((service, index) => (
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
              href={company.companyDetails.socialMedia.LinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl py-1 underline"
            >
              <FaLinkedin />
            </a>
            <a
              href={company.companyDetails.socialMedia.Twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl py-1 underline"
            >
              <FaSquareXTwitter />
            </a>
            <a
              href={company.companyDetails.socialMedia.Facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl py-1 underline"
            >
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="modal-action">
        <Link to={`/CompanyProfiles/${company._id}`}>
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

export default ModalCompanyProfilesDetails;
