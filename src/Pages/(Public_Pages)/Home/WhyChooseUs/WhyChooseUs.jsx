import {
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaTools,
  FaChartLine,
} from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaCheckCircle className="text-green-500 text-3xl" />,
      title: "Proven Results",
      description:
        "Backed by client success stories and measurable outcomes across industries.",
    },
    {
      icon: <FaUsers className="text-blue-500 text-3xl" />,
      title: "Expert Team",
      description:
        "Our certified professionals bring years of experience and passion to every project.",
    },
    {
      icon: <FaTools className="text-yellow-500 text-3xl" />,
      title: "Cutting-Edge Tools",
      description:
        "We utilize modern tech stacks to deliver high-performing, scalable solutions.",
    },
    {
      icon: <FaClock className="text-purple-500 text-3xl" />,
      title: "Timely Delivery",
      description:
        "We stick to deadlines with transparent milestones and frequent updates.",
    },
    {
      icon: <FaChartLine className="text-red-500 text-3xl" />,
      title: "Growth-Oriented",
      description:
        "Everything we do is designed to elevate your brand and drive real growth.",
    },
  ];

  return (
    <section className="bg-gradient-to-tl from-blue-400 to-blue-600 py-10">
      <div className="px-10 text-center">
        {/* Header */}
        <h2 className="text-4xl font-bold text-white">Why Choose Us</h2>
        <p className="lg:text-xl text-gray-200">
          We don’t just offer services — we deliver trust, value, and results.
          Here’s what sets us apart:
        </p>

        {/* Feature Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 py-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition duration-300 text-left cursor-default"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
