import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalInternship from "../Shared/ModalInternship/ModalInternship";
import InfiniteScroll from "react-infinite-scroll-component";

const Internship = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 9;

  // Fetching InternshipData
  const {
    data: InternshipData,
    isLoading: InternshipDataIsLoading,
    error: InternshipDataError,
  } = useQuery({
    queryKey: ["InternshipData"],
    queryFn: () => axiosPublic.get(`/Internship`).then((res) => res.data),
  });

  // Loading state
  if (InternshipDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (InternshipDataError) {
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

  // Get unique options for filtering
  const uniquePositions = [
    ...new Set(InternshipData.map((internship) => internship.position)),
  ];
  const uniqueLocations = [
    ...new Set(InternshipData.map((internship) => internship.location)),
  ];
  const uniqueSkills = [
    ...new Set(
      InternshipData.flatMap((internship) => internship.skillsRequired)
    ),
  ];

  // Filter internships based on selected filters and search term
  const filteredInternships = InternshipData.filter((internship) => {
    const matchesPosition =
      selectedPosition === "" || internship.position === selectedPosition;
    const matchesLocation =
      selectedLocation === "" || internship.location === selectedLocation;
    const matchesSkill =
      selectedSkill === "" || internship.skillsRequired.includes(selectedSkill);
    const matchesSearchTerm =
      internship.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.position.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesPosition && matchesLocation && matchesSkill && matchesSearchTerm
    );
  });

  // Infinite scroll: Load more jobs
  const loadMoreJobs = () => {
    if (currentPage * itemsPerPage >= filteredInternships.length) {
      setHasMore(false);
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const openModal = (internship) => {
    setSelectedInternship(internship);
    const modal = document.getElementById("Internship_Programs_view");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("Internship_Programs_view");
    modal.close();
    setSelectedInternship(null);
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <div className=" pt-20">
        {/* Title */}
        <div className="text-black mx-auto max-w-[1200px] text-center lg:text-left ">
          <h1 className="text-2xl font-bold m-0 pt-5">Our Internship</h1>
          <p>Join our Internship to gain more experience</p>
        </div>

        {/* Top Section */}
        <div className="flex flex-col lg:flex-row max-w-[1200px] text-black mt-2 mx-auto space-y-2 lg:space-y-0">
          {/* Search */}

          <label className="input input-bordered flex items-center w-[300px] md:w-[500px] bg-white mx-auto">
            <input
              type="text"
              className="grow py-2 px-3 focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="h-4 w-4 opacity-70 text-black" />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  mx-auto">
            {/* Position Dropdown */}
            <div>
              <select
                name="position"
                className="border border-gray-300 rounded w-[300px] p-2 py-3 bg-white"
                onChange={(e) => setSelectedPosition(e.target.value)}
                value={selectedPosition}
              >
                <option value="">Select Position</option>
                {uniquePositions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div>
              <select
                name="location"
                className="border border-gray-300 rounded w-[300px] p-2 py-3 bg-white"
                onChange={(e) => setSelectedLocation(e.target.value)}
                value={selectedLocation}
              >
                <option value="">Select Location</option>
                {uniqueLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Dropdown */}
            <div>
              <select
                name="skillsRequired"
                className="border border-gray-300 rounded w-[300px] p-2 py-3 bg-white"
                onChange={(e) => setSelectedSkill(e.target.value)}
                value={selectedSkill}
              >
                <option value="">Select Skill</option>
                {uniqueSkills.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Infinite Scroll */}
        <InfiniteScroll
          dataLength={currentPage * itemsPerPage}
          next={loadMoreJobs}
          hasMore={hasMore}
          loader={
            <h4 className="text-2xl text-center font-bold py-5 text-blue-500">
              Loading...
            </h4>
          }
          endMessage={<p></p>}
        >
          {/* Internship Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-10 px-3 mx-auto max-w-[1200px]">
            {filteredInternships
              .slice(0, currentPage * itemsPerPage)
              .map((internship, index) => (
                <div
                  key={index}
                  className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-red-50 hover:shadow-2xl"
                >
                  <div className="card-body">
                    {/* Company Logo */}
                    {internship.companyLogo && (
                      <img
                        src={internship.companyLogo}
                        alt={`${internship.companyName} logo`}
                        className="w-full h-48 object-cover mb-4"
                      />
                    )}

                    {/* Company Name */}
                    <p className="font-bold text-2xl">
                      {internship.companyName || "Company Name"}
                    </p>

                    {/* Position */}
                    <p className="text-gray-500">
                      {internship.position || "Internship Position"}
                    </p>

                    {/* Location */}
                    <p className="text-gray-500">
                      Location: {internship.location || "Location"}
                    </p>

                    {/* Duration */}
                    <p className="text-blue-500 font-semibold">
                      Duration: {internship.duration || "8 weeks"}
                    </p>

                    {/* Description */}
                    <p className="text-black">
                      {internship.description ||
                        "Internship Program Description"}
                    </p>

                    {/* Card Actions */}
                    <div className="flex justify-end gap-1 lg:gap-3 mt-5">
                      <Link to={`/Internship/${internship._id}`}>
                        <button className="bg-green-500 hover:bg-green-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white">
                          Apply Now
                        </button>
                      </Link>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white"
                        onClick={() => openModal(internship)}
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </InfiniteScroll>
      </div>

      {/* Internship Programs Modal */}

      <dialog id="Internship_Programs_view" className="modal">
        <ModalInternship
          selectedInternship={selectedInternship}
          closeModal={closeModal}
        />
      </dialog>
    </div>
  );
};

export default Internship;
