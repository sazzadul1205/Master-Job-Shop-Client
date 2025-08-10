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
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";

// Assets
import DefaultUserLogo from "../../../assets/DefaultUserLogo.jpg";

// Modals (You'll implement these separately)
// import EditEmployerProfileModal from "./EditEmployerProfileModal/EditEmployerProfileModal";
// import AddEmployerProfileModal from "./AddEmployerProfileModal/AddEmployerProfileModal";
// import ViewEmployerProfileModal from "./ViewEmployerProfileModal/ViewEmployerProfileModal";

// Shared UI
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
      axiosPublic.get(`/Employer?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  if (isLoading || loading) return <Loading />;
  if (error) return <Error />;

  const employer = employerData || {};

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
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
          >
            Create Employer Profile
          </button>
        </div>

        <dialog id="Add_Employer_Profile_Modal" className="modal">
          {/* <AddEmployerProfileModal refetch={refetch} /> */}
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

      {/* Employer Overview */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <img
            src={employer.avatar || DefaultUserLogo}
            alt="Employer Avatar"
            className="w-20 h-20 object-cover rounded-full border border-gray-300"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DefaultUserLogo;
            }}
          />
          <div>
            <h4 className="text-2xl font-semibold">
              {employer.name || "Your Name"}
            </h4>
            <p className="text-gray-600 text-lg">
              {employer.role || "Your Role"}
            </p>
          </div>
        </div>

        <p className="text-gray-700 text-base">
          {employer.bio ||
            "Tell us about yourself or your recruiting philosophy."}
        </p>

        {/* Contact Info & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-gray-50 p-5 rounded shadow-sm space-y-3">
            <h5 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <FaEnvelope className="text-blue-600" /> Contact Information
            </h5>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-blue-500" />{" "}
              {employer.contact?.email || "No email provided"}
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-500" />{" "}
              {employer.contact?.phone || "No phone provided"}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded shadow-sm space-y-3">
            <h5 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" /> Location
            </h5>
            <p>
              {employer.location?.city || "City"},{" "}
              {employer.location?.country || "Country"}
            </p>
          </div>
        </div>

        {/* Online Presence */}
        <div className="bg-gray-50 p-5 rounded shadow-sm mt-6 max-w-xl">
          <h5 className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-3">
            <FaGlobe className="text-blue-600" /> Online Presence
          </h5>
          <p className="flex items-center gap-2">
            <FaGlobe className="text-blue-500" />
            {employer.website ? (
              <a
                href={employer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {employer.website}
              </a>
            ) : (
              <span className="italic text-gray-500">No website provided</span>
            )}
          </p>

          <p className="flex items-center gap-2 mt-2">
            <FaLinkedin className="text-blue-500" />
            {employer.socialLinks?.linkedin ? (
              <a
                href={employer.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn Profile
              </a>
            ) : (
              <span className="italic text-gray-500">No LinkedIn provided</span>
            )}
          </p>
        </div>

        {/* Delete Profile */}
        <div className="mt-8 bg-red-50 p-5 rounded shadow-sm max-w-xl mx-auto">
          <h4 className="text-red-700 font-semibold mb-3">
            Delete Employer Profile
          </h4>
          <button
            onClick={handleDeleteEmployerProfile}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded shadow-md transition-colors cursor-pointer"
          >
            Delete My Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="Edit_Employer_Profile_Modal" className="modal">
        {/* <EditEmployerProfileModal employer={employer} refetch={refetch} /> */}
      </dialog>

      {/* View Modal */}
      <dialog id="View_Employer_Profile_Modal" className="modal">
        {/* <ViewEmployerProfileModal employer={employer} /> */}
      </dialog>
    </>
  );
};

export default ManageEmployerProfile;
