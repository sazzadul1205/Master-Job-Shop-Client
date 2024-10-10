import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Internship = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInternship, setSelectedInternship] = useState(null);
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

  // Pagination calculation
  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);

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
      <div className="mx-auto max-w-[1200px] pt-20">
        {/* Title */}
        <div className="text-black pb-5">
          <h1 className="text-2xl font-bold m-0 pt-5">Our Internship</h1>
          <p>Join our Internship to gain more experience</p>
        </div>
        {/* Top Section */}
        <div className="flex justify-between items-center gap-5 pt-0">
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

          {/* Position Dropdown */}
          <select
            name="position"
            className="border border-gray-300 rounded w-[300px] p-2 bg-white text-black"
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

          {/* Location Dropdown */}
          <select
            name="location"
            className="border border-gray-300 rounded w-[300px] p-2 bg-white text-black"
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

          {/* Skills Dropdown */}
          <select
            name="skillsRequired"
            className="border border-gray-300 rounded w-[300px] p-2 bg-white text-black"
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

        {/* Pagination */}
        <div className="flex justify-end space-x-2 mt-5">
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

        {/* Internship Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {filteredInternships
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((internship, index) => (
              <div
                key={index}
                className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl"
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
                    {internship.description || "Internship Program Description"}
                  </p>

                  {/* Card Actions */}
                  <div className="card-actions justify-end mt-5">
                    <Link to={`/Internship/${internship._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                        Apply Now
                      </button>
                    </Link>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                      onClick={() => openModal(internship)}
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="Internship_Programs_view" className="modal">
        {selectedInternship && (
          <div className="modal-box bg-emerald-50 text-black max-w-[800px]">
            {/* Modal Content */}
            <div className="py-1">
              <div className="flex justify-between">
                {/* Internship Details */}
                <div>
                  {/* Company Name */}
                  <p className="font-bold text-2xl">
                    {selectedInternship.companyName}
                  </p>

                  {/* Position */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Position:</span>
                    {selectedInternship.position}
                  </p>

                  {/* Duration */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Duration:</span>
                    {selectedInternship.duration}
                  </p>

                  {/* Location */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Location:</span>
                    {selectedInternship.location}
                  </p>

                  {/* Stipend */}
                  <p className="text-lg py-2 leading-5">
                    <span className="font-bold pr-3">Stipend:</span>
                    {selectedInternship.stipend}
                  </p>

                  {/* Application Deadline */}
                  <p className="text-lg py-2 leading-5">
                    <span className="font-bold pr-3">
                      Application Deadline:
                    </span>
                    {selectedInternship.applicationDeadline}
                  </p>
                </div>

                {/* Company Logo */}
                {selectedInternship.companyLogo && (
                  <img
                    src={selectedInternship.companyLogo}
                    alt={`${selectedInternship.companyName} Image`}
                    className="w-60 h-60 object-cover mb-4"
                  />
                )}
              </div>

              {/* Description */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Description:</span>
                {selectedInternship.description}
              </p>

              {/* Skills Required */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Skills Required:</span>
                {selectedInternship.skillsRequired.join(", ")}
              </p>

              {/* Responsibilities */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Responsibilities:</span>
              </p>
              <ul className="list-disc list-inside">
                {selectedInternship.responsibilities.map(
                  (responsibility, i) => (
                    <li key={i}>{responsibility}</li>
                  )
                )}
              </ul>

              {/* Qualifications */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Qualifications:</span>
              </p>
              <ul className="list-disc list-inside">
                {selectedInternship.qualifications.map((qualification, i) => (
                  <li key={i}>{qualification}</li>
                ))}
              </ul>

              {/* Contact */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Contact:</span>
                <a
                  href={`mailto:${selectedInternship.contact.email}`}
                  className="text-blue-600 underline"
                >
                  {selectedInternship.contact.email}
                </a>
                {selectedInternship.contact.website && (
                  <>
                    {" | "}
                    <a
                      href={selectedInternship.contact.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Website
                    </a>
                  </>
                )}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <Link to={`/Internship/${selectedInternship._id}`}>
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

export default Internship;
