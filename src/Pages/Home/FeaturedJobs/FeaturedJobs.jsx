import JobCard from "./JobCard/JobCard";

const FeaturedJobs = () => {
  // Job data array in JSON format
  const jobData = [
    {
      jobTitle: "Senior Software Engineer",
      companyName: "ABC Tech Solutions",
      location: "Remote, New York, USA",
      jobType: "Full-Time",
      salary: "$120,000 - $150,000 per year",
      postedDate: "2024-09-27T14:15:00", // ISO format
    },
    {
      jobTitle: "Product Manager",
      companyName: "XYZ Innovations",
      location: "San Francisco, CA, USA",
      jobType: "Full-Time",
      salary: "$130,000 - $160,000 per year",
      postedDate: "2024-09-20T09:30:00",
    },
    {
      jobTitle: "Data Analyst",
      companyName: "DataGen Corp",
      location: "Austin, TX, USA",
      jobType: "Part-Time",
      salary: "$40,000 - $50,000 per year",
      postedDate: "2024-09-22T12:45:00",
    },
    {
      jobTitle: "Marketing Specialist",
      companyName: "Creative Solutions",
      location: "Chicago, IL, USA",
      jobType: "Full-Time",
      salary: "$60,000 - $80,000 per year",
      postedDate: "2024-09-15T08:00:00",
    },
    {
      jobTitle: "UX/UI Designer",
      companyName: "DesignWorks",
      location: "Los Angeles, CA, USA",
      jobType: "Contract",
      salary: "$70,000 - $90,000 per year",
      postedDate: "2024-09-29T18:00:00",
    },
    {
      jobTitle: "DevOps Engineer",
      companyName: "CloudNet Systems",
      location: "Remote, Boston, MA, USA",
      jobType: "Full-Time",
      salary: "$110,000 - $140,000 per year",
      postedDate: "2024-09-26T11:10:00",
    },
  ];



  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-20">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className=" text-5xl font-bold italic text-blue-700">
            Featured Jobs
          </p>
          <p className="text-xl">Find your dream job and help yourself</p>
        </div>

        {/* Job Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {jobData.map((job, index) => (
            <JobCard
              key={index}
              jobTitle={job.jobTitle}
              companyName={job.companyName}
              location={job.location}
              jobType={job.jobType}
              salary={job.salary}
              postedDate={job.postedDate} // Format the posted date
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedJobs;
