import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const InternshipPrograms = ({ InternshipData }) => {
  const getEventsToShow = () => Math.min(InternshipData.length, 6);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-300">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center pt-20 px-5">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-4xl md:text-5xl font-bold italic text-blue-700">
              Internship Programs
            </p>
            <p className="lg:text-xl">
              Explore internship opportunities to kickstart your career.
            </p>
          </div>
          <Link to="/Internship" className="mt-4 md:mt-0 md:ml-auto">
            <button className="text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300 flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </button>
          </Link>
        </div>

        {/* Internship Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10 px-5 lg:px-0">
          {InternshipData.slice(0, getEventsToShow()).map(
            (internship, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  {internship.title}
                </h3>
                <p className="text-gray-700 font-medium mb-1">
                  <span className="text-blue-700">Company: </span>
                  {internship.company?.name || "Company Name"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="text-blue-700">Location: </span>
                  {internship.company?.location?.city
                    ? `${internship.company.location.city}, ${internship.company.location.country}`
                    : "Remote / Flexible"}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="text-blue-700">Duration: </span>
                  <span className="font-medium">
                    {internship.duration?.months || "N/A"} months
                  </span>
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <span className="text-blue-700">Stipend: </span>
                  <span className="font-semibold text-green-700">
                    {internship.stipend?.isPaid
                      ? `${internship.stipend.currency}${internship.stipend.amount} /mo`
                      : "Unpaid"}
                  </span>
                </p>
                <Link
                  to={internship.application?.applyLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="w-full mt-2 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg">
                    Apply Now
                  </button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipPrograms;
