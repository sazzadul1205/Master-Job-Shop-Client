// Packages
import PropTypes from "prop-types";

// Icons
import { LuHandshake } from "react-icons/lu";
import { FaRegMessage } from "react-icons/fa6";
import { FiBook, FiUsers } from "react-icons/fi";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const MentorMenteesCard = ({
  MentorEmailsData = [],
  MentorMessagesData = [],
  courseApplications = [],
  mentorshipApplications = [],
}) => {
  // ---------------------- Counts ----------------------
  const courseCount = courseApplications?.length || 0;
  const mentorshipCount = mentorshipApplications?.length || 0;
  const totalMentees = courseCount + mentorshipCount;

  // total communications (emails + messages)
  const totalComms =
    (MentorEmailsData?.length || 0) + (MentorMessagesData?.length || 0);

  // ---------------------- Month Helpers ----------------------
  const getMonthKeyFromDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // e.g. 2025-09

  const getPrevMonthKey = (d) => {
    const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    return getMonthKeyFromDate(prev);
  };

  const groupByMonth = (apps = [], dateField = "appliedAt") =>
    apps.reduce((acc, app) => {
      if (!app?.[dateField]) return acc;
      const date = new Date(app[dateField]);
      if (isNaN(date)) return acc;
      const key = getMonthKeyFromDate(date);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  // ---------------------- Grouped By Month ----------------------
  const courseByMonth = groupByMonth(courseApplications);
  const mentorByMonth = groupByMonth(mentorshipApplications);
  const totalApplicationsByMonth = { ...courseByMonth };
  Object.entries(mentorByMonth).forEach(([k, v]) => {
    totalApplicationsByMonth[k] = (totalApplicationsByMonth[k] || 0) + v;
  });

  // Communications by month
  const emailsByMonth = groupByMonth(MentorEmailsData, "sentAt");
  const messagesByMonth = groupByMonth(MentorMessagesData, "sentAt");
  const totalCommsByMonth = { ...emailsByMonth };
  Object.entries(messagesByMonth).forEach(([k, v]) => {
    totalCommsByMonth[k] = (totalCommsByMonth[k] || 0) + v;
  });

  // ---------------------- Change Calculations ----------------------
  const now = new Date();
  const currentMonthKey = getMonthKeyFromDate(now);
  const prevMonthKey = getPrevMonthKey(now);

  const getChange = (byMonth, curKey, prevKey) => {
    const cur = byMonth[curKey] || 0;
    const prev = byMonth[prevKey] || 0;
    return { cur, prev, diff: cur - prev };
  };

  const totalMenteesChange = getChange(
    totalApplicationsByMonth,
    currentMonthKey,
    prevMonthKey
  );
  const courseChange = getChange(courseByMonth, currentMonthKey, prevMonthKey);
  const mentorChange = getChange(mentorByMonth, currentMonthKey, prevMonthKey);
  const totalCommsChange = getChange(
    totalCommsByMonth,
    currentMonthKey,
    prevMonthKey
  );

  // ---------------------- Render Helpers ----------------------
  const renderChange = ({ diff }) => {
    if (diff > 0)
      return (
        <div className="flex items-center gap-1 font-semibold text-green-600">
          <AiOutlineArrowUp className="text-base" />
          <span>{`+${diff} from last month`}</span>
        </div>
      );
    if (diff < 0)
      return (
        <div className="flex items-center gap-1 font-semibold text-red-600">
          <AiOutlineArrowDown className="text-base" />
          <span>{`${diff} from last month`}</span>
        </div>
      );
    return <div className="font-semibold text-gray-500">No change</div>;
  };

  // ---------------------- Render ----------------------
  return (
    <div className="grid grid-cols-4 gap-4 px-8 text-black">
      {/* Total Active Mentees */}
      <div className="border bg-white border-gray-300 rounded-lg p-4 space-y-3 py-5 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h3>Total Active Mentees</h3>
          <FiUsers className="text-2xl" />
        </div>
        <p className="font-bold text-4xl py-1.5">{totalMentees || "N/A"}</p>
        {renderChange(totalMenteesChange)}
      </div>

      {/* Mentees In Courses */}
      <div className="border bg-white border-gray-300 rounded-lg p-4 space-y-3 py-5 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h3>Mentees In Courses</h3>
          <FiBook className="text-2xl" />
        </div>
        <p className="font-bold text-4xl py-1.5">{courseCount || "N/A"}</p>
        {renderChange(courseChange)}
      </div>

      {/* Mentees In Mentorship */}
      <div className="border bg-white border-gray-300 rounded-lg p-4 space-y-3 py-5 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h3>Mentees In Mentorship</h3>
          <LuHandshake className="text-2xl" />
        </div>
        <p className="font-bold text-4xl py-1.5">{mentorshipCount || "N/A"}</p>
        {renderChange(mentorChange)}
      </div>

      {/* Total Communications (Emails + Messages) */}
      <div className="border bg-white border-gray-300 rounded-lg p-4 space-y-3 py-5 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h3>Total Communications</h3>
          <FaRegMessage className="text-2xl" />
        </div>
        <p className="font-bold text-4xl py-1.5">{totalComms || "N/A"}</p>
        {renderChange(totalCommsChange)}
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
  MentorEmailsData: PropTypes.array,
  MentorMessagesData: PropTypes.array,
};

export default MentorMenteesCard;
