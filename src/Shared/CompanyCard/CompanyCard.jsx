import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaCheckCircle, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

// Default Logo
import DefaultCompanyLogo from "../../assets/DefaultCompanyLogo.jpg";

const CompanyCard = ({ Company }) => {
  // Destructuring Company Data
  const {
    _id,
    name,
    logo,
    tagline,
    industry,
    headquarters,
    verificationStatus,
    tags,
    website,
  } = Company;

  return (
    <div className="bg-white text-black rounded-lg shadow-md overflow-hidden transition hover:shadow-xl duration-300">
      {/* Logo & Name */}
      <div className="flex items-center gap-4 p-4 border-b">
        <img
          src={logo}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DefaultCompanyLogo;
          }}
          alt={`${name} logo`}
          className="w-16 h-16 rounded-full object-contain border"
        />
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-1">
            {name}
            {verificationStatus === "verified" && (
              <FaCheckCircle className="text-blue-500" title="Verified" />
            )}
          </h2>
          <p className="text-sm text-gray-500">{tagline}</p>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-2 text-gray-700 text-sm">
        <p>
          <span className="font-semibold">Industry:</span> {industry}
        </p>
        <p className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-blue-500" />
          {headquarters?.city}, {headquarters?.country}
        </p>
        {website && (
          <p className="flex items-center gap-1">
            <FaGlobe className="text-green-600" />
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {website.replace(/^https?:\/\//, "")}
            </a>
          </p>
        )}
        {/* Tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.slice(0, 3).map((tag, idx) => (
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

      {/* Footer */}
      <Link
        to={`/CompanyProfiles/${_id}`}
        className="flex justify-end px-4 pb-4"
      >
        <button className="text-sm text-blue-700 hover:underline cursor-pointer">
          View Details
        </button>
      </Link>
    </div>
  );
};

// Prop Vallation
CompanyCard.propTypes = {
  Company: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    logo: PropTypes.string,
    tagline: PropTypes.string,
    industry: PropTypes.string,
    headquarters: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
    }),
    verificationStatus: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    website: PropTypes.string,
  }).isRequired,
};

export default CompanyCard;
