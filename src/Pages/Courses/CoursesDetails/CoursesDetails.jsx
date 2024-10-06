import { useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";

const CoursesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission for applicants
  const onSubmit = async (data) => {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in yyyy-mm-dd format

    // Format the applicant data
    const applicantData = {
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      applicantImage: data.applicantImage,
      applicantDescription: data.applicantDescription,
      registrationDate: currentDate, // registrationDate in yyyy-mm-dd format
      batch: data.batch,
    };

    reset();
    console.log(applicantData);
  };

  // Fetching course details by ID
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CoursesDetailsData", id],
    queryFn: () => axiosPublic.get(`/Courses/${id}`).then((res) => res.data),
  });

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong:{" "}
          {error.response?.data?.message || "Please reload the page."}
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto text-black pt-24 pb-5">
        {/* Back button with navigation */}
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          <FaArrowLeft className="mr-5" />
          Back
        </button>

        {/* Course Details */}
        <div className="py-5">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{course.courseTitle}</h1>

          {/* Instructor */}
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold ">Instructor:</span>{" "}
            {course.instructor}
          </p>

          {/* duration */}
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold ">Duration:</span> {course.duration}
          </p>

          {/* level */}
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold ">Level:</span> {course.level}
          </p>

          {/* format */}
          <p className="text-xl w-1/2 grid grid-cols-2">
            <span className="font-semibold ">Format:</span> {course.format}
          </p>

          {/* description */}
          <p className="text-xl mt-4">
            <strong className="mr-5">Description:</strong> {course.description}
          </p>

          {/* prerequisites */}
          <div>
            <h2 className="text-xl font-bold mt-6">Prerequisites</h2>
            <ul className="list-disc ml-5">
              {course.prerequisites.map((item, index) => (
                <li key={index} className="text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* learningOutcomes */}
          <div>
            <h2 className="text-xl font-bold mt-6">Learning Outcomes</h2>
            <ul className="list-disc ml-5">
              {course.learningOutcomes.map((item, index) => (
                <li key={index} className="text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* schedule */}
          <div>
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
                    <td className="border-b border-gray-300 p-2">
                      {item.week}
                    </td>
                    <td className="border-b border-gray-300 p-2">
                      {item.topic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* assessments */}
          <div>
            <h2 className="text-xl font-bold mt-6">Assessments</h2>
            <ul className="list-disc ml-5">
              {course.assessments.map((item, index) => (
                <li key={index} className="text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* targetAudience */}
          <div>
            <h2 className="text-xl font-bold mt-6">Target Audience</h2>
            <ul className="list-disc ml-5">
              {course.targetAudience.map((item, index) => (
                <li key={index} className="text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>

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

        {/* Applications */}
        <div className="overflow-x-auto mt-6">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold py-2">Participant Applications:</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-lg px-8 py-1 font-semibold text-white"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Apply{" "}
            </button>
          </div>
          <table className="table">
            <thead>
              <tr className="bg-gray-500 text-white">
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Description</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {course?.applicants?.map((application, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={application.applicantImage}
                      alt={application.applicantName}
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td>{application.applicantName}</td>
                  <td>{application.applicantEmail}</td>
                  <td>{application.applicantDescription}</td>
                  <td>{application.registrationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for applying */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white text-black border-2 border-red-500">
          <h3 className="font-bold text-xl text-center">Apply for Course</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Applicant Name */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Name
              </label>
              <input
                id="applicantName"
                type="text"
                {...register("applicantName", {
                  required: "Applicant Name is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter applicant name"
              />
              {errors.applicantName && (
                <p className="text-red-600">{errors.applicantName.message}</p>
              )}
            </div>

            {/* Applicant Email */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Email
              </label>
              <input
                id="applicantEmail"
                type="email"
                {...register("applicantEmail", {
                  required: "Applicant Email is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter applicant email"
              />
              {errors.applicantEmail && (
                <p className="text-red-600">{errors.applicantEmail.message}</p>
              )}
            </div>

            {/* Applicant Image */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Image URL
              </label>
              <input
                id="applicantImage"
                type="text"
                {...register("applicantImage", {
                  required: "Applicant Image URL is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter applicant image URL"
              />
              {errors.applicantImage && (
                <p className="text-red-600">{errors.applicantImage.message}</p>
              )}
            </div>

            {/* Applicant Description */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Description
              </label>
              <textarea
                id="applicantDescription"
                {...register("applicantDescription", {
                  required: "Applicant Description is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter applicant description"
              />
              {errors.applicantDescription && (
                <p className="text-red-600">
                  {errors.applicantDescription.message}
                </p>
              )}
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm font-bold mb-2">Batch</label>
              <input
                id="batch"
                type="text"
                {...register("batch", {
                  required: "Batch is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter batch"
              />
              {errors.batch && (
                <p className="text-red-600">{errors.batch.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="modal-action">
              <button
                type="button"
                onClick={() => document.getElementById("my_modal_1").close()}
                className="bg-red-500 hover:bg-red-600 px-5 py-3 font-semibold text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 px-5 py-3 font-semibold text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default CoursesDetails;
