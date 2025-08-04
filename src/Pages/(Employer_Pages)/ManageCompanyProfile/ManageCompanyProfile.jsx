// Icons
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
  FaEye,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";

// Assets
import DefaultCompanyLogo from "../../../assets/DefaultCompanyLogo.jpg";

// Modals
import AddCompanyProfileModal from "./AddCompanyProfileModal/AddCompanyProfileModal";
import EditCompanyProfileModal from "./EditCompanyProfileModal/EditCompanyProfileModal";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

const ManageCompanyProfile = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Company Data
  const {
    data: CompanyData,
    isLoading: CompanyIsLoading,
    error: CompanyError,
    refetch: CompanyRefetch,
  } = useQuery({
    queryKey: ["CompanyData"],
    queryFn: () =>
      axiosPublic.get(`/Company?email=${user?.email}`).then((res) => res.data),
  });

  const company = CompanyData || {};

  // Loading / Error UI
  if (CompanyIsLoading || loading) return <Loading />;
  if (CompanyError) return <Error />;

  // If no company data, show a placeholder card
  if (!CompanyData || Object.keys(CompanyData).length === 0) {
    return (
      <div className="min-h-[60vh]  flex items-center justify-center">
        {/* Placeholder Card */}
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl text-center space-y-4 border">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Your Company Profile
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm">
            To post jobs, manage applicants, and enhance your visibility to
            potential candidates, you need to set up your company profile first.
            This helps us verify and showcase your brand professionally.
          </p>

          {/* Button to open modal */}
          <button
            onClick={() =>
              document.getElementById("Add_Company_Profile_Modal").showModal()
            }
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
          >
            Create Company Profile
          </button>
        </div>

        {/* Add Company Profile Modal */}
        <dialog id="Add_Company_Profile_Modal" className="modal">
          <AddCompanyProfileModal CompanyRefetch={CompanyRefetch} />
        </dialog>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* Title */}
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <FaBuilding className="text-blue-700" /> Manage My Company Profile
        </h3>

        <div className="flex items-center gap-5">
          {/* View Profile Button */}
          <button className="flex items-center gap-2 bg-blue-700 text-white font-semibold rounded shadow-xl px-5 py-2 cursor-pointer hover:bg-blue-800 transition-colors duration-300">
            <FaEye />
            View Profile
          </button>

          {/* Add New Job Button */}
          <button
            onClick={() =>
              document.getElementById("Add_Company_Profile_Modal").showModal()
            }
            className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-5 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-300"
          >
            <MdEdit />
            Edit Company Profile
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-3 mb-6" />

      {/* Company Details */}
      <div className="space-y-6">
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

      <dialog id="Edit_Company_Profile_Modal" className="modal">
        <EditCompanyProfileModal />
      </dialog>
    </div>
  );
};

export default ManageCompanyProfile;
