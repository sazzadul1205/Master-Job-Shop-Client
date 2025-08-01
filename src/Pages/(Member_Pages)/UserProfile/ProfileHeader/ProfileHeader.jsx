// Packages
import PropTypes from "prop-types";

// Assets
import DefaultUserLogo from "../../../../assets/DefaultUserLogo.jpg";

// Modal
import EditHeaderModal from "./EditHeaderModal/EditHeaderModal";
import { Link } from "react-router-dom";

const ProfileHeader = ({ user, refetch }) => {
  // Encode Email
  const encodeEmail = (email) => {
    if (!email) return "";
    return btoa(email);
  };

  return (
    <div className="max-w-7xl mx-auto rounded-xl shadow-sm border p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Profile Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
        <img
          src={user?.profileImage || DefaultUserLogo}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Details */}
          <div>
            {/* Full Name */}
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.fullName || "Not Given Yet"}
            </h1>

            {/* Title */}
            <p className="text-sm text-gray-500">
              {user?.title || "Not Given Yet"}
            </p>

            {/* Location */}
            <p className="text-sm text-gray-500">
              {user?.location || "Not Given Yet"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            {/* Edit Profile Button */}
            <button
              onClick={() =>
                document.getElementById("Edit_Header_Modal").showModal()
              }
              className="text-sm bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Edit Profile
            </button>

            {/* View Public Profile Button */}
            <Link
              to={`/Profile/${encodeEmail(user?.email)}`}
              className="px-5 py-2.5 border border-blue-600 text-blue-600 font-medium text-sm rounded bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition cursor-pointer"
            >
              View Public Profile
            </Link>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white max-w-3xl">
          <p className="mt-4 text-gray-700 text-sm leading-relaxed">
            {user.bio || "No Bio Given Yet"}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="Edit_Header_Modal" className="modal">
        <EditHeaderModal user={user} refetch={refetch} />
      </dialog>
    </div>
  );
};

// Prop Validation
ProfileHeader.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    profileImage: PropTypes.string,
    bio: PropTypes.string,
    email: PropTypes.string.isRequired,
    _id: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ProfileHeader;
