import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { useState } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { Link } from "react-router-dom";

const Gigs = () => {
  const axiosPublic = useAxiosPublic();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const [selectedGig, setSelectedGig] = useState(null); // State for selected gig
  const [filters, setFilters] = useState({
    gigType: "",
    location: "",
    duration: "",
    clientType: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Fetching PostedGigsData
  const {
    data: PostedGigsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["PostedGigsData"],
    queryFn: () => axiosPublic.get(`/Posted-Gig`).then((res) => res.data),
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

  // Calculate unique filter options
  const uniqueGigTypes = [...new Set(PostedGigsData.map((gig) => gig.gigType))];
  const uniqueLocations = [
    ...new Set(PostedGigsData.map((gig) => gig.location)),
  ];
  const uniqueDurations = [
    ...new Set(PostedGigsData.map((gig) => gig.duration)),
  ];
  const uniqueClientTypes = [
    ...new Set(PostedGigsData.map((gig) => gig.clientType)),
  ];

  // Calculate the total number of gigs and slice based on current page
  const totalGigs = PostedGigsData.length;
  const startIndex = (currentPage - 1) * jobsPerPage;

  // Filter gigs based on selected criteria and search term
  const currentGigs = PostedGigsData.filter((gig) => {
    return (
      (filters.gigType ? gig.gigType === filters.gigType : true) &&
      (filters.location ? gig.location === filters.location : true) &&
      (filters.duration ? gig.duration === filters.duration : true) &&
      (filters.clientType ? gig.clientType === filters.clientType : true) &&
      (searchTerm
        ? gig.gigTitle.toLowerCase().includes(searchTerm.toLowerCase())
        : true) // Search functionality
    );
  }).slice(startIndex, startIndex + jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const calculateDaysAgo = (isoString) => {
    const postedDate = new Date(isoString);
    const today = new Date();
    const timeDiff = today - postedDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff === 0 ? "Today" : `${daysDiff} days ago`;
  };

  const openModal = (gig) => {
    setSelectedGig(gig);
    const modal = document.getElementById("my_modal_1");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_1");
    modal.close();
    setSelectedGig(null);
  };

  // Handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <div className="mx-auto max-w-[1200px] pt-20">
        {/* Filter Dropdowns */}
        <div className="flex space-x-4 py-3">
          {/* Search */}
          <div>
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
          </div>

          <select
            name="gigType"
            className="border border-gray-300 rounded p-2 bg-white text-black"
            onChange={handleFilterChange}
          >
            <option value="">Select Gig Type</option>
            {uniqueGigTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            name="location"
            className="border border-gray-300 rounded p-2 bg-white text-black"
            onChange={handleFilterChange}
          >
            <option value="">Select Location</option>
            {uniqueLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            name="duration"
            className="border border-gray-300 rounded p-2 bg-white text-black"
            onChange={handleFilterChange}
          >
            <option value="">Select Duration</option>
            {uniqueDurations.map((duration, index) => (
              <option key={index} value={duration}>
                {duration}
              </option>
            ))}
          </select>

          <select
            name="clientType"
            className="border border-gray-300 rounded p-2 bg-white text-black"
            onChange={handleFilterChange}
          >
            <option value="">Select Client Type</option>
            {uniqueClientTypes.map((clientType, index) => (
              <option key={index} value={clientType}>
                {clientType}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination */}
        <div className="flex justify-end space-x-2 py-3">
          {[...Array(Math.ceil(totalGigs / jobsPerPage)).keys()].map((num) => (
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
          ))}
        </div>

        {/* Gig Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10 text-black">
          {currentGigs.map((gig, index) => (
            <div
              key={index}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-red-50 hover:shadow-2xl"
            >
              <div className="card-body">
                <p className="font-bold text-2xl">
                  {gig.gigTitle || "Gig Title"}
                </p>
                {gig.gigType && (
                  <p className="text-red-500">Gig Type: {gig.gigType}</p>
                )}
                <p className="text-gray-500">
                  {gig.clientName || "Client/Company Name"}
                </p>
                <p className="text-gray-500">
                  {gig.location || "Location or Remote"}
                </p>
                {gig.paymentRate && (
                  <p className="text-green-500">
                    Payment Rate: {gig.paymentRate}
                  </p>
                )}
                {gig.duration && (
                  <p className="text-blue-500">Duration: {gig.duration}</p>
                )}
                {gig.postedDate && (
                  <p className="text-black">
                    Posted: {calculateDaysAgo(gig.postedDate)}
                  </p>
                )}

                {/* Card Actions */}
                <div className="card-actions justify-end mt-5">
                  <Link to={`/PostedGigsDetails/${gig._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                      Apply Now
                    </button>
                  </Link>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                    onClick={() => openModal(gig)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="my_modal_1" className="modal">
        {selectedGig && (
          <div className="modal-box bg-red-50 text-black max-w-[700px]">
            {/* Top */}
            <div className="py-1">
              <p className="font-bold text-2xl">{selectedGig.gigTitle}</p>
              <p className="text-lg">
                <span className="font-bold mr-5">Client Name:</span>
                {selectedGig.clientName}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Gig Type:</span>
                {selectedGig.gigType}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Location:</span>
                {selectedGig.location}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Payment Rate:</span>
                {selectedGig.paymentRate}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Duration:</span>
                {selectedGig.duration}
              </p>
            </div>

            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Responsibilities:</span>
              {selectedGig.responsibilities}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Required Skills:</span>
              {selectedGig.requiredSkills}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Working Hours:</span>
              {selectedGig.workingHours}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Project Expectations:</span>
              {selectedGig.projectExpectations}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Communication:</span>
              {selectedGig.communication}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Additional Benefits:</span>
              {selectedGig.additionalBenefits}
            </p>
            <div className="flex justify-between items-center mt-5">
              <p>
                <span className="font-bold">Posted:</span>
                {new Date(selectedGig.postedDate).toLocaleDateString()}
              </p>
              <div>
                <h4 className="font-semibold mb-2">Company Rating:</h4>
                <Rating
                  initialRating={selectedGig.rating}
                  emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                  fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                  readonly
                />
              </div>
            </div>
            
            <div className="modal-action">
              <Link to={`/PostedGigsDetails/${selectedGig._id}`}>
                <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                  Apply Now
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

export default Gigs;
