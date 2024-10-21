import PropTypes from "prop-types";
const ModalSalaryInsights = ({ selectedJob, closeModal }) => {
  return (
    <div className="modal-box bg-yellow-50 text-black max-w-[1000px]">
      <div className="modal-header mb-4 flex justify-between">
        <h2 className="text-2xl font-bold">{selectedJob.jobTitle}</h2>
        <button
          className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white"
          onClick={closeModal}
        >
          Close
        </button>
      </div>

      <div className="modal-body">
        {/* Average Salary */}
        <div className="py-2">
          <p className="font-bold text-lg py-1">Average Salary: </p>
          <p className="text-green-600">{selectedJob.averageSalary}</p>
        </div>

        {/* Global Salary Range */}
        <div className="py-2">
          <p className="font-bold py-1">Global Salary Range:</p>
          <ul className="list-disc list-inside">
            {Object.keys(selectedJob.globalSalaryRange).map((region, idx) => (
              <li className="text-lg flex flex-col md:flex-row" key={idx}>
                <span className="font-bold w-16">{region} :</span>
                <span className="ml-4">
                  {selectedJob.globalSalaryRange[region]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* jobType */}
        <div className="flex flex-col md:flex-row text-lg">
          <p className="font-bold">Job Type:</p>
          <p className="ml-5">{selectedJob.jobType}</p>
        </div>

        {/* education */}
        <div className="flex flex-col md:flex-row text-lg">
          <p className="font-bold">Education:</p>
          <p className="ml-5">{selectedJob.education}</p>
        </div>

        {/* experienceLevel */}
        <div className="flex flex-col md:flex-row text-lg">
          <p className="font-bold">Average Experience Level:</p>
          <p className="ml-5">{selectedJob.experienceLevel}</p>
        </div>

        {/* responsibilities */}
        <div className="py-2">
          <p className="font-bold text-lg py-1">Responsibilities:</p>
          <ul className="list-disc list-inside">
            {selectedJob.responsibilities.map((resp, idx) => (
              <li className="text-lg" key={idx}>
                {resp}
              </li>
            ))}
          </ul>
        </div>

        {/* typicalChallenges */}
        <div className="py-2">
          <p className="font-bold text-lg py-1">Typical Challenges:</p>
          <ul className="list-disc list-inside">
            {selectedJob.typicalChallenges.map((challenge, idx) => (
              <li className="text-lg" key={idx}>
                {challenge}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* careerPath */}
          <div className="py-2">
            <p className="font-bold text-lg py-1">Career Path:</p>
            <ul className="list-disc list-inside">
              {selectedJob.careerPath.map((path, idx) => (
                <li className="text-lg" key={idx}>
                  {path}
                </li>
              ))}
            </ul>
          </div>

          {/* commonCertifications */}
          <div className="py-2">
            <p className="font-bold text-lg py-1">Common Certifications:</p>
            <ul className="list-disc list-inside">
              {selectedJob.commonCertifications.map((cert, idx) => (
                <li className="text-lg" key={idx}>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* potentialIndustries */}
          <div className="py-2">
            <p className="font-bold text-lg py-1">Potential Industries:</p>
            <ul className="list-disc list-inside">
              {selectedJob.potentialIndustries.map((industry, idx) => (
                <li className="text-lg" key={idx}>
                  {industry}
                </li>
              ))}
            </ul>
          </div>

          {/* toolsAndTechnologies */}
          <div className="py-2">
            <p className="font-bold text-lg py-1">Tools and Technologies:</p>
            <ul className="list-disc list-inside">
              {selectedJob.toolsAndTechnologies.map((tool, idx) => (
                <li className="text-lg" key={idx}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* softSkills */}
        <div className="PY-2">
          <p className="font-bold text-lg py-1">Soft Skills:</p>
          <ul className="list-disc list-inside">
            {selectedJob.softSkills.map((skill, idx) => (
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

// Adding prop types validation
ModalSalaryInsights.propTypes = {
  selectedJob: PropTypes.shape({
    jobTitle: PropTypes.string.isRequired,
    averageSalary: PropTypes.string.isRequired,
    globalSalaryRange: PropTypes.object.isRequired,
    experienceLevel: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    education: PropTypes.string.isRequired,
    responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    typicalChallenges: PropTypes.arrayOf(PropTypes.string).isRequired,
    careerPath: PropTypes.arrayOf(PropTypes.string).isRequired,
    commonCertifications: PropTypes.arrayOf(PropTypes.string).isRequired,
    potentialIndustries: PropTypes.arrayOf(PropTypes.string).isRequired,
    toolsAndTechnologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    softSkills: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModalSalaryInsights;
