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
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800">
          Mentorship Insights
        </h3>

        {/* Description */}
        <span className="text-sm text-gray-500">Top applied mentorship</span>
      </div>

      {/* List */}
      {top.length === 0 ? (
        // Fallback
        <div className="py-8 text-center text-gray-500">
          No mentorship data available.
        </div>
      ) : (
        // List of top mentorship
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
                className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-150"
              >
                <div className="flex items-start gap-4">
                  {/* Left: Mentor avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        mentor.profileImage ||
                        "https://via.placeholder.com/64?text=Mentor"
                      }
                      alt={mentor.name || "Mentor"}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  </div>

                  {/* Middle: meta */}
                  <div className="flex-1">
                    {/* Top Part */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {/* Title */}
                        <h4 className="text-md font-semibold text-gray-800">
                          {m.title || "Untitled Mentorship"}
                        </h4>

                        {/* Mentor, Start Date, Duration */}
                        <div className="text-sm text-gray-500 mt-1">
                          {/* Mentor */}
                          <span className="inline-flex items-center gap-2 mr-4">
                            <FiUser className="inline-block" />{" "}
                            {mentor.name || mentor.email || "Unknown Mentor"}
                          </span>

                          {/* Start Date */}
                          <span className="inline-flex items-center gap-2 mr-4">
                            <FiCalendar className="inline-block" />{" "}
                            {formatDate(startDate)}
                          </span>

                          {/* Duration / Sessions */}
                          <span className="inline-flex items-center gap-2">
                            <FiClock className="inline-block" />{" "}
                            {m.durationWeeks
                              ? `${m.durationWeeks}w`
                              : m.sessionsPerWeek
                              ? `${m.sessionsPerWeek}x / week`
                              : "—"}
                          </span>
                        </div>

                        {/* Location & Fee */}
                        <div className="text-sm text-gray-500 mt-2 flex items-center gap-4">
                          {/* Location */}
                          <span className="inline-flex items-center gap-2">
                            <FiMapPin /> {location}
                          </span>
                          {/* Fee */}
                          <span className="inline-flex items-center gap-2">
                            <FiDollarSign /> {fee}
                          </span>
                        </div>
                      </div>

                      {/* Right: total applications */}
                      <div className="text-right">
                        {/* Title */}
                        <div className="text-sm text-gray-500">
                          Applications
                        </div>

                        {/* Count */}
                        <div className="text-2xl font-bold text-gray-900">
                          {item.total}
                        </div>

                        {/* Button */}
                        <button
                          className="mt-3 text-xs inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer "
                          onClick={() => {
                            document
                              .getElementById("Mentorship_Details_Modal")
                              ?.showModal();
                            // FIX: Use the mentorship._id, not item._id
                            setSelectedMentorshipID(m?._id || null);
                          }}
                          type="button"
                        >
                          View details <FiChevronRight />
                        </button>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {/* Accepted Card */}
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

                      {/* Rejected Card */}
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

                      {/* Pending Card */}
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

                    {/* Progress bar for accepted */}
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

      {/* ----- Modal ----- */}
      {/* Mentorship Details Modal */}
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
