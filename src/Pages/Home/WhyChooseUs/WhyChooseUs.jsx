import PropTypes from "prop-types"; // Import PropTypes
import { FaThumbsUp, FaShieldAlt, FaUserTie, FaSmile } from "react-icons/fa";

// Map to associate icon names with their respective components
const iconMap = {
  FaThumbsUp: <FaThumbsUp className="text-4xl text-blue-600" />,
  FaShieldAlt: <FaShieldAlt className="text-4xl text-blue-600" />,
  FaUserTie: <FaUserTie className="text-4xl text-blue-600" />,
  FaSmile: <FaSmile className="text-4xl text-blue-600" />,
};

const WhyChooseUs = ({ WhyChooseUsData }) => {
  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 ">
      <div className="max-w-[1200px] mx-auto text-black py-10 px-5">
        {/* Top Section */}
        <div className="text-xl py-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Why chose us
          </p>
          <p className="text-xl">See our Qualification and choose us</p>
        </div>

        {/* WhyChooseUsData Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WhyChooseUsData.map((reason) => (
            <div
              key={reason.id}
              className="bg-white shadow-md rounded-lg p-8 text-center transition-shadow duration-300 hover:shadow-2xl"
            >
              {/* Dynamically render the correct icon */}
              <div className="mb-6 flex justify-center">
                {iconMap[reason.iconName]}
              </div>
              {/* Title */}
              <h3 className="text-xl font-semibold mb-4">{reason.title}</h3>
              {/* Description */}
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Define prop types for the component
WhyChooseUs.propTypes = {
  WhyChooseUsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      iconName: PropTypes.oneOf(Object.keys(iconMap)).isRequired, // Ensure iconName is one of the keys in iconMap
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default WhyChooseUs;
