import { FaThumbsUp, FaShieldAlt, FaUserTie, FaSmile } from "react-icons/fa";

// Map to associate icon names with their respective components
const iconMap = {
  FaThumbsUp: <FaThumbsUp className="text-4xl text-blue-600" />,
  FaShieldAlt: <FaShieldAlt className="text-4xl text-blue-600" />,
  FaUserTie: <FaUserTie className="text-4xl text-blue-600" />,
  FaSmile: <FaSmile className="text-4xl text-blue-600" />,
};

const WhyChooseUs = () => {
  // Define reasons with icon names as strings
  const reasons = [
    {
      id: 1,
      iconName: "FaThumbsUp",
      title: "Top Quality Services",
      description:
        "We ensure that every service we provide meets the highest quality standards, ensuring customer satisfaction every time.",
    },
    {
      id: 2,
      iconName: "FaShieldAlt",
      title: "Trust and Security",
      description:
        "Your trust and security are our priority. We use the latest security technologies to protect your data and transactions.",
    },
    {
      id: 3,
      iconName: "FaUserTie",
      title: "Professional Expertise",
      description:
        "Our team consists of highly skilled professionals with years of experience in delivering outstanding results.",
    },
    {
      id: 4,
      iconName: "FaSmile",
      title: "Exceptional Customer Service",
      description:
        "We pride ourselves on offering personalized and friendly customer service that exceeds expectations.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 ">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top Section */}
        <div className="text-xl py-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Why chose us
          </p>
          <p className="text-xl">
           See our Qualification and choose us
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => (
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

export default WhyChooseUs;
