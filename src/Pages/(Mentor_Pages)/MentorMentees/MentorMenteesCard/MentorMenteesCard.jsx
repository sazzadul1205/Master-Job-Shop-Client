// Packages
import PropTypes from "prop-types";

// Icons
import { LuHandshake } from "react-icons/lu";
import { FaRegMessage } from "react-icons/fa6";
import { FiBook, FiUsers } from "react-icons/fi";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const MentorMenteesCard = ({
  courseApplications = [],
  mentorshipApplications = [],
}) => {
  // safe counts
  const courseCount = courseApplications?.length || 0;
  const mentorshipCount = mentorshipApplications?.length || 0;
  const totalNumber = courseCount + mentorshipCount;

  // helpers for month keys
  const getMonthKeyFromDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // e.g. 2025-09

  const getPrevMonthKey = (d) => {
    // create a date pointing to the 1st of the current month then subtract 1 month
    const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    return getMonthKeyFromDate(prev);
  };

  // group apps array by month key (YYYY-MM)
  const groupByMonth = (apps = []) =>
    apps.reduce((acc, app) => {
      if (!app?.appliedAt) return acc;
      const date = new Date(app.appliedAt);
      if (isNaN(date)) return acc; // ignore invalid dates
      const key = getMonthKeyFromDate(date);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const courseByMonth = groupByMonth(courseApplications || []);
  const mentorByMonth = groupByMonth(mentorshipApplications || []);

  // merge totals
  const mergeCounts = (a = {}, b = {}) => {
    const out = { ...a };
    Object.entries(b).forEach(([k, v]) => {
      out[k] = (out[k] || 0) + v;
    });
    return out;
  };

  const totalByMonth = mergeCounts(courseByMonth, mentorByMonth);

  // current and previous month keys (handles year-rollover)
  const now = new Date();
  const currentMonthKey = getMonthKeyFromDate(now);
  const prevMonthKey = getPrevMonthKey(now);

  const getChange = (byMonth, curKey, prevKey) => {
    const cur = byMonth[curKey] || 0;
    const prev = byMonth[prevKey] || 0;
    const diff = cur - prev; // positive = increase, negative = decrease
    return { cur, prev, diff };
  };

  const totalChange = getChange(totalByMonth, currentMonthKey, prevMonthKey);
  const courseChange = getChange(courseByMonth, currentMonthKey, prevMonthKey);
  const mentorChange = getChange(mentorByMonth, currentMonthKey, prevMonthKey);

  const renderChange = ({ diff }) => {
    if (diff > 0) {
      return (
        <div className="flex items-center gap-1 font-semibold text-green-600">
          <AiOutlineArrowUp className="text-base" />
          <span>{`+${diff} from last month`}</span>
        </div>
      );
    }
    if (diff < 0) {
      return (
        <div className="flex items-center gap-1 font-semibold text-red-600">
          <AiOutlineArrowDown className="text-base" />
          <span>{`${diff} from last month`}</span>
        </div>
      );
    }
    return <div className="font-semibold text-gray-500">No change</div>;
  };

  return (
    <div className="grid grid-cols-4 gap-4 px-8 text-black">
      {/* Total Active Mentees */}
      <div className="border bg-white border-gray-300 rounded-lg p-4 space-y-3 py-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 ">
        <div className="flex items-center justify-between">
          <h3>Total Active Mentees</h3>
          <FiUsers className="text-2xl" />
        </div>

        <p className="font-bold text-4xl py-1.5">{totalNumber || "N/A"}</p>

        {/* change vs last month */}
        {renderChange(totalChange)}
      </div>

      {/* Mentees In Courses */}
      <div className="border bg-white border-gray-300 rounded-lg p-4 space-y-3 py-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 ">
        <div className="flex items-center justify-between">
          <h3>Mentees In Courses</h3>
          <FiBook className="text-2xl" />
        </div>

        <p className="font-bold text-4xl py-1.5">{courseCount || "N/A"}</p>

        {renderChange(courseChange)}
      </div>

      {/* Mentees In Mentorship */}
      <div className="border bg-white border-gray-300 rounded-lg p-4 space-y-3 py-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 ">
        <div className="flex items-center justify-between">
          <h3>Mentees In Mentorship</h3>
          <LuHandshake className="text-2xl" />
        </div>

        <p className="font-bold text-4xl py-1.5">{mentorshipCount || "N/A"}</p>

        {renderChange(mentorChange)}
      </div>

      {/* Pending Messages (placeholder) */}
      <div className="border bg-white border-gray-300 rounded-lg p-4 space-y-3 py-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 ">
        <div className="flex items-center justify-between">
          <h3>Pending Messages</h3>
          <FaRegMessage className="text-2xl" />
        </div>

        <p className="font-bold text-4xl py-1.5">N/A</p>
      </div>
    </div>
  );
};

// Prop Validation
MentorMenteesCard.propTypes = {
  courseApplications: PropTypes.arrayOf(
    PropTypes.shape({
      appliedAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ),
  mentorshipApplications: PropTypes.arrayOf(
    PropTypes.shape({
      appliedAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ),
};

export default MentorMenteesCard;
