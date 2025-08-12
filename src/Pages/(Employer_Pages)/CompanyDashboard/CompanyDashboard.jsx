// Packages
import { useQuery } from "@tanstack/react-query";

// Assets - KPI
import Job from "../../../assets/EmployerLayout/form.png";
import Gig from "../../../assets/EmployerLayout/Gig/Gig.png";
import Internship from "../../../assets/EmployerLayout/Internship/Internship.png";
import Events from "../../../assets/EmployerLayout/Events/Events.png";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const CompanyDashboard = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Daily Job Status Data
  const {
    data: DailyJobStatusData,
    isLoading: DailyJobStatusIsLoading,
    error: DailyJobStatusError,
    refetch: DailyJobStatusRefetch,
  } = useQuery({
    queryKey: ["DailyJobStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/Jobs/DailyJobPosted?postedBy=${user?.email}`)
        .then((res) => res.data),
  });

  // Calculate total jobs
  const totalJobs =
    DailyJobStatusData?.reduce(
      (total, item) => total + item.DocumentCount,
      0
    ) || 0;

  // Group jobs by month
  const monthlyStats = {};
  DailyJobStatusData?.forEach((item) => {
    const monthKey = item.postedDate.slice(0, 7); // "YYYY-MM"
    monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + item.DocumentCount;
  });

  // Get current and previous month counts
  const sortedMonths = Object.keys(monthlyStats).sort();
  const lastMonthKey = sortedMonths[sortedMonths.length - 1];
  const prevMonthKey = sortedMonths[sortedMonths.length - 2];

  const lastMonthCount = monthlyStats[lastMonthKey] || 0;
  const prevMonthCount = monthlyStats[prevMonthKey] || 0;

  // Calculate change
  const monthlyChange = lastMonthCount - prevMonthCount;
  const isIncrease = monthlyChange >= 0;

  // Refetching Data
  const refetch = async () => {
    await DailyJobStatusRefetch();
  };

  // Loading / Error UI
  if (DailyJobStatusIsLoading || loading) return <Loading />;
  if (DailyJobStatusError) return <Error />;

  console.log("Daily Job Status Data", DailyJobStatusData);

  return (
    <div>
      {/* KPI Summery Title  */}
      <h3 className="text-lg text-black font-bold py-3 px-5">KPI Summery </h3>

      <div className="grid grid-cols-4 gap-4 px-5">
        {/* Card-1 */}
        <div className="border-2 border-gray-300 bg-white rounded-xl shadow hover:shadow-xl space-y-3 py-3 px-5">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold">
            <h3 className="text-gray-500 text-base">Total Posted Jobs</h3>
            <img src={Job} alt="Job Icon" className="w-5 h-5" />
          </div>

          {/* Total */}
          <h3 className="text-black font-semibold text-3xl">{totalJobs}</h3>

          {/* Monthly change */}
          <div
            className={`${
              isIncrease ? "text-green-500" : "text-red-500"
            } flex items-center`}
          >
            {isIncrease ? <FaArrowUp /> : <FaArrowDown />}
            <span className="ml-1">
              {isIncrease ? "+" : ""}
              {monthlyChange} Jobs since last month
            </span>
          </div>
        </div>

        {/* Card-2 */}
        <div className="border-2 border-gray-300 bg-white rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold px-5 py-5">
            {/* Title */}
            <h3 className="text-gray-500 text-base"> Total Gig Posted </h3>

            {/* Icons */}
            <img src={Gig} alt="Gig Icon" className="w-5 h-5" />
          </div>
        </div>

        {/* Card-3 */}
        <div className="border-2 border-gray-300 bg-white rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold px-5 py-5">
            {/* Title */}
            <h3 className="text-gray-500 text-base"> Active Internships </h3>

            {/* Icons */}
            <img src={Internship} alt="Internship Icon" className="w-5 h-5" />
          </div>
        </div>

        {/* Card-4 */}
        <div className="border-2 border-gray-300 bg-white rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold px-5 py-5">
            {/* Title */}
            <h3 className="text-gray-500 text-base"> Upcoming Events </h3>

            {/* Icons */}
            <img src={Events} alt="Events Icon" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
