import { useState } from "react";

// Packages
import PropTypes from "prop-types";

// Icons
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
} from "react-icons/hi";

// Modals
import MentorshipDetailsModal from "../../../../(Public_Pages)/Home/FeaturedMentorship/MentorshipDetailsModal/MentorshipDetailsModal";

const MentorshipInsights = ({ mentorship = [] }) => {
  // State Variables
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);

  // Defensive: ensure array
  const list = Array.isArray(mentorship) ? mentorship : [];

  // compute counts for each mentorship
  const enriched = list.map((m) => {
    const apps = Array.isArray(m.applications) ? m.applications : [];

    const accepted = apps.filter(
      (a) => String(a.status).toLowerCase() === "accepted"
    ).length;
    const rejected = apps.filter(
      (a) => String(a.status).toLowerCase() === "rejected"
    ).length;
    const pending = apps.filter(
      (a) => String(a.status).toLowerCase() === "pending"
    ).length;
    const total = apps.length;

    return {
      mentorship: m, // keep original mentorship data
      accepted,
      rejected,
      pending,
      total,
    };
  });

  // sort by total applications desc, take top 3
  const top = enriched.sort((a, b) => b.total - a.total).slice(0, 3);

  // helper: format date
  const formatDate = (isoOrStr) => {
    if (!isoOrStr) return "N/A";
    try {
      const d = new Date(isoOrStr);
      return d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoOrStr;
    }
  };

  // progress percentage (accepted / total)
  const pct = (part, total) =>
    total > 0 ? Math.round((part / total) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Mentorship Insights
        </h3>

        {/* Description */}
        <span className="text-sm text-gray-500">Top applied mentorship</span>
      </div>

      {/* List */}
      {top.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-sm sm:text-base">
          No mentorship data available.
        </div>
      ) : (
        <div className="space-y-4">
          {top.map((item, idx) => {
            const m = item.mentorship || {};
            const mentor = m.Mentor || {};
            const startDate = m.startDate || m.postedAt || null;
            const location = m.location
              ? `${m.location.city || ""}${m.location.city ? ", " : ""}${
                  m.location.country || ""
                }`
              : "N/A";
            const fee = m.fee
              ? m.fee.isFree
                ? "Free"
                : `${m.fee.amount} ${m.fee.currency || ""}`
              : "N/A";

            return (
              <div
                key={m._id || idx}
                className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all duration-150"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 self-center sm:self-start">
                    <img
                      src={
                        mentor.profileImage ||
                        "https://via.placeholder.com/64?text=Mentor"
                      }
                      alt={mentor.name || "Mentor"}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                          {m.title || "Untitled Mentorship"}
                        </h4>

                        <div className="text-xs sm:text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1">
                            <FiUser />{" "}
                            {mentor.name || mentor.email || "Unknown"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FiCalendar /> {formatDate(startDate)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FiClock />{" "}
                            {m.durationWeeks
                              ? `${m.durationWeeks}w`
                              : m.sessionsPerWeek
                              ? `${m.sessionsPerWeek}x / week`
                              : "—"}
                          </span>
                        </div>

                        <div className="text-xs sm:text-sm text-gray-500 mt-2 flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-1">
                            <FiMapPin /> {location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FiDollarSign /> {fee}
                          </span>
                        </div>
                      </div>

                      {/* Right side: Applications */}
                      <div className="text-right">
                        <div className="text-xs sm:text-sm text-gray-500">
                          Applications
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">
                          {item.total}
                        </div>
                        <button
                          className="mt-2 sm:mt-3 text-xs sm:text-sm inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all"
                          onClick={() => {
                            document
                              .getElementById("Mentorship_Details_Modal")
                              ?.showModal();
                            setSelectedMentorshipID(m?._id || null);
                          }}
                          type="button"
                        >
                          View <FiChevronRight />
                        </button>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Accepted */}
                      <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                            <HiOutlineCheckCircle className="w-5 h-5" />
                            Accepted
                          </div>
                          <div className="text-lg font-semibold text-green-800">
                            {item.accepted}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-green-600">
                          {pct(item.accepted, item.total)}%
                        </div>
                      </div>

                      {/* Rejected */}
                      <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-red-700 font-medium">
                            <HiOutlineXCircle className="w-5 h-5" />
                            Rejected
                          </div>
                          <div className="text-lg font-semibold text-red-800">
                            {item.rejected}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-red-600">
                          {pct(item.rejected, item.total)}%
                        </div>
                      </div>

                      {/* Pending */}
                      <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-yellow-700 font-medium">
                            <HiOutlineClock className="w-5 h-5" />
                            Pending
                          </div>
                          <div className="text-lg font-semibold text-yellow-800">
                            {item.pending}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-yellow-600">
                          {pct(item.pending, item.total)}%
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Acceptance rate</span>
                        <span>{pct(item.accepted, item.total)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-green-500"
                          style={{
                            width: `${pct(item.accepted, item.total)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          isEditor={true}
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>
    </div>
  );
};

// Prop Types
MentorshipInsights.propTypes = {
  mentorship: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      startDate: PropTypes.string,
      postedAt: PropTypes.string,
      durationWeeks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sessionsPerWeek: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      location: PropTypes.shape({
        city: PropTypes.string,
        country: PropTypes.string,
      }),
      fee: PropTypes.shape({
        isFree: PropTypes.bool,
        amount: PropTypes.number,
        currency: PropTypes.string,
      }),
      Mentor: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        profileImage: PropTypes.string,
      }),
      applications: PropTypes.arrayOf(
        PropTypes.shape({
          status: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};

export default MentorshipInsights;
