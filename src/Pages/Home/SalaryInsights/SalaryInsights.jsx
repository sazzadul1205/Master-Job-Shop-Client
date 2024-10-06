import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";

const SalaryInsights = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const axiosPublic = useAxiosPublic();

  // Fetching SalaryInsightData
  const {
    data: SalaryInsightData,
    isLoading: SalaryInsightDataIsLoading,
    error: SalaryInsightDataError,
  } = useQuery({
    queryKey: ["SalaryInsightData"],
    queryFn: () => axiosPublic.get(`/Salary-Insight`).then((res) => res.data),
  });

  // Loading state
  if (SalaryInsightDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (SalaryInsightDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

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
            <Link to={"/CompanyProfiles"} className="flex items-center">
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
          <div className="modal-box bg-yellow-50 text-black max-w-[800px]">
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
                  {Object.keys(selectedJob.globalSalaryRange).map(
                    (region, idx) => (
                      <li className="text-lg" key={idx}>
                        {region}: {selectedJob.globalSalaryRange[region]}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* experienceLevel */}
              <div className="flex items-center text-lg">
                <p className="font-bold">Experience Level:</p>
                <p className="ml-5">{selectedJob.experienceLevel}</p>
              </div>

              {/* jobType */}
              <div className="flex items-center text-lg">
                <p className="font-bold">Job Type:</p>
                <p className="ml-5">{selectedJob.jobType}</p>
              </div>

              {/* education */}
              <div className="flex items-center text-lg">
                <p className="font-bold">Education:</p>
                <p className="ml-5">{selectedJob.education}</p>
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
                <p className="font-bold text-lg py-1">
                  Tools and Technologies:
                </p>
                <ul className="list-disc list-inside">
                  {selectedJob.toolsAndTechnologies.map((tool, idx) => (
                    <li className="text-lg" key={idx}>
                      {tool}
                    </li>
                  ))}
                </ul>
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
        )}
      </dialog>
    </div>
  );
};

export default SalaryInsights;
