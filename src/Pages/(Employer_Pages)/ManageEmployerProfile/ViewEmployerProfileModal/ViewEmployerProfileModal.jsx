// Packages
import PropTypes from "prop-types";

// Icons
import { FaCheckCircle, FaEnvelope, FaGlobe, FaPhone } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Social Media Icons
const TwitterIcon = () => (
  <img
    src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
    alt="Twitter"
    className="w-5 h-5"
  />
);

const FacebookIcon = () => (
  <img
    src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
    alt="Facebook"
    className="w-5 h-5"
  />
);

// Default Logo
import DefaultCompanyLogo from "../../../../assets/DefaultCompanyLogo.jpg";

const ViewEmployerProfileModal = ({ employer }) => {
  if (!employer) return null;

  const {
    name,
    logo,
    industry,
    overview,
    tags,
    contact,
    onlinePresence,
    verificationStatus,
  } = employer;

  return (
    <div
      id="View_Employer_Profile_Modal"
      className="modal-box min-w-5xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("View_Employer_Profile_Modal").close();
        }}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        View Employer Profile (For Public View)
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Content */}
      <div className="bg-white text-black shadow-md rounded-xl p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
          <img
            src={logo || DefaultCompanyLogo}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DefaultCompanyLogo;
            }}
            alt={`${name} Logo`}
            className="w-28 h-28 rounded-full border shadow-md object-contain"
          />

          {/* Name & Verification & Tags */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {name}
              {verificationStatus === "verified" && (
                <FaCheckCircle
                  className="text-blue-500 text-lg"
                  title="Verified"
                />
              )}
            </h2>
            <p>
              {" "}
              <span>{industry}</span>
            </p>

            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overview */}
        <section>
          <h3 className="text-xl font-semibold mb-2">Company Overview</h3>
          <p className="text-gray-700 leading-relaxed">{overview}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <section>
            <h4 className="text-lg font-semibold mb-2">Contact Information</h4>
            <ul className="text-gray-700 space-y-2">
              {contact?.email && (
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-600" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:underline"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.phone && (
                <li className="flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
                  <a href={`tel:${contact.phone}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </li>
              )}

              {/* Explicitly showing location, city, country */}
              {(contact?.location || contact?.city || contact?.country) && (
                <li className="flex flex-col gap-0.5">
                  <strong>Location:</strong>
                  <span>
                    {contact.location || ""}
                    {contact.city ? `, ${contact.city}` : ""}
                    {contact.country ? `, ${contact.country}` : ""}
                  </span>
                </li>
              )}

              {contact?.address && (
                <li>
                  <strong>Address:</strong> {contact.address}
                </li>
              )}
            </ul>
          </section>

          {/* Online Presence */}
          <section>
            <h4 className="text-lg font-semibold mb-2">Online Presence</h4>
            <ul className="text-gray-700 space-y-2">
              {onlinePresence?.website && (
                <li className="flex items-center gap-2">
                  <FaGlobe className="text-blue-600" />
                  <a
                    href={onlinePresence.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Website
                  </a>
                </li>
              )}
              {onlinePresence?.linkedin && (
                <li className="flex items-center gap-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    className="w-5 h-5"
                  />
                  <a
                    href={onlinePresence.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {onlinePresence?.twitter && (
                <li className="flex items-center gap-2">
                  <TwitterIcon />
                  <a
                    href={onlinePresence.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Twitter
                  </a>
                </li>
              )}
              {onlinePresence?.facebook && (
                <li className="flex items-center gap-2">
                  <FacebookIcon />
                  <a
                    href={onlinePresence.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Facebook
                  </a>
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

ViewEmployerProfileModal.propTypes = {
  employer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.string,
    industry: PropTypes.string,
    overview: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    contact: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      location: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      address: PropTypes.string,
    }),
    onlinePresence: PropTypes.shape({
      website: PropTypes.string,
      linkedin: PropTypes.string,
      twitter: PropTypes.string,
      facebook: PropTypes.string,
    }),
    verificationStatus: PropTypes.string,
  }),
};

export default ViewEmployerProfileModal;
