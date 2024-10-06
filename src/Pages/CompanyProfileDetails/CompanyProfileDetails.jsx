import { useQuery } from "@tanstack/react-query";
import Loader from "../Shared/Loader/Loader";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const CompanyProfileDetails = () => {
  const { id } = useParams(); // Get the company profile ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate for back navigation
  const axiosPublic = useAxiosPublic();

  // Fetching company profile details by ID
  const {
    data: companyProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CompanyProfileDetailsData", id],
    queryFn: () =>
      axiosPublic.get(`/Company-Profiles/${id}`).then((res) => res.data), // Fetch company profile by ID
  });

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong:{" "}
          {error.response?.data?.message || "Please reload the page."}
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

  // Render company profile details
  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto text-black pt-24">
        {/* Back button with navigation */}
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          <FaArrowLeft className="mr-5" />
          Back
        </button>

        {/* Company Profile Details */}
        <div className="py-5">
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {companyProfile.companyName}
              </h1>
              <p className="text-lg mb-2">
                <strong>Industry:</strong> {companyProfile.industry}
              </p>
              <p className="text-lg mb-2">
                <strong>Location:</strong> {companyProfile.location}
              </p>
              <p className="text-lg mb-2">
                <strong>Website:</strong>{" "}
                <a
                  href={companyProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {companyProfile.website}
                </a>
              </p>
              <p className=" mb-4">
                <strong>Description:</strong> {companyProfile.description}
              </p>
            </div>
            <img
              src={companyProfile.logo}
              alt={`${companyProfile.companyName} Logo`}
              className="w-80 h-52 mb-4 "
            />
          </div>

          {/* Company Details */}
          <h2 className="text-2xl font-semibold mb-2">Company Details</h2>
          <p className="text-gray-600 mb-2">
            <strong>Founding Year:</strong>{" "}
            {companyProfile.companyDetails.foundingYear}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Employees:</strong>{" "}
            {companyProfile.companyDetails.employees}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Revenue:</strong> {companyProfile.companyDetails.revenue}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>CEO:</strong> {companyProfile.companyDetails.ceo}
          </p>

          {/* Services Offered */}
          <h3 className="text-xl font-semibold mt-4">Services Offered</h3>
          <ul className="list-disc list-inside">
            {companyProfile.companyDetails.services.map((service, index) => (
              <li key={index} className="text-gray-600">
                {service}
              </li>
            ))}
          </ul>

          {/* Clients */}
          <h3 className="text-xl font-semibold mt-4">Clients</h3>
          <ul className="list-disc list-inside">
            {companyProfile.companyDetails.clients.map((client, index) => (
              <li key={index} className="text-gray-600">
                {client}
              </li>
            ))}
          </ul>

          {/* Key Projects */}
          <h3 className="text-xl font-semibold mt-4">Key Projects</h3>
          <ul className="list-disc list-inside">
            {companyProfile.companyDetails.keyProjects.map((project, index) => (
              <li key={index} className="text-gray-600">
                <strong>{project.projectName}:</strong> {project.description} (
                {project.year})
              </li>
            ))}
          </ul>

          {/* Awards */}
          <h3 className="text-xl font-semibold mt-4">Awards</h3>
          <ul className="list-disc list-inside">
            {companyProfile.companyDetails.awards.map((award, index) => (
              <li key={index} className="text-gray-600">
                <strong>{award.awardName}</strong> ({award.year}) -{" "}
                {award.organization}
              </li>
            ))}
          </ul>

          {/* Office Locations */}
          <h3 className="text-xl font-semibold mt-4">Office Locations</h3>
          <ul className="list-disc list-inside">
            {companyProfile.companyDetails.officeLocations.map(
              (location, index) => (
                <li key={index} className="text-gray-600">
                  {location}
                </li>
              )
            )}
          </ul>

          {/* Partnerships */}
          <h3 className="text-xl font-semibold mt-4">Partnerships</h3>
          <ul className="list-disc list-inside">
            {companyProfile.companyDetails.partnerships.map(
              (partnership, index) => (
                <li key={index} className="text-gray-600">
                  <strong>{partnership.partnerName}</strong> (since{" "}
                  {partnership.since}) - {partnership.description}
                </li>
              )
            )}
          </ul>

          {/* Social Media Links */}
          <h3 className="text-xl font-semibold mt-4">Social Media</h3>
          <ul className="list-disc list-inside">
            {Object.entries(companyProfile.companyDetails.socialMedia).map(
              ([platform, link], index) => (
                <li key={index} className="text-gray-600">
                  <strong>{platform}:</strong>{" "}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {link}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileDetails;
