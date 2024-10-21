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
  const [selectedService, setSelectedService] = useState(""); // State for services
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const axiosPublic = useAxiosPublic();

  // Fetching CompanyProfilesData
  const {
    data: CompanyProfilesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CompanyProfilesData"],
    queryFn: () => axiosPublic.get("/Company-Profiles").then((res) => res.data),
  });

  // Loading and Error states
  if (isLoading) return <Loader />;
  if (error) {
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

  // Extract unique industries, locations, and services
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

  // Filtering functionality
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

  // Infinite Scroll logic
  const loadMoreCompanies = () => setCurrentPage((prevPage) => prevPage + 1);
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
      <div className="pt-20">
        {/* Title */}
        <div className="text-black mx-auto max-w-[1200px] text-center lg:text-left ">
          <h1 className="text-2xl font-bold m-0 pt-5">Our Companies</h1>
          <p>Find the company you want to work for and its info</p>
        </div>

        {/* Search Box and Filters */}
        <div className="flex flex-col lg:flex-row max-w-[1200px] text-black mt-2 mx-auto space-y-2 lg:space-y-0">
          {/* Search Bar */}
          <label className="input input-bordered flex items-center w-[300px] md:w-[500px] bg-white mx-auto">
            <input
              type="text"
              className="grow py-2 px-3 focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="h-5 w-5 opacity-70 text-black" />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  mx-auto">
            {/* Industry Filter */}
            <div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="border border-gray-300 p-2 bg-white text-black w-[300px] lg:w-[220px]  h-12"
              >
                <option value="">All Industries</option>
                {uniqueIndustries.map((industry, index) => (
                  <option key={index} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="border border-gray-300 p-2 bg-white text-black w-[300px] lg:w-[220px]  h-12"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="border border-gray-300 p-2 bg-white text-black w-[300px] lg:w-[220px]  h-12"
              >
                <option value="">All Services</option>
                {uniqueServices.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Company Cards Section with Infinite Scroll */}
        <InfiniteScroll
          dataLength={currentCompanies.length}
          next={loadMoreCompanies}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-10 px-3 mx-auto max-w-[1200px]">
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
                  className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-red-50 hover:shadow-2xl"
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
                    <div className="flex justify-end gap-1 lg:gap-3 mt-5">
                      <Link to={`/CompanyProfiles/${company._id}`}>
                        <button className="bg-green-500 hover:bg-green-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white">
                          View Profile
                        </button>
                      </Link>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white"
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
        </InfiniteScroll>
      </div>

      {/* Modal for showing company details */}
      {selectedCompany && (
        <ModalCompanyProfilesDetails
          company={selectedCompany}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default CompanyProfiles;
