import { useMemo, useState } from "react";

// Packages
import PropTypes from "prop-types";

// ReCharts imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EmployerDashboardApplicationOverview = ({
  DailyBidsStatus,
  DailyApplicationsStatus,
}) => {
  // State: current date range (default = 7 days)
  const [range, setRange] = useState(7);

  //  Utility: Returns an array of the last `n` days with:
  const getLastNDays = (n) => {
    const days = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        raw: date.toISOString().split("T")[0], // YYYY-MM-DD
        label: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }
    return days;
  };

  //  Memoized chart Data :
  const mergedData = useMemo(() => {
    const lastNDays = getLastNDays(range);

    return lastNDays.map(({ raw, label }) => {
      const gig = DailyBidsStatus.find((d) => d.Date === raw)?.bids || 0;
      const event =
        DailyApplicationsStatus.find((d) => d.Date === raw)
          ?.applications || 0;

      return {
        date: label,
        "Gig Bids": gig,
        "Event Applications": event,
      };
    });
  }, [
    range,
    DailyBidsStatus,
    DailyApplicationsStatus
  ]);

  console.log(DailyBidsStatus);


  return (
    <div className="bg-white border border-gray-300 shadow-lg rounded mt-5 mx-5 p-5 h-[450px] text-black">
      {/* Header section with title and date range filter */}
      <div className="flex items-center justify-between mb-4">
        {/* Title */}
        <h3 className="text-lg text-black font-bold">
          Applications Overview ({range} Days)
        </h3>

        {/* Select Dropdown */}
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="border border-gray-300 bg-white text-black rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
          <option value={365}>Last Year</option>
        </select>
      </div>

      {/* Chart container */}
      <ResponsiveContainer width="100%" height="100%" className={"pb-10"}>
        <BarChart
          data={mergedData}
          margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
        >
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X-axis uses formatted date labels */}
          <XAxis dataKey="date" />

          {/* Y-axis auto scales to values */}
          <YAxis />

          {/* Tooltip on hover */}
          <Tooltip />

          {/* Legend for the bars */}
          <Legend />

          {/* Bars for each dataset */}
          <Bar dataKey="Gig Bids" fill="#8884d8" />
          <Bar dataKey="Event Applications" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// PropTypes Validation
EmployerDashboardApplicationOverview.propTypes = {
  DailyBidsStatus: PropTypes.arrayOf(
    PropTypes.shape({
      Date: PropTypes.string.isRequired,
      bids: PropTypes.number.isRequired,
    })
  ).isRequired,
  DailyApplicationsStatus: PropTypes.arrayOf(
    PropTypes.shape({
      Date: PropTypes.string.isRequired,
      applications: PropTypes.number.isRequired,
    })
  ).isRequired,
};


export default EmployerDashboardApplicationOverview;