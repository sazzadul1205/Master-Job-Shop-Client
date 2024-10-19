import { FaRegTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const CourseData = ({ courseData }) => {
  const axiosPublic = useAxiosPublic();
  const [participants, setParticipants] = useState([]);

  // Set participants state from courseData on component mount
  useEffect(() => {
    if (courseData?.applicants) {
      setParticipants(courseData.applicants);
    }
  }, [courseData]);

  // Delete the participant
  const handleDelete = async (index) => {
    const applicantToDelete = participants[index];

    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${applicantToDelete.applicantName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      // Remove the participant from the local state
      const newParticipants = participants.filter((_, i) => i !== index);
      setParticipants(newParticipants);

      // API call to delete the participant using applicantEmail
      try {
        await axiosPublic.delete(
          `/Courses/${courseData?._id}/participants/${applicantToDelete.applicantEmail}`
        );

        // Show success alert
        Swal.fire({
          title: "Deleted!",
          text: "Participant has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error deleting participant:", error);
        Swal.fire({
          title: "Error!",
          text: "Could not delete participant.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="px-5 py-5">
      {/* Course Title and Description */}
      <h1 className="text-3xl font-bold mb-4">{courseData?.courseTitle}</h1>
      <div className="text-xl flex ">
        <span className="font-semibold w-32">Instructor:</span>{" "}
        {courseData?.instructor}
      </div>
      <div className="text-xl flex ">
        <span className="font-semibold w-32">Duration:</span>{" "}
        {courseData?.duration}
      </div>
      <div className="text-xl flex ">
        <span className="font-semibold w-32">Level:</span> {courseData?.level}
      </div>
      <div className="text-xl flex ">
        <span className="font-semibold w-32">Format:</span> {courseData?.format}
      </div>
      <div className="text-xl mt-4">
        <strong className="mr-5">Description:</strong> {courseData?.description}
      </div>

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
            <th className="border-b-2 border-gray-300 p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {courseData?.schedule.map((item) => (
            <tr key={item.week} className="odd:bg-blue-100 even:bg-blue-200">
              <td className="border-b border-gray-300 p-2">{item.week}</td>
              <td className="border-b border-gray-300 p-2">{item.topic}</td>
              <td className="border-b border-gray-300 p-2">
                {item.scheduleDetails}
              </td>
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

      {/* Batches */}
      <p className="text-xl font-bold py-3">Batches : </p>
      <div className="space-y-3 mt-2">
        {courseData?.batches.map((batch, index) => (
          <div
            key={index}
            className="relative text-lg border border-dashed border-black p-5 hover:shadow-xl overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-300 to-transparent transform -translate-x-full -translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0"></div>
            <div className="flex relative z-10">
              <p className="font-bold w-32">Batch Name</p>
              <span>{batch.batchName}</span>
            </div>
            <div className="flex relative z-10">
              <p className="font-bold w-32">Start Date</p>
              <span>{batch.batchDate}</span>
            </div>
            <div className="flex relative z-10">
              <p className="font-bold w-32">Details</p>
              <span>{batch.batchDetails}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Applicants */}
      <div className="overflow-x-auto mt-5">
        <h3 className="text-2xl font-bold mb-3">Participant Applications</h3>
        <table className="table border border-black text-sm">
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>Image</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Description</th>
              <th>Batch</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {participants?.map((application, index) => (
              <tr key={application._id}>
                <td>
                  <div className="border border-black w-16 h-16">
                    <img
                      src={application.applicantImage}
                      alt="Applicant"
                      className="w-12 h-12 "
                    />
                  </div>
                </td>
                <td>{application.applicantName}</td>
                <td>{application.applicantEmail}</td>
                <td>{application.applicantDescription}</td>
                <td>{application.batch}</td>
                <td>{application.registrationDate}</td>
                <td>
                  <button
                    className="p-2 rounded bg-red-400 text-white"
                    onClick={() => handleDelete(index)}
                  >
                    <FaRegTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PropTypes validation for courseData
CourseData.propTypes = {
  courseData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseTitle: PropTypes.string.isRequired,
    instructor: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    description: PropTypes.string,
    prerequisites: PropTypes.arrayOf(PropTypes.string),
    learningOutcomes: PropTypes.arrayOf(PropTypes.string),
    schedule: PropTypes.arrayOf(
      PropTypes.shape({
        week: PropTypes.number.isRequired,
        topic: PropTypes.string.isRequired,
        scheduleDetails: PropTypes.string,
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
        batchName: PropTypes.string.isRequired,
        batchDate: PropTypes.string.isRequired,
        batchDetails: PropTypes.string,
      })
    ),
    applicants: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        applicantName: PropTypes.string.isRequired,
        applicantEmail: PropTypes.string.isRequired,
        applicantDescription: PropTypes.string,
        applicantImage: PropTypes.string,
        batch: PropTypes.string,
        registrationDate: PropTypes.string,
      })
    ),
  }),
};

export default CourseData;
