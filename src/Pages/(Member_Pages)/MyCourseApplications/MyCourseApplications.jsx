import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { FaInfo } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assets
import Courses from "../../../assets/Navbar/Member/Courses.png";

// Modals
import MyCourseApplicationsModal from "./MyCourseApplicationsModal/MyCourseApplicationsModal";
import CourseDetailsModal from "../../(Public_Pages)/Home/FeaturedCourses/CourseDetailsModal/CourseDetailsModal";

const MyCourseApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Courses ID
  const [selectedCourseApplicationID, setSelectedCourseApplicationID] =
    useState(null);
  const [selectedCourseID, setSelectedCourseID] = useState(null);

  // Step 1: Fetch Courses Bids
  const {
    data: CourseApplicationsData = [],
    isLoading: CourseApplicationsIsLoading,
    error: CourseApplicationsError,
    refetch: refetchCourseApplications,
  } = useQuery({
    queryKey: ["CourseApplicationsData"],
    queryFn: () =>
      axiosPublic
        .get(`/CourseApplications?email=${user?.email}`)
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email,
  });

  // Step 2: Extract unique CourseIds
  const courseIds = CourseApplicationsData.map((app) => app.courseId);
  const uniqueCourseIds = [...new Set(courseIds)];

  // Step 3: Fetch Courses Data
  const {
    data: CoursesData = [],
    isLoading: CoursesIsLoading,
    error: CoursesError,
    refetch: CoursesRefetch,
  } = useQuery({
    queryKey: ["CoursesData", uniqueCourseIds],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?eventIds=${uniqueCourseIds.join(",")}`)
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email && uniqueCourseIds.length > 0,
  });

  // Refetch All
  const refetchAll = async () => {
    await refetchCourseApplications();
    await CoursesRefetch();
  };

  //   UI Error / Loading
  if (loading || CourseApplicationsIsLoading || CoursesIsLoading)
    return <Loading />;
  if (CourseApplicationsError || CoursesError) return <Error />;

  // Merge application & Courses data
  const mergedData = CourseApplicationsData.map((application) => {
    const course = CoursesData.find(
      (course) => course._id === application.courseId
    );
    return {
      ...application,
      course,
    };
  }).filter((item) => item.course);

  // Delete Bid Handler
  const handleDeleteCourseApplication = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the Course Application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`/CourseApplications/${id}`);

        if (res.status === 200) {
          // Refetch updated data
          await refetchAll();

          // Temporary success toast (auto-dismiss)
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Course Application has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
        // Show detailed error
        Swal.fire({
          icon: "error",
          title: "Failed to delete",
          text:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Course Applications
      </h3>

      {/* Divider */}
      <p className="bg-white py-[2px] w-1/3 mx-auto" />

      {/* Table */}
      <div className="overflow-x-auto shadow mt-5">
        <table className="min-w-full text-sm text-gray-800">
          {/* Table Header */}
          <thead className="bg-gray-500 text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="px-3 py-4 text-left">Course Title</th>
              <th className="px-3 py-4 text-left">Category</th>
              <th className="px-3 py-4 text-left">Instructor</th>
              <th className="px-3 py-4 text-left">Level</th>
              <th className="px-3 py-4 text-left">Applied</th>
              <th className="px-3 py-4 text-left">Status</th>
              <th className="px-3 py-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-300 bg-white">
            {mergedData.map((app) => (
              <tr key={app._id} className="hover:bg-gray-100">
                {/* Course Title */}
                <td className="py-2 px-4 font-medium">
                  {app.course?.title || "N/A"}
                </td>

                {/* Course Details */}
                <td className="py-2 px-4">{app.course?.category || "N/A"}</td>

                {/* Instructor */}
                <td className="py-2 px-4">
                  {app.course?.instructor?.name || "N/A"}
                </td>

                {/* Course Level */}
                <td className="py-2 px-4">{app.course?.level || "N/A"}</td>

                {/* Applied At */}
                <td className="py-2 px-4">
                  {formatDistanceToNow(new Date(app.appliedAt), {
                    addSuffix: true,
                  })}
                </td>

                {/* Status */}
                <td className="py-2 px-4 capitalize">{app.status}</td>

                {/* Actions */}
                <td className="px-5 py-3 flex items-center gap-2 justify-center">
                  {/* View Application */}
                  <>
                    <button
                      id={`view-course-application-${app._id}`}
                      data-tooltip-content="View Course Application Data"
                      onClick={() => {
                        setSelectedCourseApplicationID(app._id);
                        document
                          .getElementById("View_Course_Application_Modal")
                          .showModal();
                      }}
                      className="bg-white hover:bg-blue-300/50 border-2 border-blue-600 rounded-full p-3 cursor-pointer"
                    >
                      <img src={Courses} alt="Courses app" className="w-5" />
                    </button>
                    <Tooltip
                      anchorSelect={`#view-course-application-${app._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white"
                    />
                  </>

                  {/* Delete */}
                  <>
                    <div
                      id={`delete-course-application-${app._id}`}
                      data-tooltip-content="Cancel Course Application"
                      onClick={() => handleDeleteCourseApplication(app._id)}
                      className="p-3 text-lg border-2 border-red-500 hover:bg-red-200 rounded-full cursor-pointer"
                    >
                      <ImCross />
                    </div>
                    <Tooltip
                      anchorSelect={`#delete-course-application-${app._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white"
                    />
                  </>

                  {/* View Details */}
                  <>
                    <div
                      id={`course-details-btn-${app._id}`}
                      data-tooltip-content="View Course Details"
                      onClick={() => {
                        setSelectedCourseID(app?.course?._id);
                        document
                          .getElementById("Course_Details_Modal")
                          .showModal();
                      }}
                      className="p-3 text-lg border-2 border-yellow-500 hover:bg-yellow-200 rounded-full cursor-pointer"
                    >
                      <FaInfo />
                    </div>
                    <Tooltip
                      anchorSelect={`#event-details-btn-${app._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white"
                    />
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {/* View Course Application Modal */}
      <dialog id="View_Course_Application_Modal" className="modal">
        <MyCourseApplicationsModal
          selectedCourseApplicationID={selectedCourseApplicationID}
          setSelectedCourseApplicationID={setSelectedCourseApplicationID}
        />
      </dialog>

      {/* Course Details Modal */}
      <dialog id="Course_Details_Modal" className="modal">
        <CourseDetailsModal
          selectedCourseID={selectedCourseID}
          setSelectedCourseID={setSelectedCourseID}
        />
      </dialog>
    </section>
  );
};

export default MyCourseApplications;
