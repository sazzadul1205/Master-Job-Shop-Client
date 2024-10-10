import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import ModalCompanyProfilesDetails from "../Shared/ModalCompanyProfilesDetails/ModalCompanyProfilesDetails";
import InfiniteScroll from "react-infinite-scroll-component";

const CompanyProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState(""); // New state for services
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

  // Extract unique industries, locations, and services from CompanyProfilesData
  const uniqueIndustries = [
    ...new Set(CompanyProfilesData.map((company) => company.industry)),
  ];
  const uniqueLocations = [
    ...new Set(CompanyProfilesData.map((company) => company.location)),
  ];

  const uniqueServices = [
    ...new Set(
      CompanyProfilesData.flatMap(
        (company) => company.companyDetails?.services || []
      )
    ),
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
    const matchesService = selectedService
      ? company.companyDetails?.services?.includes(selectedService)
      : true;
    return (
      matchesSearch && matchesIndustry && matchesLocation && matchesService
    );
  });

  // Infinite scroll logic
  const loadMoreJobs = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const hasMore = currentPage * jobsPerPage < filteredCompanies.length;
  const currentCompanies = filteredCompanies.slice(
    0,
    currentPage * jobsPerPage
  );

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
        {/* Title */}
        <div className="text-black pt-4">
          <p className="text-2xl font-bold ">Our Companies</p>
          <p>Find The company you want to work for and its info</p>
        </div>

        {/* Search Box and Filters */}
        <div className="flex flex-col md:flex-row  space-x-4 py-3">
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

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="select select-bordered bg-white px-4 py-2 w-64 text-black"
          >
            <option value="">All Services</option>
            {uniqueServices.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        {/* Company Cards Section with Infinite Scroll */}
        <InfiniteScroll
          dataLength={currentCompanies.length}
          next={loadMoreJobs}
          hasMore={hasMore}
          loader={
            <h4 className="text-2xl text-center font-bold py-5 text-blue-500">
              Loading...
            </h4>
          }
          endMessage={
            <p className="text-2xl text-center font-bold py-5 text-red-500">
              No more companies to load
            </p>
          }
        >
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
                        More Info
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </InfiniteScroll>

        {/* Modal */}
        {selectedCompany && (
          <ModalCompanyProfilesDetails
            closeModal={closeModal}
            company={selectedCompany}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyProfiles;
