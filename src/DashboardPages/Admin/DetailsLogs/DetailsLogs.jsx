import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import PropTypes from "prop-types";

const logEndpoints = [
  {
    key: "ApplyToJobLogData",
    label: "Apply to Job Log",
    url: "/Apply-To-Job-Log",
  },
  {
    key: "ApplyToGigLogData",
    label: "Apply to Gig Log",
    url: "/Apply-To-Gig-Log",
  },
  {
    key: "ApplyToUpcomingEventLogData",
    label: "Apply to Event Log",
    url: "/Apply-To-Upcoming-Event-Log",
  },
  {
    key: "ApplyToMentorshipLogData",
    label: "Apply to Mentorship Log",
    url: "/Apply-To-Mentorship-Log",
  },
  {
    key: "ReviewToMentorshipLogData",
    label: "Review to Mentorship Log",
    url: "/Review-To-Mentorship-Log",
  },
  {
    key: "ApplyToCourseLogData",
    label: "Apply to Course Log",
    url: "/Apply-To-Course-Log",
  },
  {
    key: "ApplyToInternshipLogData",
    label: "Apply to Internship Log",
    url: "/Apply-To-Internship-Log",
  },
  { key: "DeleteLogData", label: "Delete Log", url: "/Delete-Log" },
  { key: "CombinedLogData", label: "Combined Log", url: null }, // For combined logs
];

const DetailsLogs = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedLog, setSelectedLog] = useState(logEndpoints[0].key);

  const queries = logEndpoints.reduce((acc, { key, url }) => {
    if (url) {
      acc[key] = useQuery({
        queryKey: [key],
        queryFn: () => axiosPublic.get(url).then((res) => res.data),
      });
    }
    return acc;
  }, {});

  const isLoading = Object.values(queries).some(({ isLoading }) => isLoading);
  const isError = Object.values(queries).some(({ error }) => error);

  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Sort logs by timestamp
  const sortLogsByTimestamp = (logs) =>
    logs?.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

  // Handle combined logs
  const combinedLogData = [
    ...sortLogsByTimestamp(queries.ApplyToJobLogData?.data || []),
    ...sortLogsByTimestamp(queries.ApplyToGigLogData?.data || []),
    ...sortLogsByTimestamp(queries.ApplyToUpcomingEventLogData?.data || []),
    ...sortLogsByTimestamp(queries.ApplyToMentorshipLogData?.data || []),
    ...sortLogsByTimestamp(queries.ReviewToMentorshipLogData?.data || []),
    ...sortLogsByTimestamp(queries.ApplyToCourseLogData?.data || []),
    ...sortLogsByTimestamp(queries.ApplyToInternshipLogData?.data || []),
    ...sortLogsByTimestamp(queries.DeleteLogData?.data || []),
  ];

  const selectedLogData =
    selectedLog === "CombinedLogData"
      ? combinedLogData
      : sortLogsByTimestamp(queries[selectedLog]?.data || []);

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Gigs
      </p>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[300px] bg-blue-100 min-h-screen p-4 border border-black">
          <p className="font-bold text-xl mb-4">Log Options</p>
          <ul>
            {logEndpoints.map((log) => (
              <li key={log.key} className="mb-2">
                <button
                  className={`w-full text-left py-4 px-2  ${
                    selectedLog === log.key
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedLog(log.key)}
                >
                  {log.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Log Display */}
        <div className="w-3/4 p-6">
          <p className="text-2xl font-bold mb-6">
            {logEndpoints.find((log) => log.key === selectedLog)?.label}
          </p>
          <div className="space-y-4">
            {selectedLogData?.length ? (
              selectedLogData.map((log) => (
                <LogEntry
                  key={log._id}
                  log={log}
                  type="companyName"
                  logType={selectedLog}
                />
              ))
            ) : (
              <p>No logs available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// LogEntry component
const LogEntry = ({ log, type, logType }) => (
  <div className="p-4 mb-3 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-xl">
    <p className="font-semibold">
      {logType === "DeleteLogData" ? (
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
    {type === "mentorName" && logType !== "DeleteLogData" && (
      <p>Duration: {log.duration}</p>
    )}
    <p className="text-gray-500 text-sm">Applied: {log.appliedDate}</p>
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
    DeletedBy: PropTypes.string,
    deletedContent: PropTypes.string,
    PostedBy: PropTypes.string,
    reason: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
  logType: PropTypes.string.isRequired,
};

export default DetailsLogs;
