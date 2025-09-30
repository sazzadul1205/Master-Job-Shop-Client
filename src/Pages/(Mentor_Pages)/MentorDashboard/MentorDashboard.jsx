import MentorDashboardCards from "./MentorDashboardCards/MentorDashboardCards";

const MentorDashboard = () => {
  return (
    <div>
      {/* Title */}
      <h3 className="text-2xl text-black font-bold mb-4 px-5 py-5">
        Mentor Dashboard
      </h3>
      {/* Cards */}
      <MentorDashboardCards />
    </div>
  );
};

export default MentorDashboard;
