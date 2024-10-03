import CompanyCard from "./CompanyCard/CompanyCard ";


const CompanyProfiles = () => {
  // Company data array in JSON format
  const companyData = [
    {
      companyName: "ABC Tech Solutions",
      location: "New York, USA",
      industry: "Technology",
      website: "https://abctechsolutions.com",
      logo: "https://via.placeholder.com/150", // Placeholder logo
      description:
        "Leading provider of tech solutions with a focus on innovation.",
    },
    {
      companyName: "XYZ Innovations",
      location: "San Francisco, CA, USA",
      industry: "Product Development",
      website: "https://xyzinnovations.com",
      logo: "https://via.placeholder.com/150", // Placeholder logo
      description: "Pioneering the future of product design and technology.",
    },
    {
      companyName: "DataGen Corp",
      location: "Austin, TX, USA",
      industry: "Data Analytics",
      website: "https://datagencorp.com",
      logo: "https://via.placeholder.com/150", // Placeholder logo
      description: "Empowering businesses through data-driven solutions.",
    },
    {
      companyName: "Creative Solutions",
      location: "Chicago, IL, USA",
      industry: "Marketing",
      website: "https://creativesolutions.com",
      logo: "https://via.placeholder.com/150", // Placeholder logo
      description: "Your partner in creative marketing strategies.",
    },
    {
      companyName: "DesignWorks",
      location: "Los Angeles, CA, USA",
      industry: "Design",
      website: "https://designworks.com",
      logo: "https://via.placeholder.com/150", // Placeholder logo
      description: "Designing impactful experiences for brands and businesses.",
    },
    {
      companyName: "CloudNet Systems",
      location: "Boston, MA, USA",
      industry: "Cloud Computing",
      website: "https://cloudnetsystems.com",
      logo: "https://via.placeholder.com/150", // Placeholder logo
      description: "Cloud solutions tailored to your business needs.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Company Profiles
          </p>
          <p className="text-xl">
            Discover companies and their career opportunities.
          </p>
        </div>

        {/* Company Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {companyData.map((company, index) => (
            <CompanyCard
              key={index}
              companyName={company.companyName}
              location={company.location}
              industry={company.industry}
              website={company.website}
              logo={company.logo}
              description={company.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfiles;
