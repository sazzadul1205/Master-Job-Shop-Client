// Packages
import PropTypes from "prop-types";

// Icons
import { FaCheckCircle, FaEnvelope, FaGlobe, FaPhone } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Default Logo
import DefaultCompanyLogo from "../../../../assets/DefaultCompanyLogo.jpg";

const ViewCompanyProfileModal = ({ company }) => {
  // Destructuring Company Data
  const {
    name,
    logo,
    tagline,
    founded,
    size,
    industry,
    headquarters,
    contact,
    website,
    overview,
    socialLinks,
    tags,
    verificationStatus,
  } = company || {};

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("View_Company_Profile_Modal").close();
        }}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        View Company Profile ( For Public View )
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Content */}
      <div className="bg-white text-black shadow-md rounded-xl p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
          <img
            src={logo}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DefaultCompanyLogo;
            }}
            alt={`${name} Logo`}
            className="w-28 h-28 rounded-full border shadow-md object-contain"
          />

          {/* Name & Tagline & Tags */}
          <div className="flex-1">
            {/* Company Name */}
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {/* Name  */}
              {name}

              {/* Verification Status */}
              {verificationStatus === "verified" && (
                <FaCheckCircle
                  className="text-blue-500 text-lg"
                  title="Verified"
                />
              )}
            </h2>

            {/* Tagline */}
            <p className="text-gray-600 text-lg">{tagline}</p>

            {/* Tags */}
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

        {/* Company Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Facts */}
          <div>
            {/* Title */}
            <h4 className="text-lg font-semibold mb-2">Quick Facts</h4>

            {/* Content */}
            <ul className="text-gray-700 space-y-1">
              {/* Founded */}
              <li>
                <strong>Founded:</strong> {founded}
              </li>

              {/* Size */}
              <li>
                <strong>Size:</strong> {size}
              </li>

              {/* Industry */}
              <li>
                <strong>Industry:</strong> {industry}
              </li>

              {/* Headquarters */}
              <li>
                <strong>Headquarters:</strong>{" "}
                {`${headquarters?.address}, ${headquarters?.city}, ${headquarters?.country}`}
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            {/* Title */}
            <h4 className="text-lg font-semibold mb-2">Contact Info</h4>

            {/* Content */}
            <ul className="text-gray-700 space-y-2">
              {/* Email */}
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

              {/* Phone */}
              {contact?.phone && (
                <li className="flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
                  <a href={`tel:${contact.phone}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </li>
              )}

              {/* Website */}
              {website && (
                <li className="flex items-center gap-2">
                  <FaGlobe className="text-blue-600" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {website}
                  </a>
                </li>
              )}

              {/* Linkedin */}
              {socialLinks?.linkedin && (
                <li className="flex items-center gap-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    className="w-4 h-4"
                  />
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

// Prop Validation
ViewCompanyProfileModal.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string,
    logo: PropTypes.string,
    tagline: PropTypes.string,
    founded: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.string,
    industry: PropTypes.string,
    headquarters: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
    }),
    contact: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    website: PropTypes.string,
    overview: PropTypes.string,
    socialLinks: PropTypes.shape({
      linkedin: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.string),
    verificationStatus: PropTypes.string,
  }).isRequired,
};

export default ViewCompanyProfileModal;
