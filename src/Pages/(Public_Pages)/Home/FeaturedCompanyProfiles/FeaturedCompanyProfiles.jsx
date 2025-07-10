import { Link } from "react-router-dom";
import { useEffect } from "react";

// Packages
import PropTypes from "prop-types";

// Icon
import { FaArrowRight } from "react-icons/fa";

// Default Logo
import DefaultCompanyLogo from "../../../../assets/DefaultCompanyLogo.jpg";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

const FeaturedCompanyProfiles = ({ CompanyData }) => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-tl from-blue-400 to-blue-600 py-5">
      <div className="p-20 mx-auto">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-5">
            <div>
              <h2 className="text-4xl font-bold text-white">
                Explore Companies
              </h2>
              <p className="lg:text-xl text-gray-200">
                Discover top-rated employers with amazing culture and open
                opportunities.
              </p>
            </div>

            {/* Go To Button */}
            <Link
              to="/companies"
              className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
            >
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {CompanyData.slice(0, 6).map((company, index) => (
            <Link
              key={company._id}
              to={`/companies/${company._id}`}
              data-aos="fade-up"
              data-aos-delay={index * 150} // 150ms delay between cards
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center group"
            >
              <img
                src={company.logo || DefaultCompanyLogo}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultCompanyLogo;
                }}
                alt={company.name}
                className="w-16 h-16 object-contain rounded-full border border-gray-200 mb-3"
              />

              <p className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                {company.name || "Unknown Company"}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-1 text-xs mt-1">
                {company.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                )) || (
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    No Tags
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Prop Validation
FeaturedCompanyProfiles.propTypes = {
  CompanyData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      logo: PropTypes.string,
      name: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default FeaturedCompanyProfiles;
