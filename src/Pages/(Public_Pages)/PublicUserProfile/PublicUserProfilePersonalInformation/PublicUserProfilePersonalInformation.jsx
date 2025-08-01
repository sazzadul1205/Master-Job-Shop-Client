// Packages
import PropTypes from "prop-types";

// Icons
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

// Component
const PublicUserProfilePersonalInformation = ({ user }) => {
  // Normalize socials
  const socialsMap = {};
  if (Array.isArray(user?.socials)) {
    user.socials.forEach(({ platform, url }) => {
      socialsMap[platform.toLowerCase()] = url;
    });
  }

  return (
    <div className="space-y-10">
      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 text-sm text-gray-800">
        {/* Email */}
        <InfoItem label="Email" value={user?.email} />

        {/* Phone with + added if missing */}
        <InfoItem
          label="Phone"
          value={
            user?.phone
              ? user.phone.startsWith("+")
                ? user.phone
                : "+" + user.phone
              : null
          }
        />

        {/* Experience Level */}
        <InfoItem label="Experience Level" value={user?.experienceLevel} />

        {/* Availability */}
        <InfoItem label="Available From" value={user?.availability} />
      </div>

      {/* Socials */}
      <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center gap-4 px-1">
        {socialsMap.linkedin || socialsMap.github || socialsMap.portfolio ? (
          <>
            {socialsMap.linkedin && (
              <SocialLink
                platform="LinkedIn"
                url={socialsMap.linkedin}
                icon={FaLinkedin}
                colorClass="text-blue-600"
              />
            )}

            {socialsMap.github && (
              <SocialLink
                platform="GitHub"
                url={socialsMap.github}
                icon={FaGithub}
                colorClass="text-gray-900"
              />
            )}

            {socialsMap.portfolio && (
              <SocialLink
                platform="Portfolio"
                url={socialsMap.portfolio}
                icon={FaGlobe}
                colorClass="text-green-600"
              />
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No social links provided.
          </p>
        )}
      </div>
    </div>
  );
};

// Prop Validation
PublicUserProfilePersonalInformation.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    experienceLevel: PropTypes.string,
    availability: PropTypes.string,
    socials: PropTypes.arrayOf(
      PropTypes.shape({
        platform: PropTypes.string.isRequired,
        url: PropTypes.string,
      })
    ),
  }),
};

export default PublicUserProfilePersonalInformation;

// Info Display Item
const InfoItem = ({ label, value }) => (
  <div>
    <p className="font-medium text-gray-900 mb-1">{label}</p>
    <p>{value || <span className="text-gray-500">Not Provided</span>}</p>
  </div>
);

// Prop Validation for InfoItem
InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

// Social Link
const SocialLink = ({ url, icon: Icon, colorClass, platform }) => (
  <div className="flex items-center gap-2">
    <Icon className={`${colorClass} w-5 h-5`} />
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline break-all"
        title={url}
      >
        {platform}
      </a>
    ) : (
      <span className="text-sm text-gray-500">Not Provided</span>
    )}
  </div>
);

// Prop Validation for SocialLink
SocialLink.propTypes = {
  platform: PropTypes.string.isRequired,
  url: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  colorClass: PropTypes.string.isRequired,
};
