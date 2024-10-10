import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalGigDetails from "../Shared/ModalGigDetails/ModalGigDetails";
import InfiniteScroll from "react-infinite-scroll-component";

const Gigs = () => {
  const axiosPublic = useAxiosPublic();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const [selectedGig, setSelectedGig] = useState(null);
  const [filters, setFilters] = useState({
    gigType: "",
    location: "",
    duration: "",
    clientType: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter and paginate gigs
  const filteredGigs = PostedGigsData.filter((gig) => {
    return (
      (filters.gigType ? gig.gigType === filters.gigType : true) &&
      (filters.location ? gig.location === filters.location : true) &&
      (filters.duration ? gig.duration === filters.duration : true) &&
      (filters.clientType ? gig.clientType === filters.clientType : true) &&
      (searchTerm
        ? gig.gigTitle.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
    );
  });

  const hasMore = filteredGigs.length > currentPage * jobsPerPage;

  const loadMoreJobs = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const calculateDaysAgo = (isoString) => {
    const postedDate = new Date(isoString);
    const today = new Date();
    const timeDiff = today - postedDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff === 0 ? "Today" : `${daysDiff} days ago`;
  };

  const openModal = (gig) => {
    setSelectedGig(gig);
    document.getElementById("Modal").showModal();
  };

  const closeModal = () => {
    document.getElementById("Modal").close();
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
      <div className="mx-auto max-w-[1250px] pt-20">
        <div className="text-black">
          <h1 className="text-2xl font-bold m-0 pt-5">Our Posted Gigs</h1>
          <p>Find New and Profitable Gigs you can work on</p>
        </div>

        {/* Filter and Search Section */}
        <div className="flex space-x-4 py-3">
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

          {/* Filter Dropdowns */}
          {[
            { name: "gigType", options: uniqueGigTypes },
            { name: "location", options: uniqueLocations },
            { name: "duration", options: uniqueDurations },
            { name: "clientType", options: uniqueClientTypes },
          ].map(({ name, options }, index) => (
            <select
              key={index}
              name={name}
              className="border border-gray-300 rounded p-2 bg-white text-black"
              onChange={handleFilterChange}
            >
              <option value="">
                Select {name.charAt(0).toUpperCase() + name.slice(1)}
              </option>
              {options.map((value, idx) => (
                <option key={idx} value={value}>
                  {value}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Infinite Scroll for Gigs */}
        <InfiniteScroll
          dataLength={currentPage * jobsPerPage}
          next={loadMoreJobs}
          hasMore={hasMore}
          loader={
            <h4 className="text-2xl text-center font-bold py-5 text-blue-500">
              Loading...
            </h4>
          }
          endMessage={
            <p className="text-2xl text-center font-bold py-5 text-red-500">
              No more jobs to load
            </p>
          }
        >
          <div className="grid grid-cols-3 gap-4 py-10 px-5 text-black">
            {filteredGigs
              .slice(0, currentPage * jobsPerPage)
              .map((gig, index) => (
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
        </InfiniteScroll>

        {/* View Modal */}
        <dialog id="Modal" className="modal">
          {selectedGig && (
            <ModalGigDetails
              selectedGig={selectedGig}
              closeModal={closeModal}
            />
          )}
        </dialog>
      </div>
    </div>
  );
};

export default Gigs;
