// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const MMTCMIdentifier = ({ type, courseId, mentorshipId }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Courses
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      axiosPublic.get(`/Courses/`).then((res) => {
        const data = res.data;
        return Array.isArray(data) ? data : [data];
      }),
    enabled: type === "Course",
  });

  // Fetch Mentorship
  const {
    data: mentorshipData,
    isLoading: mentorshipLoading,
    error: mentorshipError,
  } = useQuery({
    queryKey: ["mentorship"],
    queryFn: () =>
      axiosPublic.get(`/Mentorship/`).then((res) => {
        const data = res.data;
        return Array.isArray(data) ? data : [data];
      }),
    enabled: type === "Mentorship",
  });

  // Pre-op Validation
  if (!type || (type !== "Course" && type !== "Mentorship")) {
    return <p className="text-red-500 font-semibold">Invalid type provided.</p>;
  }
  if (type === "Course" && !courseId) {
    return <p className="text-red-500 font-semibold">Course ID is required.</p>;
  }
  if (type === "Mentorship" && !mentorshipId) {
    return (
      <p className="text-red-500 font-semibold">Mentorship ID is required.</p>
    );
  }

  //
  if (coursesLoading || mentorshipLoading)
    return <p className="text-yellow-700 font-semibold">Loading...</p>;
  if (coursesError || mentorshipError)
    return <p className="text-red-500 font-semibold">Error loading data.</p>;

  // Find the matching title
  const title =
    type === "Course"
      ? coursesData?.find((c) => c._id === courseId)?.title || "N/A"
      : mentorshipData?.find((m) => m._id === mentorshipId)?.title || "N/A";

  return (
    <div>
      <p className="text-black font-semibold">{title}</p>
    </div>
  );
};

// Prop Validation
MMTCMIdentifier.propTypes = {
  type: PropTypes.oneOf(["Course", "Mentorship"]).isRequired,
  courseId: PropTypes.string,
  mentorshipId: PropTypes.string,
};

export default MMTCMIdentifier;
