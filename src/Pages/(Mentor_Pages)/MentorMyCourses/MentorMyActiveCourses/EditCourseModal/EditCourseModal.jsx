import React from "react";

const EditCourseModal = () => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [loading, setLoading] = useState(null);
  const [subOptions, setSubOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Mentorship Data
  const {
    data: MentorshipData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedMentorshipData", selectedMentorshipID],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?id=${selectedMentorshipID}`)
        .then((res) => res.data),
    enabled: !!selectedMentorshipID,
  });

  return <div></div>;
};

export default EditCourseModal;
