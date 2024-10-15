import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";

const ModalViewCourse = ({ courseData }) => {
  return (
    <div className="modal-box bg-white max-w-[1000px] p-0 pb-10">
      {/* Top part */}
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p className="font-bold text-xl">View Course Details</p>
        <button
          onClick={() => document.getElementById("Modal_Course_View").close()}
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <div className="px-5">
        <div className="py-1">
          {/* Course Title and Description */}
          <h1 className="text-3xl font-bold mb-4">{courseData?.courseTitle}</h1>
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold">Instructor:</span>{" "}
            {courseData?.instructor}
          </p>
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold">Duration:</span>{" "}
            {courseData?.duration}
          </p>
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold">Level:</span> {courseData?.level}
          </p>
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold">Format:</span> {courseData?.format}
          </p>
          <p className="text-xl mt-4">
            <strong className="mr-5">Description:</strong>{" "}
            {courseData?.description}
          </p>

          {/* Prerequisites */}
          <div>
            <h2 className="text-xl font-bold mt-6">Prerequisites</h2>
            <ul className="list-disc ml-5">
              {courseData?.prerequisites.map((item, index) => (
                <li key={index} className="text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Outcomes */}
          <div>
            <h2 className="text-xl font-bold mt-6">Learning Outcomes</h2>
            <ul className="list-disc ml-5">
              {courseData?.learningOutcomes.map((item, index) => (
                <li key={index} className="text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Course Schedule */}
          <h2 className="text-xl font-bold mt-6">Course Schedule</h2>
          <table className="w-full text-left border-collapse mt-4">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border-b-2 border-gray-300 p-2">Week</th>
                <th className="border-b-2 border-gray-300 p-2">Topic</th>
              </tr>
            </thead>
            <tbody>
              {courseData?.schedule.map((item) => (
                <tr
                  key={item.week}
                  className="odd:bg-blue-100 even:bg-blue-200"
                >
                  <td className="border-b border-gray-300 p-2">{item.week}</td>
                  <td className="border-b border-gray-300 p-2">{item.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Assessments */}
          <h2 className="text-xl font-bold mt-6">Assessments</h2>
          <ul className="list-disc ml-5">
            {courseData?.assessments.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>

          {/* Target Audience */}
          <h2 className="text-xl font-bold mt-6">Target Audience</h2>
          <ul className="list-disc ml-5">
            {courseData?.targetAudience.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>

          {/* Certification */}
          <h2 className="text-xl font-bold mt-6">Certification</h2>
          <p className="text-lg">{courseData?.certification}</p>

          {/* Support */}
          <h2 className="text-xl font-bold mt-6">Support</h2>
          <p className="text-lg">
            <strong>Office Hours:</strong> {courseData?.support?.officeHours}
          </p>
          <p className="text-lg">
            <strong>Discussion Forum:</strong>{" "}
            {courseData?.support?.discussionForum}
          </p>

          {/* Available Batches */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Available Batches</h2>
            <div className="grid grid-cols-5 gap-5 mt-2">
              {courseData?.batches.map((batch, index) => (
                <div
                  key={index}
                  className="text-lg bg-gradient-to-bl from-blue-300 to-blue-50 p-5 hover:shadow-xl"
                >
                  <strong className="text-xl">{batch.batchName}</strong>
                  <p className="py-1">{batch.batchDate}</p>
                  <p className="py-1">{batch.batchDetails}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Applicants */}
          <div className="overflow-x-auto mt-5">
            <h3 className="text-2xl font-bold mb-3">
              Participant Applications
            </h3>
            <table className="table border border-black">
              <thead className="text-black">
                <tr className="bg-gray-500 text-white">
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Description</th>
                  <th>State</th>
                  <th>Date</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {courseData?.applicants?.map((application) => (
                  <tr key={application._id}>
                    <td>{application.applicantName}</td>
                    <td>{application.applicantEmail}</td>
                    <td>{application.applicantDescription}</td>
                    <td>{application.batch}</td>
                    <td>{application.registrationDate}</td>
                    <td>
                      <img
                        src={application.applicantImage}
                        alt="Applicant"
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalViewCourse.propTypes = {
  courseData: PropTypes.shape({
    courseTitle: PropTypes.string,
    instructor: PropTypes.string,
    duration: PropTypes.string,
    level: PropTypes.string,
    format: PropTypes.string,
    description: PropTypes.string,
    prerequisites: PropTypes.arrayOf(PropTypes.string),
    learningOutcomes: PropTypes.arrayOf(PropTypes.string),
    schedule: PropTypes.arrayOf(
      PropTypes.shape({
        week: PropTypes.string,
        topic: PropTypes.string,
      })
    ),
    assessments: PropTypes.arrayOf(PropTypes.string),
    targetAudience: PropTypes.arrayOf(PropTypes.string),
    certification: PropTypes.string,
    support: PropTypes.shape({
      officeHours: PropTypes.string,
      discussionForum: PropTypes.string,
    }),
    batches: PropTypes.arrayOf(
      PropTypes.shape({
        batchName: PropTypes.string,
        batchDate: PropTypes.string,
        batchDetails: PropTypes.string,
      })
    ),
    applicants: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        applicantName: PropTypes.string,
        applicantEmail: PropTypes.string,
        applicantDescription: PropTypes.string,
        batch: PropTypes.string,
        registrationDate: PropTypes.string,
        applicantImage: PropTypes.string,
      })
    ),
  }),
};

export default ModalViewCourse;
