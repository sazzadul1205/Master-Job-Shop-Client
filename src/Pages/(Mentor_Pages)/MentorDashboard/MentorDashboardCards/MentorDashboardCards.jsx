import {
  FiUsers,
  FiBook,
  FiFileText,
  FiBell,
  FiArrowUp,
  FiArrowDown,
  FiMail,
  FiMessageSquare,
} from "react-icons/fi";

const DashboardOverviewCards = ({
  MyCoursesStatusData,
  MyMentorshipStatusData,
  MyMentorEmailsStatusData,
  MyNotificationsStatusData,
  MyMentorMessagesStatusData,
  MyCoursesApplicationsStatusData,
  MyMentorshipApplicationsStatusData,
}) => {
  console.log("My Courses Status Data", MyCoursesStatusData);
  console.log("My Mentorship Status Data", MyMentorshipStatusData);
  console.log("My Mentor Emails Status Data", MyMentorEmailsStatusData);
  console.log("My Notifications Status Data", MyNotificationsStatusData);
  console.log("My Mentor Messages Status Data", MyMentorMessagesStatusData);
  console.log(
    "My Courses Applications Status Data",
    MyCoursesApplicationsStatusData
  );
  console.log(
    "My Mentorship Applications Status Data",
    MyMentorshipApplicationsStatusData
  );

  // Example data (replace with real data later)
  const cards = [
    {
      title: "Total Mentorship's",
      value: 24,
      trend: 3,
      icon: <FiUsers className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      title: "Total Courses",
      value: 12,
      trend: -2,
      icon: <FiBook className="w-6 h-6 text-white" />,
      color: "bg-green-500",
    },
    {
      title: "Total Mentorship Applications",
      value: 36,
      trend: 5,
      icon: <FiFileText className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
    },
    {
      title: "Total Course Applications",
      value: 18,
      trend: -1,
      icon: <FiFileText className="w-6 h-6 text-white" />,
      color: "bg-yellow-500",
    },
    {
      title: "Total Mentees",
      value: 45,
      trend: 7,
      icon: <FiUsers className="w-6 h-6 text-white" />,
      color: "bg-pink-500",
    },
    {
      title: "Total Notifications",
      value: 8,
      trend: -2,
      icon: <FiBell className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    {
      title: "Email Messages",
      value: 15,
      trend: 4,
      icon: <FiMail className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Phone Messages",
      value: 7,
      trend: -1,
      icon: <FiMessageSquare className="w-6 h-6 text-white" />,
      color: "bg-teal-500",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5 ">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-xl shadow hover:shadow-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer "
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-full ${card.color} flex items-center justify-center`}
              >
                {card.icon}
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  card.trend >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.trend >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                {Math.abs(card.trend)} since last month
              </div>
            </div>

            <h4 className="text-gray-500 text-sm font-medium">{card.title}</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardOverviewCards;
