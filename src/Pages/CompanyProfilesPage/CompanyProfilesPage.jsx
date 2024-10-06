import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { FaSearch, FaLinkedin, FaFacebook } from "react-icons/fa";
import { useState } from "react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const CompanyProfilesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const axiosPublic = useAxiosPublic();

  // Fetching CompanyProfilesData
  const {
    data: CompanyProfilesData,
    isLoading: CompanyProfilesDataIsLoading,
    error: CompanyProfilesDataError,
  } = useQuery({
    queryKey: ["CompanyProfilesData"],
    queryFn: () => axiosPublic.get(`/Company-Profiles`).then((res) => res.data),
  });

  // Loading state
  if (CompanyProfilesDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (CompanyProfilesDataError) {
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

  // Extract unique industries and locations from CompanyProfilesData
  const uniqueIndustries = [
    ...new Set(CompanyProfilesData.map((company) => company.industry)),
  ];
  const uniqueLocations = [
    ...new Set(CompanyProfilesData.map((company) => company.location)),
  ];

  // Search and filter functionality
  const filteredCompanies = CompanyProfilesData.filter((company) => {
    const matchesSearch = company.companyName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry
      ? company.industry === selectedIndustry
      : true;
    const matchesLocation = selectedLocation
      ? company.location === selectedLocation
      : true;
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstJob,
    indexOfLastJob
  );
  const totalCompanies = filteredCompanies.length;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (company) => {
    setSelectedCompany(company);
    const modal = document.getElementById("Company_Profiles_view");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("Company_Profiles_view");
    modal.close();
    setSelectedCompany(null);
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <div className="mx-auto max-w-[1200px] pt-20">
        {/* Search Box and Filters */}
        <div className="flex flex-col md:flex-row  space-x-4 py-3">
          {/* Title */}
          <div className="text-black">
            <p className="text-2xl font-bold ">Our Posted Gigs</p>
            <p>Find New and Profitable Gigs you can work on</p>
          </div>

          {/* Search bar */}
          <label className="input input-bordered flex items-center gap-2 w-[500px] bg-white">
            <input
              type="text"
              className="grow py-2 px-3 focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="h-4 w-4 opacity-70 text-black" />
          </label>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="select select-bordered bg-white px-4 py-2 w-64 text-black"
          >
            <option value="">All Industries</option>
            {uniqueIndustries.map((industry, index) => (
              <option key={index} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="select select-bordered bg-white px-4 py-2 w-64 text-black"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination */}
        <div className="flex justify-end space-x-2 ">
          {[...Array(Math.ceil(totalCompanies / jobsPerPage)).keys()].map(
            (num) => (
              <button
                key={num}
                className={`px-4 py-2 font-semibold text-lg ${
                  currentPage === num + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => paginate(num + 1)}
                aria-label={`Go to page ${num + 1}`}
                disabled={currentPage === num + 1} // Disable current page button
              >
                {num + 1}
              </button>
            )
          )}
        </div>

        {/* Company Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {currentCompanies.map((company, index) => {
            const {
              companyName,
              location,
              industry,
              website,
              logo,
              description,
            } = company;

            return (
              <div
                key={index}
                className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-2xl"
              >
                <div className="card-body">
                  {/* Company Logo */}
                  {logo && (
                    <img
                      src={logo}
                      alt={`${companyName} Logo`}
                      className="w-full h-32 object-cover mb-4"
                    />
                  )}

                  {/* Company Name */}
                  <p className="font-bold text-2xl">{companyName}</p>

                  {/* Location */}
                  <p className="text-gray-500">{location}</p>

                  {/* Industry */}
                  <p className="text-blue-500 font-semibold">
                    Industry: {industry}
                  </p>

                  {/* Website */}
                  {website && (
                    <p className="text-green-500">
                      Website:{" "}
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {website}
                      </a>
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-gray-700">{description}</p>

                  {/* Card Actions */}
                  <div className="card-actions justify-end mt-5">
                    <Link to={`/CompanyProfiles/${company._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                        View Jobs
                      </button>
                    </Link>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                      onClick={() => openModal(company)}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <dialog id="Company_Profiles_view" className="modal">
        {selectedCompany && (
          <div className="modal-box bg-green-50 text-black max-w-[800px]">
            {/* Top */}
            <div className="py-1">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-2xl">
                    {selectedCompany.companyName}
                  </p>
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
              <div className="w-full mt-4">
                <h4 className="font-bold text-lg text-blue-500">
                  Company Details:
                </h4>
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
                  {selectedCompany.companyDetails.services.map(
                    (service, index) => (
                      <li key={index} className="text-lg">
                        {service}
                      </li>
                    )
                  )}
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
        )}
      </dialog>
    </div>
  );
};

export default CompanyProfilesPage;
