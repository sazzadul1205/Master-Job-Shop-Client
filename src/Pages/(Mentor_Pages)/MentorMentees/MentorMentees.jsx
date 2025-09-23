import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

const MentorMentees = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  const statusFilter = "Accepted";

  // Fetching Active Courses
  const {
    data: MyCoursesData,
    isLoading: MyCoursesIsLoading,
    refetch: MyCoursesRefetch,
    error: MyCoursesError,
  } = useQuery({
    queryKey: ["MyCoursesData"],
    queryFn: () =>
      axiosPublic.get(`/Courses?mentorEmail=${user?.email}`).then((res) => {
        const data = res.data;
        // Ensure the result is always an array
        return Array.isArray(data) ? data : [data];
      }),
  });

  // Assuming MyCoursesData is an array of objects
  const allCoursesIds = MyCoursesData?.map((item) => item._id);

  // Active Courses
  const {
    data: MyCoursesApplicationsData,
    isLoading: MyCoursesApplicationsIsLoading,
    refetch: MyCoursesApplicationsRefetch,
    error: MyCoursesApplicationsError,
  } = useQuery({
    queryKey: ["MyCoursesApplications", allCoursesIds, statusFilter],
    queryFn: () =>
      axiosPublic
        .get(
          `/CourseApplications/ByCourse?courseId=${allCoursesIds.join(
            ","
          )}&status=${statusFilter}`
        )
        .then((res) => res.data),
    enabled: allCoursesIds?.length > 0,
  });

  // Fetching Active Mentorship
  const {
    data: MyMentorshipData,
    isLoading: MyMentorshipIsLoading,
    refetch: MyMentorshipRefetch,
    error: MyMentorshipError,
  } = useQuery({
    queryKey: ["MyMentorshipData"],
    queryFn: () =>
      axiosPublic.get(`/Mentorship?mentorEmail=${user?.email}`).then((res) => {
        const data = res.data;
        // Ensure the result is always an array
        return Array.isArray(data) ? data : [data];
      }),
  });

  // Assuming MyMentorshipData is an array of objects
  const allMentorshipIds = MyMentorshipData?.map((item) => item._id);

  // Active Mentorship
  const {
    data: MyMentorshipApplicationsData,
    isLoading: MyMentorshipApplicationsIsLoading,
    refetch: MyMentorshipApplicationsRefetch,
    error: MyMentorshipApplicationsError,
  } = useQuery({
    queryKey: ["MyMentorshipApplications", allMentorshipIds, statusFilter],
    queryFn: () =>
      axiosPublic
        .get(
          `/MentorshipApplications/ByMentorship?mentorshipId=${allMentorshipIds.join(
            ","
          )}&status=${statusFilter}`
        )
        .then((res) => res.data),
    enabled: allMentorshipIds?.length > 0,
  });

  // Check for loading state
  if (
    loading ||
    MyCoursesIsLoading ||
    MyMentorshipIsLoading ||
    MyCoursesApplicationsIsLoading ||
    MyMentorshipApplicationsIsLoading
  )
    return <Loading />;

  // Check for error
  if (
    MyCoursesError ||
    MyMentorshipError ||
    MyCoursesApplicationsError ||
    MyMentorshipApplicationsError
  )
    return <Error />;

  // Refetch All
  const refetchAll = () => {
    MyCoursesRefetch();
    MyMentorshipRefetch();
    MyCoursesApplicationsRefetch();
    MyMentorshipApplicationsRefetch();
  };

  // Flatten Course Applications
  const courseApplications = MyCoursesApplicationsData
    ? Object.values(MyCoursesApplicationsData).flat()
    : [];

  // Flatten Mentorship Applications
  const mentorshipApplications = MyMentorshipApplicationsData
    ? Object.values(MyMentorshipApplicationsData).flat()
    : [];

  console.log("Course :", courseApplications);
  console.log("Mentorship :", mentorshipApplications);

  return <div></div>;
};

export default MentorMentees;
