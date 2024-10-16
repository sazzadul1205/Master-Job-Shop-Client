import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import ModalMentorShip from "../Shared/ModalMentorShip/ModalMentorShip";
import InfiniteScroll from "react-infinite-scroll-component"; // Import InfiniteScroll

const Mentorship = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSessionFormat, setSelectedSessionFormat] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(""); // Added state for duration filter
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const [hasMore, setHasMore] = useState(true);

  // Fetching MentorshipData
  const {
    data: mentorshipData,
    isLoading: mentorshipDataIsLoading,
    error: mentorshipDataError,
  } = useQuery({
    queryKey: ["MentorshipData"],
    queryFn: () => axiosPublic.get(`/Mentorship`).then((res) => res.data),
  });

  // Loading state
  if (mentorshipDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (mentorshipDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please try again later.
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

  // Extract unique expertise, formats, and durations from mentorshipData
  const uniqueExpertiseAreas = [
    ...new Set(mentorshipData.map((course) => course.expertise)),
  ];
  const uniqueSessionFormats = [
    ...new Set(mentorshipData.map((course) => course.sessionFormat)),
  ];
  const uniqueDurations = [
    ...new Set(mentorshipData.map((course) => course.duration)),
  ];

  // Filter mentorship based on selected filters and search term
  const filteredMentorship = mentorshipData.filter((course) => {
    return (
      (selectedSessionFormat === "" ||
        course.sessionFormat === selectedSessionFormat) &&
      (selectedExpertise === "" || course.expertise === selectedExpertise) &&
      (selectedDuration === "" || course.duration === selectedDuration) &&
      course.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Load more jobs for infinite scroll
  const loadMoreJobs = () => {
    if (currentPage * jobsPerPage >= filteredMentorship.length) {
      setHasMore(false);
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "sessionFormat") {
      setSelectedSessionFormat(value);
    } else if (name === "expertise") {
      setSelectedExpertise(value);
    } else if (name === "duration") {
      setSelectedDuration(value);
    }
    setCurrentPage(1); // Reset to first page after filtering
    setHasMore(true); // Reset infinite scroll
  };

  const openModal = (mentor) => {
    setSelectedMentor(mentor);
    const modal = document.getElementById("Mentor_Profiles_view");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("Mentor_Profiles_view");
    modal.close();
    setSelectedMentor(null);
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <div className=" pt-20">
        {/* Title */}
        <div className="text-black mx-auto max-w-[1200px]">
          <h1 className="text-2xl font-bold m-0 pt-5">Our Mentorship</h1>
          <p>Join our Mentorship to gain more experience</p>
        </div>

        {/* Top Section */}
        <div className="flex space-x-2 items-center pt-5 mx-auto max-w-[1200px] text-black">
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

          {/* Session Format Dropdown */}
          <select
            name="sessionFormat"
            className="border border-gray-300 rounded w-[400px] p-2 py-3 bg-white"
            onChange={handleFilterChange}
            value={selectedSessionFormat}
          >
            <option value="">Select Session Format</option>
            {uniqueSessionFormats.map((format, index) => (
              <option key={index} value={format}>
                {format}
              </option>
            ))}
          </select>

          {/* Expertise Dropdown */}
          <select
            name="expertise"
            className="border border-gray-300 rounded w-[400px] p-2 py-3 bg-white"
            onChange={handleFilterChange}
            value={selectedExpertise}
          >
            <option value="">Select Expertise</option>
            {uniqueExpertiseAreas.map((expertise, index) => (
              <option key={index} value={expertise}>
                {expertise}
              </option>
            ))}
          </select>

          {/* Duration Dropdown */}
          <select
            name="duration"
            className="border border-gray-300 rounded w-[400px] p-2 py-3 bg-white"
            onChange={handleFilterChange}
            value={selectedDuration}
          >
            <option value="">Select Duration</option>
            {uniqueDurations.map((duration, index) => (
              <option key={index} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>

        {/* Mentorship Cards Section with Infinite Scroll */}
        <InfiniteScroll
          dataLength={currentPage * jobsPerPage} // Length of currently displayed mentorships
          next={loadMoreJobs} // Function to load more data
          hasMore={hasMore} // Whether there's more data to load
          loader={
            <h4 className="text-2xl text-center font-bold py-5 text-blue-500">
              Loading...
            </h4>
          }
          endMessage={
            <p className="text-2xl text-center font-bold py-5 text-red-500">
              No more mentorships
            </p>
          }
        >
          <div className="grid grid-cols-3 gap-4 py-10 mx-auto max-w-[1200px]">
            {filteredMentorship
              .slice(0, currentPage * jobsPerPage)
              .map((mentor, index) => (
                <div
                  key={index}
                  className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-2xl"
                >
                  <div className="card-body">
                    {/* Mentor Image */}
                    {mentor.mentorImage && (
                      <img
                        src={mentor.mentorImage}
                        alt={`${mentor.mentorName} mentorImage`}
                        className="w-full h-48 object-cover mb-4"
                      />
                    )}

                    {/* Mentor Name */}
                    <p className="font-bold text-2xl">
                      {mentor.mentorName || "Mentor Name"}
                    </p>

                    {/* Expertise */}
                    <p className="text-gray-500">
                      {mentor.expertise || "Expertise Area"}
                    </p>

                    {/* Duration */}
                    <p className="text-blue-500 font-semibold">
                      Duration: {mentor.duration || "6 weeks"}
                    </p>

                    {/* Description */}
                    <p className="text-black">
                      {mentor.description || "Mentorship Program Description"}
                    </p>

                    {/* Card Actions */}
                    <div className="card-actions justify-end mt-5">
                      <Link to={`/Mentorship/${mentor._id}`}>
                        <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                          Join Now
                        </button>
                      </Link>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                        onClick={() => openModal(mentor)}
                      >
                        Know More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </InfiniteScroll>

        {/* Modal for Mentor Info */}
        <dialog id="Mentor_Profiles_view" className="modal">
          {selectedMentor && (
            <ModalMentorShip
              selectedMentor={selectedMentor}
              closeModal={closeModal}
            />
          )}
        </dialog>
      </div>
    </div>
  );
};

export default Mentorship;
