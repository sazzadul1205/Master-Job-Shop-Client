import PropTypes from "prop-types";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import EditPersonalInformationModal from "./EditPersonalInformationModal/EditPersonalInformationModal";

const PersonalInformationSection = ({ user, refetch }) => {
  // Build socials map from user.socials array
  const socialsMap = {};
  if (Array.isArray(user?.socials)) {
    user.socials.forEach(({ platform, url }) => {
      socialsMap[platform] = url;
    });
  }

  // Helper component to show social link or fallback text
  const SocialLink = ({ url, icon: Icon, colorClass }) => (
    <div className="flex items-center gap-2">
      <Icon className={`${colorClass} w-5 h-5`} />
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
          title={url}
        >
          {url}
        </a>
      ) : (
        <span className="text-gray-500">Not Provided</span>
      )}
    </div>
  );

  // Prop Validation
  SocialLink.propTypes = {
    platform: PropTypes.string.isRequired,
    url: PropTypes.string,
    icon: PropTypes.elementType.isRequired,
    colorClass: PropTypes.string.isRequired,
  };

  return (
    <section className="bg-white border rounded-2xl shadow p-6 max-w-7xl mx-auto mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-blue-700">
          Personal Information
        </h2>

        {/* Edit Personal Information Button */}
        <button
          onClick={() =>
            document
              .getElementById("Edit_Personal_Information_Modal")
              .showModal()
          }
          className="text-sm bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Edit Personal Information
        </button>
      </div>

      {/* Grid container for personal info and socials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 text-sm text-gray-800">
        {/* Email */}
        <div>
          <p className="font-medium text-gray-900 mb-1">Email</p>
          <p>
            {user?.email || <span className="text-gray-500">Not Provided</span>}
          </p>
        </div>

        {/* Phone with + added if missing */}
        <div>
          <p className="font-medium text-gray-900 mb-1">Phone</p>
          <p>
            {user?.phone ? (
              user.phone.startsWith("+") ? (
                user.phone
              ) : (
                "+" + user.phone
              )
            ) : (
              <span className="text-gray-500">Not Provided</span>
            )}
          </p>
        </div>

        {/* Experience Level */}
        <div>
          <p className="font-medium text-gray-900 mb-1">Experience Level</p>
          <p>
            {user?.experienceLevel || (
              <span className="text-gray-500">Not Specified</span>
            )}
          </p>
        </div>

        {/* Availability */}
        <div>
          <p className="font-medium text-gray-900 mb-1">Available From</p>
          <p>
            {user?.availability || (
              <span className="text-gray-500">Not Set</span>
            )}
          </p>
        </div>

        {/* Social links */}
        <SocialLink
          platform="linkedin"
          url={socialsMap.linkedin}
          icon={FaLinkedin}
          colorClass="text-blue-600"
        />
        <SocialLink
          platform="github"
          url={socialsMap.github}
          icon={FaGithub}
          colorClass="text-gray-800"
        />
        <SocialLink
          platform="portfolio"
          url={socialsMap.portfolio}
          icon={FaGlobe}
          colorClass="text-green-600"
        />
      </div>

      <dialog id="Edit_Personal_Information_Modal" className="modal">
        <EditPersonalInformationModal user={user} refetch={refetch} />
      </dialog>
    </section>
  );
};

// Prop Types
PersonalInformationSection.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    experienceLevel: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
    socials: PropTypes.arrayOf(
      PropTypes.shape({
        platform: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default PersonalInformationSection;
