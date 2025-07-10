import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AOS from "aos";
import "aos/dist/aos.css";

const FeaturedSalaryInsights = ({ InsightsData }) => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    AOS.refresh(); // re-trigger AOS animation after data update/refetch
  }, [InsightsData, selectedRoleIndex]);

  if (!Array.isArray(InsightsData) || InsightsData.length === 0) return null;

  const selectedRole = InsightsData[selectedRoleIndex];

  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-10">
      {/* Section Header */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-4xl font-bold text-white">Know Your Worth</h2>
        <p className="text-white font-semibold mt-2 max-w-2xl mx-auto">
          Explore average salaries based on experience and location. Make
          smarter career decisions with real-world insights.
        </p>
      </div>

      {/* Dropdown Role Selector */}
      <div className="flex justify-center mb-8 px-4">
        <select
          value={selectedRoleIndex}
          onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
          className="text-base px-4 py-2 border min-w-[300px] text-black border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {InsightsData.map((role, index) => (
            <option key={role._id || role.title} value={index}>
              {role.title}
            </option>
          ))}
        </select>
      </div>

      {/* Insights Cards */}
      <div className="grid md:grid-cols-2 gap-6 px-4 md:px-20">
        {selectedRole?.data?.map((countryData, idx) => (
          <div
            key={`${countryData.country}-${idx}`}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              {countryData.country}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Average Salary:{" "}
              <span className="font-semibold text-green-700">
                {countryData.currency} {countryData.averageSalary}
              </span>
            </p>

            {/* Experience Breakdown */}
            <div className="space-y-1">
              {countryData.experienceLevels.map((level) => (
                <div
                  key={level.level}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{level.level}</span>
                  <span>
                    {countryData.currency} {level.salary}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

FeaturedSalaryInsights.propTypes = {
  InsightsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          country: PropTypes.string.isRequired,
          averageSalary: PropTypes.number.isRequired,
          currency: PropTypes.string.isRequired,
          experienceLevels: PropTypes.arrayOf(
            PropTypes.shape({
              level: PropTypes.string.isRequired,
              salary: PropTypes.number.isRequired,
            })
          ).isRequired,
        })
      ).isRequired,
    })
  ),
};

export default FeaturedSalaryInsights;
