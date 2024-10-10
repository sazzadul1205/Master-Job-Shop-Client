import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import PropTypes from "prop-types";
import ModalSalaryInsights from "../../Shared/ModalSalaryInsights/ModalSalaryInsights";

const FeaturedSalaryInsights = ({ SalaryInsightData }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  const openModal = (job) => {
    setSelectedJob(job);
    const modal = document.getElementById("SalaryInsightsModal");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("SalaryInsightsModal");
    modal.close();
    setSelectedJob(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-400">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="flex items-center pt-20 px-5">
          <div>
            <p className="text-5xl font-bold italic text-blue-700">
              Salary Insights
            </p>
            <p className="text-xl">
              Get an overview of salary ranges for various roles.
            </p>
          </div>
          <button className="ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/SalaryInsights"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Salary Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {SalaryInsightData.slice(0, 6).map((salaryInsight, index) => (
            <div
              key={index}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-orange-50 hover:shadow-2xl"
            >
              <div className="card-body">
                <p className="font-bold text-2xl">{salaryInsight.jobTitle}</p>
                <p className="text-green-500 font-semibold">
                  Average Salary: {salaryInsight.averageSalary}
                </p>
                <p className="text-blue-500">
                  Experience Level: {salaryInsight.experienceLevel}
                </p>
                {salaryInsight.jobType && (
                  <p className="text-gray-500">
                    Job Type: {salaryInsight.jobType}
                  </p>
                )}
                <div className="card-actions justify-end">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 text-lg font-semibold text-white"
                    onClick={() => openModal(salaryInsight)}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="SalaryInsightsModal" className="modal">
        {selectedJob && (
          <ModalSalaryInsights
            selectedJob={selectedJob}
            closeModal={closeModal}
          ></ModalSalaryInsights>
        )}
      </dialog>
    </div>
  );
};

// Add this at the end of your component
FeaturedSalaryInsights.propTypes = {
  SalaryInsightData: PropTypes.arrayOf(
    PropTypes.shape({
      jobTitle: PropTypes.string.isRequired,
      averageSalary: PropTypes.string.isRequired,
      experienceLevel: PropTypes.string.isRequired,
      jobType: PropTypes.string,
      globalSalaryRange: PropTypes.object.isRequired,
      education: PropTypes.string,
      responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
      typicalChallenges: PropTypes.arrayOf(PropTypes.string).isRequired,
      careerPath: PropTypes.arrayOf(PropTypes.string).isRequired,
      commonCertifications: PropTypes.arrayOf(PropTypes.string).isRequired,
      potentialIndustries: PropTypes.arrayOf(PropTypes.string).isRequired,
      toolsAndTechnologies: PropTypes.arrayOf(PropTypes.string).isRequired,
      softSkills: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default FeaturedSalaryInsights;
