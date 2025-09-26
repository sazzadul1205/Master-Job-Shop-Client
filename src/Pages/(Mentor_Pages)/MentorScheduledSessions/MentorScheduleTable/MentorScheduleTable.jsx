import { format } from "date-fns";
import PropTypes from "prop-types";

const MentorScheduleTable = ({ MyCoursesData, MyMentorshipData }) => {
  // Normalize and combine data
  const combinedData = [
    ...(MyCoursesData?.map((course) => ({
      _id: course._id,
      title: course.title,
      type: "Course",
      startDate: course.startDate,
      endDate: course.endDate,
      startTime: course.startTime,
      endTime: course.endTime,
      sessionDays: course.sessionDays,
      publishDate: course.startDate, // use startDate for sorting
    })) || []),
    ...(MyMentorshipData?.map((mentorship) => ({
      _id: mentorship._id,
      title: mentorship.title,
      type: "Mentorship",
      startDate: mentorship.startDate,
      endDate: mentorship.endDate,
      startTime: mentorship.sessionStartTime,
      endTime: mentorship.sessionEndTime,
      sessionDays: mentorship.sessionDays,
      publishDate: mentorship.startDate, // use startDate for sorting
    })) || []),
  ];

  // Sort by start date ascending
  const sortedData = combinedData.sort(
    (a, b) => new Date(a.publishDate) - new Date(b.publishDate)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl mx-8 shadow-sm pb-5 my-5 text-black">
      {/* Table Title */}
      <h3 className="text-xl font-semibold text-gray-800 px-6 py-4">
        My Scheduled Sessions
      </h3>

      {/* Divider */}
      <p className="bg-gray-300 h-0.5 my-1 mb-5 mx-8" />

      {/* Table */}
      <div className="overflow-x-auto mx-8 rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left border-collapse">
          {/* Table Header */}
          <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
            <tr>
              <th className="px-6 py-3 border-r">#</th>
              <th className="px-6 py-3 border-r">Title</th>
              <th className="px-6 py-3 border-r">Type</th>
              <th className="px-6 py-3 border-r">Start Date</th>
              <th className="px-6 py-3 border-r">End Date</th>
              <th className="px-6 py-3 border-r">Time</th>
              <th className="px-6 py-3">Days</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {/* Index */}
                <td className="px-6 py-3">{index + 1}</td>

                {/* Title */}
                <td className="px-6 py-3">{item.title}</td>

                {/* Type */}
                <td className="px-6 py-3">{item.type}</td>

                {/* Start Date */}
                <td className="px-6 py-3">
                  {item.startDate
                    ? format(new Date(item.startDate), "dd MMM yyyy")
                    : "N/A"}
                </td>

                {/* End Date */}
                <td className="px-6 py-3">
                  {item.endDate
                    ? format(new Date(item.endDate), "dd MMM yyyy")
                    : "N/A"}
                </td>

                {/* Start Time - End Time */}
                <td className="px-6 py-3">
                  {item.startTime
                    ? format(
                        new Date(`1970-01-01T${item.startTime}`),
                        "hh:mm a"
                      )
                    : "N/A"}{" "}
                  -{" "}
                  {item.endTime
                    ? format(new Date(`1970-01-01T${item.endTime}`), "hh:mm a")
                    : "N/A"}
                </td>

                {/* Days */}
                <td className="px-6 py-3">{item.sessionDays?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Prop validation
MentorScheduleTable.propTypes = {
  MyCoursesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      sessionDays: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  MyMentorshipData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      sessionStartTime: PropTypes.string,
      sessionEndTime: PropTypes.string,
      sessionDays: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default MentorScheduleTable;
