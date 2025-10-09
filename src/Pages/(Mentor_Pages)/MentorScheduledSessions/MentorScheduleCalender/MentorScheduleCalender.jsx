import { useState } from "react";

// Packages
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Modals
import MentorSessionsTableDayModal from "./MentorSessionsTableDayModal/MentorSessionsTableDayModal";

const MentorScheduleCalender = ({ MyCoursesData, MyMentorshipData }) => {
  // Today
  const today = new Date();

  // State Management
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEventIds, setSelectedEventIds] = useState([]);

  // Combine and normalize data
  const combinedData = [
    ...(MyCoursesData?.map((course) => ({
      _id: course._id,
      type: "Course",
      sessionDays: course.sessionDays,
      startDate: new Date(course.startDate),
      endDate: new Date(course.endDate),
    })) || []),
    ...(MyMentorshipData?.map((mentorship) => ({
      _id: mentorship._id,
      type: "Mentorship",
      sessionDays: mentorship.sessionDays,
      startDate: new Date(mentorship.startDate),
      endDate: new Date(mentorship.endDate),
    })) || []),
  ];

  // Week Day Map
  const weekDayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  // Get events for a specific date (with _id and type)
  const getEventsForDate = (date) =>
    combinedData
      .filter(
        (event) =>
          date >= event.startDate &&
          date <= event.endDate &&
          event.sessionDays?.some((d) => weekDayMap[d] === date.getDay())
      )
      .map((e) => ({ _id: e._id, type: e.type }));

  // Count events
  const getEventCountForDate = (date) => getEventsForDate(date).length;

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const generateDates = () => {
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(day);
        day = addDays(day, 1);
      }
    }
    return days;
  };

  const dates = generateDates();

  // Handle Date Click
  const handleDateClick = (date) => {
    const events = getEventsForDate(date);
    setSelectedEventIds(events);
    setSelectedDate(date);
    document.getElementById("Mentor_Sessions_Table_Day_Modal").showModal();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mx-8 shadow-sm pb-5">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-8 py-4">
        {/* Previous Month Button */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          title="Previous Month"
        >
          <FaChevronLeft className="text-gray-600 text-lg" />
        </button>

        {/* Current Month */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <p
            className="text-sm text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </p>
        </div>

        {/* Next Month Button */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          title="Next Month"
        >
          <FaChevronRight className="text-gray-600 text-lg" />
        </button>
      </div>

      {/* Divider */}
      <p className="bg-gray-300 h-0.5 my-1 mb-5 mx-8" />

      {/* Days of Week */}
      <div className="grid grid-cols-7 bg-gray-100 text-gray-700 font-semibold rounded-t-2xl border-b border-gray-300 mx-8">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className={`py-3 text-center ${
              index !== 0 ? "border-l border-gray-300" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 bg-white text-gray-700 border rounded-b-2xl mx-8">
        {dates.map((day, index) => {
          const eventCount = getEventCountForDate(day);
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`relative py-4 text-center h-20 cursor-pointer transition-all duration-200 ${
                index % 7 !== 0 ? "border-l border-gray-200" : ""
              } ${index >= 7 ? "border-t border-gray-200" : ""} ${
                !isSameMonth(day, monthStart) ? "text-gray-400" : ""
              } ${
                isSameDay(day, today)
                  ? "bg-blue-100 text-blue-700 font-bold rounded-md"
                  : ""
              } hover:border-blue-600 hover:shadow-md hover:rounded-md hover:bg-blue-50`}
            >
              {format(day, "d")}
              {eventCount > 0 && (
                <span className="absolute top-1 right-1 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {eventCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Day Modal */}
      <dialog id="Mentor_Sessions_Table_Day_Modal" className="modal">
        <MentorSessionsTableDayModal
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedEventIds={selectedEventIds}
          setSelectedEventIds={setSelectedEventIds}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
MentorScheduleCalender.propTypes = {
  MyCoursesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      sessionDays: PropTypes.arrayOf(PropTypes.string),
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ),
  MyMentorshipData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      sessionDays: PropTypes.arrayOf(PropTypes.string),
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ),
};

export default MentorScheduleCalender;
