import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import AddApplicant from "./AddApplicant/AddApplicant";
import { Helmet } from "react-helmet";
import BackButton from "../../Shared/BackButton/BackButton";

const CoursesDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false);
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Master Job Shop || Courses Details</title>
      </Helmet>

      <div className="max-w-[1200px] mx-auto text-black pt-28 bg-slate-50 opacity-80 px-5 py-5">
        <BackButton></BackButton>

        {/* Content */}
        <div className="py-5 md:w-full px-2">
          {/* Course Title and Description */}
          <h1 className="text-3xl font-bold mb-4">{course?.courseTitle}</h1>
          <div className="text-xl flex flex-col md:flex-row ">
            <span className="font-semibold w-32">Instructor:</span>{" "}
            <span className="ml-5 md:ml-0">{course?.instructor}</span>
          </div>
          <div className="text-xl flex flex-col md:flex-row ">
            <span className="font-semibold w-32">Duration:</span>{" "}
            <span className="ml-5 md:ml-0">{course?.duration}</span>
          </div>
          <div className="text-xl flex flex-col md:flex-row ">
            <span className="font-semibold w-32">Level:</span>{" "}
            <span className="ml-5 md:ml-0">{course?.level}</span>
          </div>
          <div className="text-xl flex flex-col md:flex-row ">
            <span className="font-semibold w-32">Format:</span>{" "}
            <span className="ml-5 md:ml-0">{course?.format}</span>
          </div>
          <div className="text-xl flex flex-col md:flex-row mt-4">
            <strong className="mr-5">Description:</strong>{" "}
            <span className="ml-5 md:ml-0">{course?.description}</span>
          </div>

          {/* Prerequisites */}
          <div>
            <h2 className="text-xl font-bold mt-6">Prerequisites</h2>
            <ul className="list-disc ml-5">
              {course?.prerequisites.map((item, index) => (
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
              {course?.learningOutcomes.map((item, index) => (
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
              {course?.schedule.map((item) => (
                <tr
                  key={item.week}
                  className="odd:bg-blue-100 even:bg-blue-200"
                >
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
            {course?.assessments.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>

          {/* Target Audience */}
          <h2 className="text-xl font-bold mt-6">Target Audience</h2>
          <ul className="list-disc ml-5">
            {course?.targetAudience.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>

          {/* Certification */}
          <h2 className="text-xl font-bold mt-6">Certification</h2>
          <p className="text-lg">{course?.certification}</p>

          {/* Support */}
          <h2 className="text-xl font-bold mt-6">Support</h2>
          <p className="text-lg">
            <strong>Office Hours:</strong> {course?.support?.officeHours}
          </p>
          <p className="text-lg">
            <strong>Discussion Forum:</strong>{" "}
            {course?.support?.discussionForum}
          </p>

          <div className="space-y-3 mt-2">
            {course?.batches.map((batch, index) => (
              <div
                key={index}
                className="relative text-lg border border-dashed border-black p-5 hover:shadow-xl overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 to-transparent transform -translate-x-full -translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0"></div>
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
        </div>

        <div className="text-xl flex flex-col md:flex-row bg-sky-100 py-3 px-5 justify-between items-center mt-5">
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
