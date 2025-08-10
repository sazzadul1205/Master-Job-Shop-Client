// Packages
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

// Icons
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
  FaUserTie,
  FaEye,
  FaCity,
  FaGlobeAmericas,
  FaHome,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";

// Assets
import DefaultUserLogo from "../../../assets/DefaultUserLogo.jpg";

// Modals
import AddEmployerProfileModal from "./AddEmployerProfileModal.jsx/AddEmployerProfileModal";
import EditEmployerProfileModal from "./EditEmployerProfileModal/EditEmployerProfileModal";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

const ManageEmployerProfile = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  const {
    data: employerData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["EmployerData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Employers?email=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  const employer = employerData || {};

  // Loading / Error UI
  if (isLoading || loading) return <Loading />;
  if (error) return <Error />;

  const handleDeleteEmployerProfile = async () => {
    const { value: textInput } = await Swal.fire({
      title: "Delete Profile?",
      text: "This action is irreversible. Type 'Delete My Profile' to confirm.",
      input: "text",
      inputPlaceholder: "Delete My Profile",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (value !== "Delete My Profile") {
          return "You must type 'Delete My Profile' exactly to confirm.";
        }
      },
      reverseButtons: true,
    });

    if (!textInput) return;

    try {
      Swal.showLoading();
      await axiosPublic.delete(`/Employer/${employer._id}`);

      Swal.fire({
        icon: "success",
        title: "Profile Deleted",
        text: "Your employer profile has been deleted.",
        timer: 3000,
        showConfirmButton: false,
      });

      refetch();
      // Optionally, logout or redirect user here
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Failed to delete profile. Try again.",
      });
    }
  };

  // If no profile exists, show placeholder to create
  if (!employerData || Object.keys(employerData).length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl text-center space-y-4 border">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Your Employer Profile
          </h2>
          <p className="text-gray-600 text-sm">
            To post jobs and manage applicants, create your employer profile.
          </p>
          <button
            onClick={() =>
              document.getElementById("Add_Employer_Profile_Modal").showModal()
            }
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
          >
            Create Employer Profile
          </button>
        </div>

        <dialog id="Add_Employer_Profile_Modal" className="modal">
          <AddEmployerProfileModal refetch={refetch} />
        </dialog>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center py-2 px-5">
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <FaUserTie className="text-blue-700" /> Manage My Employer Profile
        </h3>

        <div className="flex items-center gap-5">
          <button
            onClick={() =>
              document.getElementById("View_Employer_Profile_Modal").showModal()
            }
            className="flex items-center gap-2 bg-blue-700 text-white font-semibold rounded shadow-xl px-5 py-2 cursor-pointer hover:bg-blue-800"
          >
            <FaEye />
            View Profile
          </button>

          <button
            onClick={() =>
              document.getElementById("Edit_Employer_Profile_Modal").showModal()
            }
            className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-5 py-2 cursor-pointer hover:bg-blue-700 hover:text-white"
          >
            <MdEdit />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Company Details */}
      <div className="space-y-3 py-3 px-5">
        {/* Company Overview */}
        <div className="bg-white text-black shadow-md rounded-xl p-6 space-y-4">
          {/* Basic Info */}
          <div className="flex items-center gap-4">
            {/* Company Avatar */}
            <img
              src={employer.avatar || employer.logo || DefaultUserLogo}
              alt="Employer Avatar"
              className="w-16 h-16 object-contain rounded-full"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DefaultUserLogo;
              }}
            />

            {/* Name & Tagline */}
            <div>
              {/* Employer Name */}
              <h4 className="text-xl font-semibold">
                {employer.name || "Employer Name"}
              </h4>

              {/* Employer Tagline */}
              <p className="text-sm text-gray-600">
                {employer.industry || "Industry"}
              </p>
            </div>
          </div>

          {/* Employer Overview */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {employer.overview || "Employer Overview"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Contact Information */}
          <div className="bg-white text-black shadow-md rounded-xl p-6 space-y-4 border border-gray-100">
            {/* Title */}
            <h5 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaEnvelope className="text-blue-600" /> Contact Information
            </h5>

            {/* Divider */}
            <hr className="bg-blue-500 p-[1px] w-full" />

            {/* Content */}
            <div className="text-sm text-gray-700 space-y-2">
              {/* Social */}
              <div className="grid grid-cols-2 gap-2">
                {/* Social Info */}
                <div className="space-y-2">
                  {/* Email */}
                  <p className="flex items-center text-base gap-2">
                    <FaEnvelope className="text-blue-500" />
                    <strong>Email: </strong>{" "}
                    {employer.contact?.email || "Not provided"}
                  </p>

                  {/* Phone Number */}
                  <p className="flex items-center text-base gap-2">
                    <FaPhoneAlt className="text-blue-500" />
                    <strong>Phone Number: </strong>{" "}
                    {employer.contact?.phone || "Not provided"}
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  {/* Location */}
                  <p className="flex items-center text-base gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <strong>Location: </strong>{" "}
                    {employer.contact?.location || "Not provided"}
                  </p>

                  {/* City */}
                  <p className="flex items-center text-base gap-2">
                    <FaCity className="text-blue-500" />
                    <strong>City: </strong>{" "}
                    {employer.contact?.city || "Not provided"}
                  </p>

                  {/* Country */}
                  <p className="flex items-center text-base gap-2">
                    <FaGlobeAmericas className="text-blue-500" />
                    <strong>Country: </strong>{" "}
                    {employer.contact?.country || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Address (optional) */}
              {employer.contact?.address && (
                <p className="flex items-center gap-2">
                  <FaHome className="text-blue-500" />
                  <strong>Address: </strong> {employer.contact.address}
                </p>
              )}
            </div>
          </div>

          {/* Online Presence */}
          <div className="bg-white text-black shadow-md rounded-xl p-6 space-y-4 border border-gray-100">
            {/* Title */}
            <h5 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaGlobe className="text-blue-600" /> Online Presence
            </h5>

            {/* Divider */}
            <hr className="bg-blue-500 p-[1px] w-full" />

            {/* Content */}
            <div className="text-sm text-gray-700 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Website URL */}
                <p className="flex items-center text-base col-span-3 gap-2">
                  <FaGlobe className="text-blue-500" />
                  <strong>Website: </strong>
                  {employer.onlinePresence?.website ? (
                    <a
                      href={employer.onlinePresence.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {employer.onlinePresence.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>

                {/* LinkedIn Profile URL */}
                <p className="flex items-center text-base gap-2">
                  <FaLinkedin className="text-blue-500" />
                  <strong>LinkedIn: </strong>
                  {employer.onlinePresence?.linkedin ? (
                    <a
                      href={employer.onlinePresence.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>

                {/* Twitter Profile (optional) */}
                <p className="flex items-center text-base gap-2">
                  <FaTwitter className="text-blue-500" />
                  <strong>Twitter: </strong>
                  {employer.onlinePresence?.twitter ? (
                    <a
                      href={employer.onlinePresence.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Twitter Profile
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>

                {/* Facebook Profile (optional) */}
                <p className="flex items-center text-base gap-2">
                  <FaFacebook className="text-blue-500" />
                  <strong>Facebook: </strong>
                  {employer.onlinePresence?.facebook ? (
                    <a
                      href={employer.onlinePresence.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Facebook Profile
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="text-black bg-white shadow-md rounded-xl p-5">
          <h5 className="font-semibold text-lg mb-2">Tags</h5>
          {employer?.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employer.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 hover:bg-blue-100/70 text-blue-700 hover:text-blue-700/70 text-sm font-medium px-5 py-2 rounded-lg cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No tags available</p>
          )}
        </div>

        <div className="text-black bg-white shadow-md rounded-xl p-5">
          <h4 className="text-red-700 font-semibold mb-3">
            Delete Employer Profile
          </h4>
          <button
            onClick={handleDeleteEmployerProfile}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded shadow-md transition-colors duration-300 cursor-pointer"
          >
            Delete My Employer Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="Edit_Employer_Profile_Modal" className="modal">
        <EditEmployerProfileModal employer={employer} refetch={refetch} />
      </dialog>

      {/* View Modal */}
      <dialog id="View_Employer_Profile_Modal" className="modal">
        {/* <ViewEmployerProfileModal employer={employer} /> */}
      </dialog>
    </>
  );
};

export default ManageEmployerProfile;
