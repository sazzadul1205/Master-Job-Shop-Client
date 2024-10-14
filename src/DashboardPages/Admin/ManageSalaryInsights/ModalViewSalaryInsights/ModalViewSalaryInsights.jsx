import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";

const ModalViewSalaryInsights = ({ salaryData }) => {
  // Check if salaryData is valid
  if (!salaryData) {
    return <p className="text-red-500">No salary data available.</p>;
  }

  return (
    <div className="modal-box bg-white max-w-[1000px] p-0 pb-10">
      {/* Top part */}
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p className="font-bold text-xl">View Salary Insights Details</p>
        <button
          onClick={() =>
            document.getElementById("Modal_Salary_Insights_View").close()
          }
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <div className="modal-body p-5">
        {/* Job Title */}
        <p className="font-bold text-2xl">{salaryData.jobTitle}</p>

        {/* Average Salary */}
        <p className="text-green-500 font-semibold text-xl">
          Average Salary: {salaryData.averageSalary}
        </p>

        {/* Experience Level */}
        <p className="text-blue-500 text-xl">
          Experience Level: {salaryData.experienceLevel}
        </p>

        {/* Job Type */}
        {salaryData.jobType && (
          <p className="text-gray-500 text-xl">
            Job Type: {salaryData.jobType}
          </p>
        )}

        {/* Global Salary Range */}
        <div className="py-2">
          <p className="font-bold text-lg py-1">Global Salary Range:</p>
          <ul className="list-disc list-inside">
            {Object.keys(salaryData.globalSalaryRange).map((region, idx) => (
              <li className="text-lg" key={idx}>
                {region}: {salaryData.globalSalaryRange[region]}
              </li>
            ))}
          </ul>
        </div>

        {/* Experience Level */}
        <div className="flex items-center text-lg py-2">
          <p className="font-bold">Average Experience Level:</p>
          <p className="ml-5">{salaryData.experienceLevel}</p>
        </div>

        {/* Education */}
        <div className="flex items-center text-lg py-2">
          <p className="font-bold">Education:</p>
          <p className="ml-5">{salaryData.education}</p>
        </div>

        {/* Responsibilities */}
        <div className="py-2">
          <p className="font-bold text-lg py-1">Responsibilities:</p>
          <ul className="list-disc list-inside">
            {salaryData.responsibilities.map((resp, idx) => (
              <li className="text-lg" key={idx}>
                {resp}
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Required */}
        <div className="py-2">
          <p className="font-bold text-lg py-1">Skills Required:</p>
          <ul className="list-disc list-inside">
            {salaryData.skillsRequired.map((skill, idx) => (
              <li className="text-lg" key={idx}>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Typical Challenges */}
        <div className="py-2">
          <p className="font-bold text-lg py-1">Typical Challenges:</p>
          <ul className="list-disc list-inside">
            {salaryData.typicalChallenges.map((challenge, idx) => (
              <li className="text-lg" key={idx}>
                {challenge}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Career Path */}
          <div className="py-2">
            <p className="font-bold text-lg py-1">Career Path:</p>
            <ul className="list-disc list-inside">
              {salaryData.careerPath.map((path, idx) => (
                <li className="text-lg" key={idx}>
                  {path}
                </li>
              ))}
            </ul>
          </div>

          {/* Common Certifications */}
          <div className="py-2">
            <p className="font-bold text-lg py-1">Common Certifications:</p>
            <ul className="list-disc list-inside">
              {salaryData.commonCertifications.map((cert, idx) => (
                <li className="text-lg" key={idx}>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Potential Industries */}
          <div className="py-2">
            <p className="font-bold text-lg py-1">Potential Industries:</p>
            <ul className="list-disc list-inside">
              {salaryData.potentialIndustries.map((industry, idx) => (
                <li className="text-lg" key={idx}>
                  {industry}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools and Technologies */}
          <div className="py-2">
            <p className="font-bold text-lg py-1">Tools and Technologies:</p>
            <ul className="list-disc list-inside">
              {salaryData.toolsAndTechnologies.map((tool, idx) => (
                <li className="text-lg" key={idx}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Soft Skills */}
        <div className="py-2">
          <p className="font-bold text-lg py-1">Soft Skills:</p>
          <ul className="list-disc list-inside">
            {salaryData.softSkills.map((skill, idx) => (
              <li className="text-lg" key={idx}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
ModalViewSalaryInsights.propTypes = {
  salaryData: PropTypes.shape({
    jobTitle: PropTypes.string.isRequired,
    averageSalary: PropTypes.string.isRequired,
    experienceLevel: PropTypes.string.isRequired,
    jobType: PropTypes.string,
    globalSalaryRange: PropTypes.object.isRequired,
    education: PropTypes.string.isRequired,
    responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    skillsRequired: PropTypes.arrayOf(PropTypes.string).isRequired,
    typicalChallenges: PropTypes.arrayOf(PropTypes.string).isRequired,
    careerPath: PropTypes.arrayOf(PropTypes.string).isRequired,
    commonCertifications: PropTypes.arrayOf(PropTypes.string).isRequired,
    potentialIndustries: PropTypes.arrayOf(PropTypes.string).isRequired,
    toolsAndTechnologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    softSkills: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ModalViewSalaryInsights;
