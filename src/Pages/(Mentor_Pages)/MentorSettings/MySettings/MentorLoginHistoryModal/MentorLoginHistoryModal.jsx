// Packages
import { useQuery } from "@tanstack/react-query";

// Icon
import { ImCross } from "react-icons/im";

// Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";

const MentorLoginHistoryModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // ---------- Mentor Login History Data API ----------
  const {
    data: MentorLoginHistoryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["MentorLoginHistoryData", user?.email],
    queryFn: async () => {
      // Fetch recent 10 records
      const res = await axiosPublic.get(`/LoginHistory?email=${user?.email}`);
      // Cleanup old ones in background (doesn't affect UI)
      axiosPublic
        .delete(`/LoginHistory/cleanup?email=${user?.email}`)
        .catch(() => {});
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Close modal
  const handleClose = () => {
    document.getElementById("Mentor_Login_History_Modal")?.close();
  };

  // Loading and error states
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  // Take only last 10 sorted by loginTime (newest first)
  const recentLogins = [...MentorLoginHistoryData]
    .sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime))
    .slice(0, 10);

  return (
    <div
      id="Mentor_Login_History_Modal"
      className="modal-box max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
    >
      {/* Close */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Header */}
      <h3 className="font-bold text-xl text-center mb-4">
        Recent Login History
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-2" />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Login Time</th>
              <th className="p-3 border">IP Address</th>
              <th className="p-3 border">Device / Browser</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {recentLogins && recentLogins.length > 0 ? (
              recentLogins.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  {/* Login Time */}
                  <td className="p-3 border">
                    {(() => {
                      const date = new Date(record.loginTime);
                      const day = date.toLocaleString("en-US", {
                        day: "2-digit",
                      });
                      const month = date.toLocaleString("en-US", {
                        month: "short",
                      });
                      const year = date.getFullYear();
                      const time = date.toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });
                      return `${day} ${month} ${year} ${time}`;
                    })()}
                  </td>

                  {/* IP Address */}
                  <td className="p-3 border">{record.ip || "N/A"}</td>

                  {/* Device */}
                  <td className="p-3 border truncate max-w-xs">
                    {record.userAgent || "Unknown"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* No login history */}
                <td
                  colSpan={3}
                  className="p-4 text-center text-gray-500 italic border"
                >
                  No login history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-500 mt-4 text-center">
        Showing the 10 most recent logins for{" "}
        <span className="font-medium">{user?.email}</span>
      </p>
    </div>
  );
};

export default MentorLoginHistoryModal;
