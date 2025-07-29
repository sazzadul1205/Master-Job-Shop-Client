import PropTypes from "prop-types";

import DefaultUserLogo from "../../../../assets/DefaultUserLogo.jpg";

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white max-w-7xl mx-auto rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
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
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.fullName || "John Doe"}
            </h1>
            <p className="text-sm text-gray-500">
              {user?.title || "Aspiring Frontend Developer"}
            </p>
            <p className="text-sm text-gray-500">
              {user?.location || "Dhaka, Bangladesh"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer">
              Edit Profile
            </button>
            <button className="px-5 py-2.5 border border-blue-600 text-blue-600 font-medium text-sm rounded-xl bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition cursor-pointer">
              View Public Profile
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white shadow-2xl">
          <p className="mt-4 text-gray-700 text-sm leading-relaxed">
            {user.bio || "No Bio Given Yet"}
          </p>
        </div>
      </div>
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
  }).isRequired,
};

export default ProfileHeader;
