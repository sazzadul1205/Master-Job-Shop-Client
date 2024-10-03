import SalaryCard from "./SalaryCard/SalaryCard";

const SalaryInsights = () => {
  // Salary data array in JSON format
  const salaryData = [
    {
      jobTitle: "Senior Software Engineer",
      averageSalary: "$120,000 - $150,000",
      location: "Remote, USA",
      experienceLevel: "5-7 years",
      jobType: "Full-Time",
    },
    {
      jobTitle: "Product Manager",
      averageSalary: "$130,000 - $160,000",
      location: "San Francisco, CA, USA",
      experienceLevel: "3-5 years",
      jobType: "Full-Time",
    },
    {
      jobTitle: "Data Analyst",
      averageSalary: "$70,000 - $90,000",
      location: "Austin, TX, USA",
      experienceLevel: "1-3 years",
      jobType: "Part-Time",
    },
    {
      jobTitle: "Marketing Specialist",
      averageSalary: "$60,000 - $80,000",
      location: "Chicago, IL, USA",
      experienceLevel: "1-3 years",
      jobType: "Full-Time",
    },
    {
      jobTitle: "UX/UI Designer",
      averageSalary: "$75,000 - $95,000",
      location: "Los Angeles, CA, USA",
      experienceLevel: "2-4 years",
      jobType: "Contract",
    },
    {
      jobTitle: "DevOps Engineer",
      averageSalary: "$110,000 - $140,000",
      location: "Remote, Boston, MA, USA",
      experienceLevel: "4-6 years",
      jobType: "Full-Time",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-400">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Salary Insights
          </p>
          <p className="text-xl">
            Get an overview of salary ranges for various roles.
          </p>
        </div>

        {/* Salary Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {salaryData.map((salary, index) => (
            <SalaryCard
              key={index}
              jobTitle={salary.jobTitle}
              averageSalary={salary.averageSalary}
              location={salary.location}
              experienceLevel={salary.experienceLevel}
              jobType={salary.jobType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalaryInsights;
