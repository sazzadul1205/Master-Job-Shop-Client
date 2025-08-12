// Packages
import PropTypes from "prop-types";

// Icons
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

// Assets - KPI
import Job from "../../../../assets/EmployerLayout/form.png";
import Gig from "../../../../assets/EmployerLayout/Gig/Gig.png";
import Events from "../../../../assets/EmployerLayout/Events/Events.png";
import Internship from "../../../../assets/EmployerLayout/Internship/Internship.png";

// Processes an array of post data to calculate total posts, monthly change, and growth trend.
function processMonthlyPostStats(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      totalPosts: 0,
      monthlyChange: 0,
      isIncrease: false,
      lastMonthCount: 0,
      prevMonthCount: 0,
    };
  }

  // Total posts across all months
  const totalPosts = data.reduce(
    (total, item) => total + item.DocumentCount,
    0
  );

  // Group post counts by month (YYYY-MM)
  const monthlyStats = {};
  data.forEach((item) => {
    const monthKey = item.postedDate.slice(0, 7); // Extract month key
    monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + item.DocumentCount;
  });

  // Sort months in ascending order to find last two
  const sortedMonths = Object.keys(monthlyStats).sort();
  const lastMonthKey = sortedMonths[sortedMonths.length - 1];
  const prevMonthKey = sortedMonths[sortedMonths.length - 2];

  // Get counts for last and previous month
  const lastMonthCount = monthlyStats[lastMonthKey] || 0;
  const prevMonthCount = monthlyStats[prevMonthKey] || 0;

  // Calculate change and determine trend direction
  const monthlyChange = lastMonthCount - prevMonthCount;
  const isIncrease = monthlyChange >= 0;

  return {
    totalPosts,
    monthlyChange,
    isIncrease,
    lastMonthCount,
    prevMonthCount,
  };
}

const CompanyDashboardKPI = ({
  DailyJobStatusData,
  DailyGigStatusData,
  DailyEventStatusData,
  DailyInternshipStatusData,
}) => {
  // Process data separately
  const jobStats = processMonthlyPostStats(DailyJobStatusData);
  const gigStats = processMonthlyPostStats(DailyGigStatusData);
  const eventStats = processMonthlyPostStats(DailyEventStatusData);
  const internshipStats = processMonthlyPostStats(DailyInternshipStatusData);

  return (
    <div>
      {/* KPI Summary Title */}
      <h3 className="text-lg text-black font-bold py-3 px-5">KPI Summary</h3>

      {/* Containers */}
      <div className="grid grid-cols-4 gap-4 px-5">
        {/* Jobs Card */}
        <div className="border-2 border-gray-300 bg-white rounded-xl shadow hover:shadow-xl space-y-5 py-5 px-5 cursor-default">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold">
            <h3 className="text-gray-500 text-base">Total Posted Jobs</h3>
            <img src={Job} alt="Job Icon" className="w-5 h-5" />
          </div>

          {/* Total */}
          <h3 className="text-black font-semibold text-3xl">
            {jobStats.totalPosts}
          </h3>

          {/* Monthly change */}
          {jobStats.monthlyChange !== 0 && (
            <div
              className={`${
                jobStats.isIncrease ? "text-green-500" : "text-red-500"
              } flex items-center`}
            >
              {jobStats.isIncrease ? <FaArrowUp /> : <FaArrowDown />}
              <span className="ml-1">
                {jobStats.isIncrease ? "+" : ""}
                {jobStats.monthlyChange} Jobs since last month
              </span>
            </div>
          )}
        </div>

        {/* Gigs Card */}
        <div className="border-2 border-gray-300 bg-white rounded-xl shadow hover:shadow-xl space-y-5 py-5 px-5 cursor-default">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold">
            <h3 className="text-gray-500 text-base">Total Posted Gigs</h3>
            <img src={Gig} alt="Gig Icon" className="w-5 h-5" />
          </div>

          {/* Total */}
          <h3 className="text-black font-semibold text-3xl">
            {gigStats.totalPosts}
          </h3>

          {/* Monthly change */}
          {gigStats.monthlyChange !== 0 && (
            <div
              className={`${
                gigStats.isIncrease ? "text-green-500" : "text-red-500"
              } flex items-center`}
            >
              {gigStats.isIncrease ? <FaArrowUp /> : <FaArrowDown />}
              <span className="ml-1">
                {gigStats.isIncrease ? "+" : ""}
                {gigStats.monthlyChange} Gigs since last month
              </span>
            </div>
          )}
        </div>

        {/* Internship Card */}
        <div className="border-2 border-gray-300 bg-white rounded-xl shadow hover:shadow-xl space-y-5 py-5 px-5 cursor-default">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold">
            <h3 className="text-gray-500 text-base">
              Total Posted Internships
            </h3>
            <img src={Internship} alt="Internship Icon" className="w-5 h-5" />
          </div>

          {/* Total */}
          <h3 className="text-black font-semibold text-3xl">
            {internshipStats.totalPosts}
          </h3>

          {/* Monthly change */}
          {internshipStats.monthlyChange !== 0 && (
            <div
              className={`${
                internshipStats.isIncrease ? "text-green-500" : "text-red-500"
              } flex items-center`}
            >
              {internshipStats.isIncrease ? <FaArrowUp /> : <FaArrowDown />}
              <span className="ml-1">
                {internshipStats.isIncrease ? "+" : ""}
                {internshipStats.monthlyChange} Internships since last month
              </span>
            </div>
          )}
        </div>

        {/* Events Card */}
        <div className="border-2 border-gray-300 bg-white rounded-xl shadow hover:shadow-xl space-y-5 py-5 px-5 cursor-default">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold">
            <h3 className="text-gray-500 text-base">Total Posted Events</h3>
            <img src={Events} alt="Events Icon" className="w-5 h-5" />
          </div>

          {/* Total */}
          <h3 className="text-black font-semibold text-3xl">
            {eventStats.totalPosts}
          </h3>

          {/* Monthly change */}
          {eventStats.monthlyChange !== 0 && (
            <div
              className={`${
                eventStats.isIncrease ? "text-green-500" : "text-red-500"
              } flex items-center`}
            >
              {eventStats.isIncrease ? <FaArrowUp /> : <FaArrowDown />}
              <span className="ml-1">
                {eventStats.isIncrease ? "+" : ""}
                {eventStats.monthlyChange} Events since last month
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
CompanyDashboardKPI.propTypes = {
  DailyJobStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      postedDate: PropTypes.string.isRequired,
      DocumentCount: PropTypes.number.isRequired,
    })
  ),
  DailyGigStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      postedDate: PropTypes.string.isRequired,
      DocumentCount: PropTypes.number.isRequired,
    })
  ),
  DailyEventStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      postedDate: PropTypes.string.isRequired,
      DocumentCount: PropTypes.number.isRequired,
    })
  ),
  DailyInternshipStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      postedDate: PropTypes.string.isRequired,
      DocumentCount: PropTypes.number.isRequired,
    })
  ),
};

export default CompanyDashboardKPI;
