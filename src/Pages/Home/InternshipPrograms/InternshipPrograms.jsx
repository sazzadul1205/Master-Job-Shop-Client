import InternshipCard from "./InternshipCard/InternshipCard";

const InternshipPrograms = () => {
  // Sample data for internships
  const internshipData = [
    {
      companyName: "TechCorp",
      companyLogo: "https://i.ibb.co/XYZ123/TechCorp-Logo.jpg",
      position: "Software Engineer Intern",
      duration: "12 weeks",
      description:
        "Gain hands-on experience in software development and work on real-world projects.",
    },
    {
      companyName: "DataX",
      companyLogo: "https://i.ibb.co/XYZ456/DataX-Logo.jpg",
      position: "Data Analyst Intern",
      duration: "10 weeks",
      description:
        "Work with data science teams, learn to analyze data, and generate meaningful insights.",
    },
    {
      companyName: "CreativeLabs",
      companyLogo: "https://i.ibb.co/XYZ789/CreativeLabs-Logo.jpg",
      position: "Graphic Design Intern",
      duration: "8 weeks",
      description:
        "Design marketing materials, learn about branding, and create visual content.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-300">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top Section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Internship Programs
          </p>
          <p className="text-xl">
            Explore internship opportunities to kickstart your career.
          </p>
        </div>

        {/* Internship Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {internshipData.map((internship, index) => (
            <InternshipCard
              key={index}
              companyLogo={internship.companyLogo}
              companyName={internship.companyName}
              position={internship.position}
              duration={internship.duration}
              description={internship.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternshipPrograms;
