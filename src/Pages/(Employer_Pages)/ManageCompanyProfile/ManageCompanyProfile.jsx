// Icons
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaEnvelope,
  FaLinkedin,
} from "react-icons/fa";

// Assets
import DefaultCompanyLogo from "../../../assets/DefaultCompanyLogo.jpg";

const ManageCompanyProfile = () => {
  const company = {
    name: "Aether Robotics",
    logo: "https://aetherrobotics.com/logo.png",
    tagline: "Engineering the Future of Autonomy.",
    founded: 2020,
    size: "11-50 employees",
    industry: "Robotics & Automation",
    headquarters: {
      city: "Seoul",
      state: null,
      country: "South Korea",
      address: "77 Tech Valley Rd, Gangnam, Seoul 06040",
    },
    contact: {
      email: "hello@aetherrobotics.com",
      phone: "+82 2-555-6789",
    },
    website: "https://aetherrobotics.com",
    overview:
      "Aether Robotics develops autonomous delivery bots, drones, and industrial robotic arms.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/aetherrobotics",
    },
    tags: ["Innovative", "Hiring", "Great Culture"],
    verificationStatus: "verified",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <FaBuilding className="text-blue-700" /> Manage My Company Profile
        </h3>
        <div className="py-[1px] w-full bg-blue-700 mt-3" />
      </div>

      {/* Company Overview */}
      <div className="bg-white text-black shadow-md rounded-xl p-6 space-y-4">
        {/* Basic Info */}
        <div className="flex items-center gap-4">
          {/* Company Logo */}
          <img
            src={company.logo || DefaultCompanyLogo}
            alt="Company Logo"
            className="w-16 h-16 object-contain rounded-full"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DefaultCompanyLogo;
            }}
          />

          <div>
            {/* Company Name */}
            <h4 className="text-xl font-semibold">{company.name}</h4>

            {/* Company Tagline */}
            <p className="text-sm text-gray-600">{company.tagline}</p>
          </div>
        </div>

        {/* Company Overview */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {company.overview}
        </p>
      </div>

      {/* Details Section */}
      <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Company Info */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-3 border border-gray-100">
          {/* Title */}
          <h5 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaBuilding className="text-blue-600" /> Company Overview
          </h5>

          {/* Company Info */}
          <div className="grid grid-cols-2 text-sm space-y-1">
            {/* Founded */}
            <p>
              <span className="font-semibold text-black text-md pr-2">
                Founded:
              </span>{" "}
              {company.founded}
            </p>

            {/* Size */}
            <p>
              <span className="font-semibold text-black text-md pr-2">
                Size:
              </span>{" "}
              {company.size}
            </p>

            {/* Industry */}
            <p>
              <span className="font-semibold text-black text-md pr-2">
                Industry:
              </span>{" "}
              {company.industry}
            </p>

            {/* Verification Status */}
            <p>
              <span className="font-semibold text-black text-md pr-2">
                Verification:
              </span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs font-semibold uppercase ${
                  company.verificationStatus === "verified"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {company.verificationStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Headquarters */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-3 border border-gray-100">
          <h5 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" /> Headquarters
          </h5>
          <p className="text-sm text-gray-700 leading-relaxed">
            {company.headquarters.address}
            <br />
            {company.headquarters.city}, {company.headquarters.country}
          </p>
        </div>
      </div>

      {/* Contact & Online Presence */}
      <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {/* Contact Info */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-3 border border-gray-100">
          <h5 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaEnvelope className="text-blue-600" /> Contact Information
          </h5>
          <div className="text-sm space-y-1 text-gray-700">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> {company.contact.email}
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-500" /> {company.contact.phone}
            </p>
          </div>
        </div>

        {/* Online Presence */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-3 border border-gray-100">
          <h5 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaGlobe className="text-blue-600" /> Online Presence
          </h5>
          <div className="text-sm space-y-1 text-gray-700">
            <p className="flex items-center gap-2">
              <FaGlobe className="text-blue-500" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaLinkedin className="text-blue-500" />
              <a
                href={company.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="text-black bg-white shadow-md rounded-xl p-5">
        <h5 className="font-semibold text-lg mb-2">Tags</h5>
        <div className="flex flex-wrap gap-2">
          {company.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCompanyProfile;
