import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import AddApplicant from "./AddApplicant/AddApplicant";

const CoursesDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["CoursesDetailsData", id],
    queryFn: () => axiosPublic.get(`/Courses/${id}`).then((res) => res.data),
  });

  const checkIfApplied = async () => {
    if (user) {
      try {
        const {
          data: { applicants },
        } = await axiosPublic.get(`/Courses/${id}`);
        setHasApplied(
          applicants.some(({ applicantEmail }) => applicantEmail === user.email)
        );
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    }
  };

  useEffect(() => {
    if (user) checkIfApplied();
  }, [id, user]);

  console.log(course);

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-red-500 font-bold text-3xl mb-8">
          {error.response?.data?.message || "Please reload the page."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto text-black pt-24 pb-5">
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-5" /> Back
        </button>

        <div className="py-1">
          <h1 className="text-3xl font-bold mb-4">{course.courseTitle}</h1>
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold">Instructor:</span>{" "}
            {course.instructor}
          </p>
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold">Duration:</span> {course.duration}
          </p>
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold">Level:</span> {course.level}
          </p>
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold">Format:</span> {course.format}
          </p>
          <p className="text-xl mt-4">
            <strong className="mr-5">Description:</strong> {course.description}
          </p>

          <h2 className="text-xl font-bold mt-6">Prerequisites</h2>
          <ul className="list-disc ml-5">
            {course.prerequisites.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-6">Learning Outcomes</h2>
          <ul className="list-disc ml-5">
            {course.learningOutcomes.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-6">Course Schedule</h2>
          <table className="w-full text-left border-collapse mt-4">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border-b-2 border-gray-300 p-2">Week</th>
                <th className="border-b-2 border-gray-300 p-2">Topic</th>
              </tr>
            </thead>
            <tbody>
              {course.schedule.map((item) => (
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

          <h2 className="text-xl font-bold mt-6">Assessments</h2>
          <ul className="list-disc ml-5">
            {course.assessments.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-6">Target Audience</h2>
          <ul className="list-disc ml-5">
            {course.targetAudience.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-6">Certification</h2>
          <p className="text-lg">{course.certification}</p>

          <h2 className="text-xl font-bold mt-6">Support</h2>
          <p className="text-lg">
            <strong>Office Hours:</strong> {course.support.officeHours}
          </p>
          <p className="text-lg">
            <strong>Discussion Forum:</strong> {course.support.discussionForum}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Available Batches</h2>
          <div className="list-disc ml-5 mt-2 grid grid-cols-5 gap-5">
            {course.batches.map((batch, index) => (
              <div
                key={index}
                className="text-lg bg-gradient-to-bl from-blue-300 to-blue-50 p-5 hover:shadow-xl"
              >
                <strong className=" text-xl">{batch.batchName}</strong>
                <p className="py-1">
                  {batch.batchDate} {batch.startDate}
                </p>
                <p className="py-1">{batch.batchDetails}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xl bg-sky-100 py-3 px-5 flex justify-between items-center mt-10">
          <p>People Applied: {course?.applicants?.length || 0}</p>
          <div>
            {user ? (
              hasApplied ? (
                <button
                  className="bg-gray-500 w-56 py-3 text-white font-bold"
                  disabled
                >
                  Already Applied
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-600 text-lg w-56 py-1 font-semibold text-white"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                >
                  Apply
                </button>
              )
            ) : (
              <Link to={"/Login"}>
                <button className="bg-blue-500 hover:bg-blue-400 w-56 py-3 text-white font-bold">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <AddApplicant id={id} refetch={refetch} course={course} />
      </dialog>
    </div>
  );
};

export default CoursesDetails;
