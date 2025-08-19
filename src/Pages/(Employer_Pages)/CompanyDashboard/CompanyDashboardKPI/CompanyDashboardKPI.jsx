// Packages
import PropTypes from "prop-types";

// Icons
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

// Assets - KPI
import Job from "../../../../assets/EmployerLayout/form.png";
import Gig from "../../../../assets/EmployerLayout/Gig/Gig.png";
import Events from "../../../../assets/EmployerLayout/Events/Events.png";
import Internship from "../../../../assets/EmployerLayout/Internship/Internship.png";

// Functions
import { processMonthlyPostStats } from "../../../../Functions/processMonthlyPostStats";


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
        {[
          { title: "Total Posted Jobs", stats: jobStats, icon: Job, label: "Jobs" },
          { title: "Total Posted Gigs", stats: gigStats, icon: Gig, label: "Gigs" },
          { title: "Total Posted Internships", stats: internshipStats, icon: Internship, label: "Internships" },
          { title: "Total Posted Events", stats: eventStats, icon: Events, label: "Events" },
        ].map(({ title, stats, icon, label }) => (
          <div
            key={title}
            className="border-2 border-gray-300 bg-white rounded-xl shadow hover:shadow-xl space-y-5 py-5 px-5 cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between font-semibold">
              <h3 className="text-gray-500 text-base">{title}</h3>
              <img src={icon} alt={`${label} Icon`} className="w-5 h-5" />
            </div>

            {/* Total */}
            <h3 className="text-black font-semibold text-3xl">{stats.totalPosts}</h3>

            {/* Monthly change */}
            {stats.monthlyChange !== 0 && (
              <div
                className={`${stats.isIncrease ? "text-green-500" : "text-red-500"} flex items-center`}
              >
                {stats.isIncrease ? <FaArrowUp /> : <FaArrowDown />}
                <span className="ml-1">
                  {stats.isIncrease ? "+" : ""}
                  {stats.monthlyChange} {label} since last month
                </span>
              </div>
            )}
          </div>
        ))}
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
