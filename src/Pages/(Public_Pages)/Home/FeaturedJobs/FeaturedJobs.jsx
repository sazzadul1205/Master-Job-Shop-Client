import { useState } from "react";

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import JobCard from "../../../../Shared/JobCard/JobCard";

const FeaturedJobs = ({ JobsData }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  console.log(selectedJob);

  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Featured Opportunities
            </h2>
            <p className="text-gray-200 mt-2">
              Explore hand-picked roles from top companies
            </p>
          </div>
          <Link
            to="/Jobs"
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Browse All Jobs <FaArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {JobsData?.slice(0, 6).map((job) => (
            <JobCard key={job.slug} job={job} setSelectedJob={setSelectedJob} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
