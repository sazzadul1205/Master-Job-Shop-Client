// Packages
import PropTypes from "prop-types";

// Icons
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

// ---- Helper Function ----
function getTotalStatus(data, field = "count", showTrend = true) {
  if (!data || data.length === 0) {
    return { value: 0, trend: 0 };
  }

  // ---- Group counts by month (YYYY-MM) ----
  const monthlyTotals = data.reduce((acc, item) => {
    const d = new Date(item.date || item.Date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    let addValue = 0;

    if ("Count" in item || "Date" in item) {
      // Old format
      addValue = item.Count || 0;
    } else {
      // New format (Applications)
      if (field === "count") {
        addValue = item.count || 0;
      } else if (item.detailed && item.detailed[field] !== undefined) {
        addValue = item.detailed[field];
      }
    }

    acc[key] = (acc[key] || 0) + addValue;
    return acc;
  }, {});

  // ---- Sort months ----
  const months = Object.keys(monthlyTotals).sort();
  if (months.length === 0) return { value: 0, trend: 0 };

  const latestMonth = months[months.length - 1];
  const prevMonth = months[months.length - 2];

  const value = monthlyTotals[latestMonth] || 0;
  const trend =
    showTrend && prevMonth ? value - (monthlyTotals[prevMonth] || 0) : 0;

  return { value, trend, latestMonth, prevMonth: prevMonth || null };
}

const DashboardOverviewCards = ({
  MyCoursesStatusData,
  MyMentorshipStatusData,
  MyMentorEmailsStatusData,
  MyNotificationsStatusData,
  MyMentorMessagesStatusData,
  MyCoursesApplicationsStatusData,
  MyMentorshipApplicationsStatusData,
}) => {
  // Get Course stats
  const { value: totalCourses, trend: trendCourses } =
    getTotalStatus(MyCoursesStatusData);

  // Get Mentorship stats
  const { value: totalMentorship, trend: trendMentorship } = getTotalStatus(
    MyMentorshipStatusData
  );

  // Get Course Applications stats
  const { value: totalCourseApplications, trend: trendCourseApplications } =
    getTotalStatus(MyCoursesApplicationsStatusData, "count");

  // Get Mentorship Applications stats
  const {
    value: totalMentorshipApplications,
    trend: trendMentorshipApplications,
  } = getTotalStatus(MyMentorshipApplicationsStatusData, "count");

  // Get Course Accepted Applications stats
  const {
    value: totalCourseAcceptedApplications,
    trend: trendCourseAcceptedApplications,
  } = getTotalStatus(MyCoursesApplicationsStatusData, "accepted");

  // Get Mentorship Accepted Applications stats
  const {
    value: totalMentorshipAcceptedApplications,
    trend: trendMentorshipAcceptedApplications,
  } = getTotalStatus(MyMentorshipApplicationsStatusData, "accepted");

  // Total Mentor Combine Accepted Applications (Total)
  const totalAcceptedApplications =
    (totalCourseAcceptedApplications || 0) +
    (totalMentorshipAcceptedApplications || 0);

  // Trend Mentor Combine Accepted Applications (Trend)
  const trendAcceptedApplications =
    (trendCourseAcceptedApplications || 0) +
    (trendMentorshipAcceptedApplications || 0);

  // Get Mentor Emails stats
  const { value: totalMentorEmails, trend: trendMentorEmails } = getTotalStatus(
    MyMentorEmailsStatusData,
    "count"
  );

  // Get Mentor Messages stats
  const { value: totalMentorMessages, trend: trendMentorMessages } =
    getTotalStatus(MyMentorMessagesStatusData, "count");

  // Get Mentor Notifications stats
  const { value: totalMentorNotifications, trend: trendMentorNotifications } =
    getTotalStatus(MyNotificationsStatusData, "count");

  // Example data (replace with real data later)
  const cards = [
    {
      title: "Total Mentorship's",
      value: totalMentorship,
      trend: trendMentorship,
      icon: <FiUsers className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      title: "Total Courses",
      value: totalCourses,
      trend: trendCourses,
      icon: <FiBook className="w-6 h-6 text-white" />,
      color: "bg-green-500",
    },
    {
      title: "Total Mentorship Applications",
      value: totalCourseApplications,
      trend: trendCourseApplications,
      icon: <FiFileText className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
    },
    {
      title: "Total Course Applications",
      value: totalMentorshipApplications,
      trend: trendMentorshipApplications,
      icon: <FiFileText className="w-6 h-6 text-white" />,
      color: "bg-yellow-500",
    },
    {
      title: "Total Mentees",
      value: totalAcceptedApplications,
      trend: trendAcceptedApplications,
      icon: <FiUsers className="w-6 h-6 text-white" />,
      color: "bg-pink-500",
    },
    {
      title: "Total Notifications",
      value: totalMentorNotifications,
      trend: trendMentorNotifications,
      icon: <FiBell className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    {
      title: "Email Messages",
      value: totalMentorEmails,
      trend: trendMentorEmails,
      icon: <FiMail className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Phone Messages",
      value: totalMentorMessages,
      trend: trendMentorMessages,
      icon: <FiMessageSquare className="w-6 h-6 text-white" />,
      color: "bg-teal-500",
    },
  ];

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5 ">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-xl shadow hover:shadow-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer "
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              {/* Icon */}
              <div
                className={`p-3 rounded-full ${card.color} flex items-center justify-center`}
              >
                {card.icon}
              </div>

              {/* Trend */}
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  card.trend > 0
                    ? "text-green-500"
                    : card.trend < 0
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {card.trend > 0 && <FiArrowUp />}
                {card.trend < 0 && <FiArrowDown />}
                {card.trend > 0
                  ? `${card.trend} since last month`
                  : card.trend < 0
                  ? `${Math.abs(card.trend)} since last month`
                  : "No change since last month"}
              </div>
            </div>

            {/* Card Title */}
            <h4 className="text-gray-500 text-sm font-medium">{card.title}</h4>

            {/* Card Value */}
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

// Prop Validation
DashboardOverviewCards.propTypes = {
  MyCoursesStatusData: PropTypes.arrayOf(PropTypes.object).isRequired,
  MyMentorshipStatusData: PropTypes.arrayOf(PropTypes.object).isRequired,
  MyMentorEmailsStatusData: PropTypes.arrayOf(PropTypes.object).isRequired,
  MyNotificationsStatusData: PropTypes.arrayOf(PropTypes.object).isRequired,
  MyMentorMessagesStatusData: PropTypes.arrayOf(PropTypes.object).isRequired,
  MyCoursesApplicationsStatusData: PropTypes.arrayOf(PropTypes.object)
    .isRequired,
  MyMentorshipApplicationsStatusData: PropTypes.arrayOf(PropTypes.object)
    .isRequired,
};

export default DashboardOverviewCards;
