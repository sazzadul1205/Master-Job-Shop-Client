import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../Pages/Shared/Loader/Loader";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import PropTypes from "prop-types";

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const { label, seconds: intervalSeconds } of intervals) {
    const interval = Math.floor(seconds / intervalSeconds);
    if (interval >= 1)
      return `${interval} ${label}${interval !== 1 ? "s" : ""} ago`;
  }

  return "just now";
};

const LogEntry = ({ log, type, logType }) => (
  <div className="p-4 mb-3 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-xl">
    <p className="font-semibold">
      {logType === "DeleteLog" ? (
        <>
          <span className="text-red-500">Deleted By: {log.DeletedBy}</span>{" "}
          deleted <span className="text-purple-500">{log.deletedContent}</span>{" "}
          posted by <span className="text-blue-500">{log.PostedBy}</span>
          <p>Reason: {log.reason}</p>
        </>
      ) : (
        <>
          <span className="text-blue-500">{log.name}</span> applied for{" "}
          <span className="text-green-500">{log[type]}</span> at{" "}
          <span className="text-purple-500">
            {log.companyName ||
              log.clientName ||
              log.organizer ||
              log.mentorName}
          </span>
        </>
      )}
    </p>
    {type === "mentorName" && logType !== "DeleteLog" && (
      <p>Duration: {log.duration}</p>
    )}
    <p className="text-gray-500 text-sm">
      Applied:{" "}
      {formatTimeAgo(log.appliedDate || log.reviewedDate || log.DeletedDate)}
    </p>
    <p className="text-gray-500 text-xs italic">
      Log Type: <span className="font-semibold">{logType}</span>
    </p>
  </div>
);

LogEntry.propTypes = {
  log: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    companyName: PropTypes.string,
    clientName: PropTypes.string,
    organizer: PropTypes.string,
    mentorName: PropTypes.string,
    duration: PropTypes.string,
    appliedDate: PropTypes.string,
    reviewedDate: PropTypes.string,
    DeletedBy: PropTypes.string,
    deletedContent: PropTypes.string,
    PostedBy: PropTypes.string,
    reason: PropTypes.string,
    DeletedDate: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
  logType: PropTypes.string.isRequired,
};

const LogsComponent = () => {
  const axiosPublic = useAxiosPublic();
  const fetchLogData = (url) => axiosPublic.get(url).then((res) => res.data);

  const logQueries = [
    { key: "JobLog", url: "/Apply-To-Job-Log", type: "jobName" },
    { key: "GigLog", url: "/Apply-To-Gig-Log", type: "gigType" },
    {
      key: "UpcomingEventLog",
      url: "/Apply-To-Upcoming-Event-Log",
      type: "eventTitle",
    },
    {
      key: "MentorshipLog",
      url: "/Apply-To-Mentorship-Log",
      type: "mentorName",
    },
    {
      key: "ReviewMentorshipLog",
      url: "/Review-To-Mentorship-Log",
      type: "mentorName",
    },
    { key: "CourseLog", url: "/Apply-To-Course-Log", type: "CourseName" },
    { key: "InternshipLog", url: "/Apply-To-Internship-Log", type: "position" },
    { key: "DeleteLog", url: "/Delete-Log", type: "Delete" },
  ];

  const logData = logQueries.map(({ key, url }) =>
    useQuery({
      queryKey: [key],
      queryFn: () => fetchLogData(url),
    })
  );

  if (logData.some(({ isLoading }) => isLoading)) return <Loader />;
  if (logData.some(({ error }) => error)) {
    return (
      <div className="text-center text-red-500 font-bold text-2xl">
        Something went wrong while fetching logs.
      </div>
    );
  }

  // Combine all logs into a single array
  const combinedLogs = logData.reduce((acc, { data, isSuccess }, index) => {
    if (isSuccess) {
      const logType = logQueries[index].key; // Update to use key for log type
      const logsWithType = data.map((log) => ({
        ...log,
        type: logQueries[index].type,
        logType,
      })); // Add logType to each log
      return acc.concat(logsWithType);
    }
    return acc;
  }, []);

  // Sort combined logs by appliedDate, reviewedDate, or DeletedDate
  combinedLogs.sort(
    (a, b) =>
      new Date(b.appliedDate || b.reviewedDate || b.DeletedDate) -
      new Date(a.appliedDate || a.reviewedDate || a.DeletedDate)
  );

  // Get the top 10 most recent logs
  const topLogs = combinedLogs.slice(0, 10);

  return (
    <div className="bg-white text-black py-5">
      <div className="border-b border-black flex justify-between items-center m-4">
        <h2 className="text-2xl font-bold pb-4">Logs</h2>
        <button className="bg-green-500 hover:bg-green-600 px-10 py-2 text-white font-bold">
          View Detail Logs
        </button>
      </div>
      <div className="px-5">
        {topLogs.length > 0 ? (
          topLogs.map((log) => (
            <LogEntry
              key={log._id}
              log={log}
              type={log.type}
              logType={log.logType}
            />
          ))
        ) : (
          <p>No logs available.</p>
        )}
      </div>
    </div>
  );
};

export default LogsComponent;
