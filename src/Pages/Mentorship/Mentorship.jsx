import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { FaSearch, FaStar } from "react-icons/fa";
import { useState } from "react";
import Rating from "react-rating";
import { Link } from "react-router-dom";

const Mentorship = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSessionFormat, setSelectedSessionFormat] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const jobsPerPage = 9;
  const [selectedMentor, setSelectedMentor] = useState(null); // Added state for selected mentor

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

  // Extract unique expertise and formats from mentorshipData
  const uniqueExpertiseAreas = [
    ...new Set(mentorshipData.map((course) => course.expertise)),
  ];
  const uniqueSessionFormats = [
    ...new Set(mentorshipData.map((course) => course.sessionFormat)),
  ];

  // Filter mentorship based on selected sessionFormat, expertise, and searchTerm
  const filteredMentorship = mentorshipData.filter((course) => {
    return (
      (selectedSessionFormat === "" ||
        course.sessionFormat === selectedSessionFormat) &&
      (selectedExpertise === "" || course.expertise === selectedExpertise) &&
      course.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredMentorship.length / jobsPerPage);
  const paginatedMentorship = filteredMentorship.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "sessionFormat") {
      setSelectedSessionFormat(value);
    } else if (name === "expertise") {
      setSelectedExpertise(value);
    }
    setCurrentPage(1); // Reset to first page after filtering
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
      <div className="mx-auto max-w-[1200px] pt-20">
        {/* Top Section */}
        <div className="flex justify-between items-center gap-5 pt-0">
          {/* Title */}
          <div className="text-black">
            <h1 className="text-2xl font-bold m-0 pt-5">Our Mentorship</h1>
            <p>Join our Mentorship to gain more experience</p>
          </div>

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
            className="border border-gray-300 rounded w-[300px] p-2 bg-white text-black"
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
            className="border border-gray-300 rounded w-[300px] p-2 bg-white text-black"
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
        </div>

        {/* Pagination */}
        <div className="flex justify-end space-x-2">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              className={`px-4 py-2 font-semibold text-lg ${
                currentPage === num + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setCurrentPage(num + 1)}
            >
              {num + 1}
            </button>
          ))}
        </div>

        {/* Mentorship Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {paginatedMentorship.map((mentor, index) => (
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
                    onClick={() => openModal(mentor)} // Open modal on button click
                  >
                    Know More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="Mentor_Profiles_view" className="modal">
        {selectedMentor && (
          <div className="modal-box bg-emerald-50 text-black max-w-[800px]">
            {/* Top */}
            <div className="py-1">
              <div className="flex justify-between">
                <div>
                  {/* Name */}
                  <p className="font-bold text-2xl">
                    {selectedMentor.mentorName}
                  </p>

                  {/* Expertise */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Expertise:</span>
                    {selectedMentor.expertise}
                  </p>

                  {/* Duration */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Duration:</span>
                    {selectedMentor.duration}
                  </p>

                  {/* contactEmail */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">ContactEmail:</span>
                    {selectedMentor.contactEmail}
                  </p>

                  {/* price */}
                  <p className="text-lg py-2 leading-5">
                    <span className="font-bold pr-3">price:</span>
                    {selectedMentor.price}
                  </p>
                </div>

                {/* Mentor Image */}
                {selectedMentor.mentorImage && (
                  <img
                    src={selectedMentor.mentorImage}
                    alt={`${selectedMentor.mentorName} Image`}
                    className="w-60 h-60 object-cover mb-4"
                  />
                )}
              </div>

              {/* Bio */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Bio:</span>
                {selectedMentor.mentorBio}
              </p>

              {/* Description */}
              <p className="text-lg">
                <span className="font-bold mr-5">Description:</span>
                {selectedMentor.description}
              </p>

              {/* sessionFormat */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">sessionFormat:</span>
                {selectedMentor.sessionFormat}
              </p>

              <div className="flex justify-between items-center">
                {/* Languages */}
                <p className="text-lg py-2 leading-5">
                  <span className="font-bold pr-3">Languages:</span>
                  <ul className="list-disc list-inside p-1">
                    {selectedMentor.languages.map((language, index) => (
                      <li key={index}>{language}</li>
                    ))}
                  </ul>
                </p>

                <div>
                  <h4 className="font-semibold mb-2">Company Rating:</h4>
                  <Rating
                    initialRating={selectedMentor.rating}
                    emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                    fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                    readonly
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <Link to={`/Mentorship/${selectedMentor._id}`}>
                <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                  Join Now
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

export default Mentorship;
