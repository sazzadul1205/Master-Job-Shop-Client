import GigCard from "./GigCard/GigCard";

const FeaturedGigs = () => {
  // Gig data array in JSON format with postedDate in ISO format
  const gigData = [
    {
      gigTitle: "Freelance Graphic Designer",
      clientName: "Creative Agency",
      location: "Remote",
      paymentRate: "$30/hour",
      duration: "Ongoing",
      responsibilities: "Design marketing materials and social media graphics.",
      postedDate: "2024-09-27T14:15:00", // ISO format
    },
    {
      gigTitle: "Event Photographer",
      clientName: "Wedding Planner Co.",
      location: "Los Angeles, CA, USA",
      paymentRate: "$150/event",
      duration: "1 Day",
      responsibilities: "Capture special moments during the event.",
      postedDate: "2024-09-20T09:30:00", // ISO format
    },
    {
      gigTitle: "Content Writer",
      clientName: "Tech Blog",
      location: "Remote",
      paymentRate: "$25/article",
      duration: "4 Weeks",
      responsibilities: "Write articles on technology and trends.",
      postedDate: "2024-09-22T11:00:00", // ISO format
    },
    {
      gigTitle: "Social Media Manager",
      clientName: "Startup Inc.",
      location: "Chicago, IL, USA",
      paymentRate: "$40/hour",
      duration: "3 Months",
      responsibilities: "Manage social media accounts and content strategy.",
      postedDate: "2024-09-15T08:45:00", // ISO format
    },
    {
      gigTitle: "Website Developer",
      clientName: "Local Business",
      location: "Remote",
      paymentRate: "$50/hour",
      duration: "Ongoing",
      responsibilities: "Develop and maintain the company's website.",
      postedDate: "2024-09-28T10:00:00", // ISO format
    },
    {
      gigTitle: "SEO Specialist",
      clientName: "Marketing Agency",
      location: "Remote",
      paymentRate: "$60/hour",
      duration: "2 Months",
      responsibilities: "Optimize website content for search engines.",
      postedDate: "2024-09-25T12:30:00", // ISO format
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-400">
      <div className="max-w-[1200px] mx-auto text-black py-100">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Featured Gigs
          </p>
          <p className="text-xl">
            Explore high-potential commission-based opportunities to boost your
            career and earnings.
          </p>
        </div>

        {/* Gig Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {gigData.map((gig, index) => (
            <GigCard
              key={index}
              gigTitle={gig.gigTitle}
              clientName={gig.clientName}
              location={gig.location}
              paymentRate={gig.paymentRate}
              duration={gig.duration}
              responsibilities={gig.responsibilities}
              postedDate={gig.postedDate} // ISO format
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedGigs;
