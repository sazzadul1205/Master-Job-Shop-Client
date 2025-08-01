// Packages
import PropTypes from "prop-types";

// Assets
import DefaultUserLogo from "../../../../assets/DefaultUserLogo.jpg";

const PublicUserProfileHeader = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
      {/* Profile Image */}
      <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300 shadow-sm">
        <img
          src={user?.profileImage || DefaultUserLogo}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 w-full space-y-4">
        {/* Name & Meta */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-gray-900">
            {user?.fullName || "Not Given Yet"}
          </h1>

          <p className="text-sm text-gray-600">
            {user?.title || "Title not provided"}
          </p>

          <p className="text-sm text-gray-600">
            {user?.location || "Location not provided"}
          </p>
        </div>

        {/* Bio */}
        {user?.bio ? (
          <p className="text-sm text-gray-700 leading-relaxed">{user.bio}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No bio available.</p>
        )}
      </div>
    </div>
  );
};

// Prop Validation
PublicUserProfileHeader.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    bio: PropTypes.string,
    profileImage: PropTypes.string,
  }),
};

export default PublicUserProfileHeader;
