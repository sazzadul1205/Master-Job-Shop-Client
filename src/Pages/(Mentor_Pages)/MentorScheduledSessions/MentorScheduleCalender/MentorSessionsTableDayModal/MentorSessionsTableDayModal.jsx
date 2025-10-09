import PropTypes from "prop-types";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";
import { format, setHours, setMinutes } from "date-fns";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";

const MentorSessionsTableDayModal = ({
  selectedDate,
  setSelectedDate,
  selectedEventIds,
  setSelectedEventIds,
}) => {
  const axiosPublic = useAxiosPublic();

  // Step 1: Split IDs by type
  const courseIds = selectedEventIds
    .filter((item) => item.type === "Course")
    .map((item) => item._id);

  const mentorshipIds = selectedEventIds
    .filter((item) => item.type === "Mentorship")
    .map((item) => item._id);

  // Step 2: Courses query
  const {
    data: MyCoursesData = [],
    isLoading: MyCoursesIsLoading,
    error: MyCoursesError,
  } = useQuery({
    queryKey: ["MyCoursesData", courseIds],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Courses?id=${courseIds.join(",")}`);
      return Array.isArray(res.data) ? res.data : [res.data];
    },
    enabled: courseIds.length > 0,
  });

  // Step 3: Mentorship query
  const {
    data: MyMentorshipData = [],
    isLoading: MyMentorshipIsLoading,
    error: MyMentorshipError,
  } = useQuery({
    queryKey: ["MyMentorshipData", mentorshipIds],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Mentorship?id=${mentorshipIds.join(",")}`
      );
      return Array.isArray(res.data) ? res.data : [res.data];
    },
    enabled: mentorshipIds.length > 0,
  });

  // Step 4: Normalize + combine both
  const fullData = [
    ...MyCoursesData.map((course) => ({
      id: course._id,
      type: "course",
      title: course.title || course.name,
      startTime: course.startTime || course.start_date || null,
      endTime: course.endTime || course.end_date || null,
      ...course,
    })),
    ...MyMentorshipData.map((mentorship) => ({
      id: mentorship._id,
      type: "mentorship",
      title: mentorship.title || mentorship.name,
      startTime: mentorship.sessionStartTime || mentorship.start_date || null,
      endTime: mentorship.sessionEndTime || mentorship.end_date || null,
      ...mentorship,
    })),
  ];

  // Derived states
  const isLoadingAll = MyCoursesIsLoading || MyMentorshipIsLoading;
  const errorAll = MyCoursesError || MyMentorshipError;

  // Close Modal
  const handleClose = () => {
    document.getElementById("Mentor_Sessions_Table_Day_Modal")?.close();
    setSelectedDate(null);
    setSelectedEventIds([]);
  };

  // Loading handling
  if (isLoadingAll)
    return (
      <div
        id="Mentor_Sessions_Table_Day_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        <Loading height="min-h-[60vh]" />
      </div>
    );

  // Error handling
  if (errorAll)
    return (
      <div
        id="Mentor_Sessions_Table_Day_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>

        {/* Error Component inside modal */}

        <Error height="min-h-[60vh]" />
      </div>
    );

  // Generate 24-hour times
  const generateTimes = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const date = setHours(setMinutes(new Date(), 0), hour);
      times.push(format(date, "h a"));
    }
    return times;
  };

  // Generate 24-hour times
  const times = generateTimes();

  // Helper: Arrange overlapping sessions
  const arrangeOverlaps = (sessions) => {
    const positioned = [];
    sessions.forEach((session) => {
      const [sh, sm] = session.startTime.split(":").map(Number);
      const [eh, em] = session.endTime.split(":").map(Number);
      const start = sh + sm / 60;
      const end = eh + em / 60;

      let col = 0;
      while (
        positioned.some(
          (s) =>
            s.col === col &&
            ((start >= s.start && start < s.end) ||
              (s.start >= start && s.start < end))
        )
      ) {
        col++;
      }

      positioned.push({ ...session, col, start, end });
    });
    return positioned;
  };

  // Arrange overlapping sessions
  const positionedSessions = arrangeOverlaps(fullData);

  return (
    <div
      id="Mentor_Sessions_Table_Day_Modal"
      className="modal-box bg-white text-black rounded-2xl shadow-2xl p-4 max-w-3xl w-full h-[90vh] flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="relative flex items-center justify-center mb-4">
        {selectedDate && (
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {format(selectedDate, "EEEE, MMMM do, yyyy")}
          </h2>
        )}
        <button
          className="absolute right-0 text-gray-500 hover:text-red-500 rounded-full cursor-pointer transition p-2"
          onClick={handleClose}
          title="Close"
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Divider */}
      <p className="bg-gray-300 h-0.5 my-1 mb-5 mx-8" />

      {/* Timeline Container */}
      <div className="relative flex-1 overflow-y-auto border-l border-gray-300 pl-4 pb-5">
        {/* Hours */}
        {times.map((time, index) => (
          <div key={index} className="relative h-12 border-b border-gray-200">
            <span className="absolute left-0 text-gray-500 text-sm text-right pr-2">
              {time}
            </span>
          </div>
        ))}

        {/* Session Blocks */}
        {positionedSessions.map((session) => {
          // Calculate total overlapping columns for width
          const overlappingCols =
            Math.max(
              ...positionedSessions
                .filter(
                  (s) => s.start < session.end && s.end > session.start // overlaps
                )
                .map((s) => s.col)
            ) + 1;

          const top = session.start * 48; // 48px per hour
          const height = (session.end - session.start) * 48;
          const widthPercent = 100 / overlappingCols;
          const leftPercent = session.col * widthPercent;

          return (
            <div
              key={session.id}
              className="absolute rounded-lg px-2 py-1 ml-17 text-white text-sm font-medium shadow"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                backgroundColor:
                  session.type === "course" ? "#3b82f6" : "#10b981",
              }}
            >
              {session.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Prop Validation
MentorSessionsTableDayModal.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  setSelectedDate: PropTypes.func.isRequired,
  selectedEventIds: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedEventIds: PropTypes.func.isRequired,
};

export default MentorSessionsTableDayModal;
