import PropTypes from "prop-types";

const CompanyCard = ({
  companyName,
  location,
  industry,
  website,
  logo,
  description,
}) => {
  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-2xl">
      <div className="card-body">
        {/* Company Logo */}
        {logo && (
          <img
            src={logo}
            alt={`${companyName} Logo`}
            className="w-full h-32 object-cover mb-4"
          />
        )}

        {/* Company Name */}
        <p className="font-bold text-2xl">{companyName || "Company Name"}</p>

        {/* Location */}
        <p className="text-gray-500">{location || "Location"}</p>

        {/* Industry */}
        <p className="text-blue-500 font-semibold">
          Industry: {industry || "Industry"}
        </p>

        {/* Website */}
        {website && (
          <p className="text-green-500">
            Website:{" "}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {website}
            </a>
          </p>
        )}

        {/* Description */}
        <p className="text-gray-700">{description || "Company Description"}</p>

        {/* Card Actions */}
        <div className="card-actions justify-end mt-5">
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            View Jobs
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes
CompanyCard.propTypes = {
  companyName: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  industry: PropTypes.string.isRequired,
  website: PropTypes.string,
  logo: PropTypes.string,
  description: PropTypes.string,
};

export default CompanyCard;
