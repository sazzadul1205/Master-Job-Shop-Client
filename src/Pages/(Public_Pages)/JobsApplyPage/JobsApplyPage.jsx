import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

const JobsApplyPage = () => {
  const axiosPublic = useAxiosPublic();
  const { jobId } = useParams(); // <-- Get job ID from the route params

  // Fetching Selected Job Data
  const {
    data: SelectedJobData,
    isLoading: SelectedJobIsLoading,
    error: SelectedJobError,
  } = useQuery({
    queryKey: ["SelectedJobData", jobId],
    queryFn: () => axiosPublic.get(`/Jobs?id=${jobId}`).then((res) => res.data),
    enabled: !!jobId, // only run when jobId exists
  });

  // Loading
  if (SelectedJobIsLoading) {
    return <Loading />;
  }

  // Error
  if (SelectedJobError) {
    return <Error />;
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Apply for: {SelectedJobData?.title}
      </h1>
      {/* You can now build the form here using SelectedJobData */}
    </div>
  );
};

export default JobsApplyPage;
