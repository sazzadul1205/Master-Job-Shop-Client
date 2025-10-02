import { useMemo } from "react";

// Rechart Imports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Packages
import dayjs from "dayjs";
import PropTypes from "prop-types";

const MentorApplicationsChart = ({
  MyCoursesApplicationsStatusData,
  MyMentorshipApplicationsStatusData,
}) => {
  // --- Generate last 30 days ---
  const last30DaysFull = useMemo(() => {
    const today = dayjs();
    return Array.from({ length: 30 }, (_, i) =>
      today.subtract(29 - i, "day").format("DD-MMM-YYYY")
    );
  }, []);

  // --- Aggregate data by Date Course  ---
  const dataByDateCourse = useMemo(() => {
    const map = {};
    MyCoursesApplicationsStatusData.forEach((item) => {
      const date = item.date;
      if (!map[date]) {
        map[date] = { accepted: 0, rejected: 0, pending: 0 };
      }
      map[date].accepted += item.detailed.accepted || 0;
      map[date].rejected += item.detailed.rejected || 0;
      map[date].pending += item.detailed.pending || 0;
    });
    return map;
  }, [MyCoursesApplicationsStatusData]);

  // --- Aggregate data by Date Mentorship  ---
  const dataByDateMentorship = useMemo(() => {
    const map = {};
    MyMentorshipApplicationsStatusData.forEach((item) => {
      const date = item.date;
      if (!map[date]) {
        map[date] = { accepted: 0, rejected: 0, pending: 0 };
      }
      map[date].accepted += item.detailed.accepted || 0;
      map[date].rejected += item.detailed.rejected || 0;
      map[date].pending += item.detailed.pending || 0;
    });
    return map;
  }, [MyMentorshipApplicationsStatusData]);

  // --- Prepare chart data (fill missing dates with 0) ---
  const chartDataCourse = last30DaysFull.map((fullDate) => ({
    fullDate,
    date: dayjs(fullDate, "DD-MMM-YYYY").format("DD-MMM"),
    accepted: dataByDateCourse[fullDate]?.accepted || 0,
    rejected: dataByDateCourse[fullDate]?.rejected || 0,
    pending: dataByDateCourse[fullDate]?.pending || 0,
  }));

  // --- Prepare chart data (fill missing dates with 0) ---
  const chartDataMentorship = last30DaysFull.map((fullDate) => ({
    fullDate,
    date: dayjs(fullDate, "DD-MMM-YYYY").format("DD-MMM"),
    accepted: dataByDateMentorship[fullDate]?.accepted || 0,
    rejected: dataByDateMentorship[fullDate]?.rejected || 0,
    pending: dataByDateMentorship[fullDate]?.pending || 0,
  }));

  return (
    <div className="px-5">
      {/* --- Mentor Course Applications Status (Last 30 Days) */}
      <div className="w-[calc(100%-20px)] h-[400px] bg-white shadow-md mx-[5px] my-5 pb-20 hover:shadow-2xl cursor-default rounded-2xl border border-gray-300">
        <h3 className="text-center text-xl text-black font-semibold mb-4 bg-gray-100 py-4">
          Mentor Course Applications Status (Last 30 Days)
        </h3>
        <ResponsiveContainer
          width="100%"
          height="100%"
          className={"text-black"}
        >
          <LineChart
            data={chartDataCourse}
            margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={50} />
            <YAxis allowDecimals={false} />

            {/* Tooltip with Capitalized Labels */}
            <Tooltip
              formatter={(value, name) => [
                value,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />

            {/* Legend with Capitalized Labels */}
            <Legend
              verticalAlign="top"
              formatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              }
            />

            <Line type="monotone" dataKey="accepted" stroke="#4caf50" />
            <Line type="monotone" dataKey="rejected" stroke="#f44336" />
            <Line type="monotone" dataKey="pending" stroke="#ff9800" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* --- Mentor Mentorship Applications Status (Last 30 Days) */}
      <div className="w-[calc(100%-20px)] h-[400px] bg-white shadow-md mx-[5px] my-5 pb-20 hover:shadow-2xl cursor-default rounded-2xl border border-gray-300">
        <h3 className="text-center text-xl text-black font-semibold mb-4 bg-gray-100 py-4">
          Mentor Mentorship Applications Status (Last 30 Days)
        </h3>
        <ResponsiveContainer
          width="100%"
          height="100%"
          className={"text-black"}
        >
          <LineChart
            data={chartDataMentorship}
            margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={50} />
            <YAxis allowDecimals={false} />

            {/* Tooltip with Capitalized Labels */}
            <Tooltip
              formatter={(value, name) => [
                value,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />

            {/* Legend with Capitalized Labels */}
            <Legend
              verticalAlign="top"
              formatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              }
            />

            <Line type="monotone" dataKey="accepted" stroke="#4caf50" />
            <Line type="monotone" dataKey="rejected" stroke="#f44336" />
            <Line type="monotone" dataKey="pending" stroke="#ff9800" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Prop Validation
MentorApplicationsChart.propTypes = {
  MyCoursesApplicationsStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      courseId: PropTypes.string,
      count: PropTypes.number,
      detailed: PropTypes.shape({
        accepted: PropTypes.number,
        rejected: PropTypes.number,
        pending: PropTypes.number,
      }).isRequired,
    })
  ).isRequired,
  MyMentorshipApplicationsStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      mentorshipId: PropTypes.string,
      count: PropTypes.number,
      detailed: PropTypes.shape({
        accepted: PropTypes.number,
        rejected: PropTypes.number,
        pending: PropTypes.number,
      }).isRequired,
    })
  ).isRequired,
};

export default MentorApplicationsChart;
