import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaCheckCircle,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import CommonButton from "../../../Shared/CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Default Logo
import DefaultCompanyLogo from "../../..//assets/DefaultCompanyLogo.jpg";

const CompanyProfilesDetails = () => {
  const axiosPublic = useAxiosPublic();
  const { companyId } = useParams();
  const navigate = useNavigate();

  // Fetch Company Data
  const {
    data: SelectedCompanyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedCompanyData", companyId],
    queryFn: () =>
      axiosPublic.get(`/Company?id=${companyId}`).then((res) => res.data),
    enabled: !!companyId,
  });

  // Scroll to top on mount
  useEffect(() => window.scrollTo(0, 0), []);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

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
  } = SelectedCompanyData || {};

  return (
    <div className="min-h-screen  py-10 px-4 md:px-20">
      {/* Top bar with Back and Details */}
      <div className="flex items-center justify-between mb-4 px-20">
        <CommonButton
          type="button"
          text="Back"
          icon={<FaArrowLeft />}
          clickEvent={() => navigate(-1)}
          bgColor="white"
          textColor="text-black"
          px="px-10"
          py="py-2"
          borderRadius="rounded-md"
        />
      </div>

      {/* Content */}
      <div className="bg-white text-black shadow-md rounded-xl p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
          <img
            src={logo}
            onError={(e) => {
              e.currentTarget.onerror = null; // Prevent infinite loop
              e.currentTarget.src = DefaultCompanyLogo;
            }}
            alt={`${name} Logo`}
            className="w-28 h-28 rounded-full border shadow-md object-contain"
          />

          <div className="flex-1">
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
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Facts</h4>
            <ul className="text-gray-700 space-y-1">
              <li>
                <strong>Founded:</strong> {founded}
              </li>
              <li>
                <strong>Size:</strong> {size}
              </li>
              <li>
                <strong>Industry:</strong> {industry}
              </li>
              <li>
                <strong>Headquarters:</strong>{" "}
                {`${headquarters?.address}, ${headquarters?.city}, ${headquarters?.country}`}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Contact Info</h4>
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

export default CompanyProfilesDetails;
