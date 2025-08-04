// Icons
import { FaPlus } from "react-icons/fa";

// Modal
import AddNewJobModal from "./AddNewJobModal/AddNewJobModal";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

const ManageJobs = () => {
  const { user, loading } = useAuth();

  const axiosPublic = useAxiosPublic();

  // Jobs Data
  const {
    data: JobsData,
    isLoading: JobsIsLoading,
    error: JobsError,
    refetch: JobsRefetch,
  } = useQuery({
    queryKey: ["JobsData"],
    queryFn: () =>
      axiosPublic.get(`/Jobs?postedBy=${user?.email}`).then((res) => res.data),
  });

  // Company Data
  const {
    data: CompanyData,
    isLoading: CompanyIsLoading,
    error: CompanyError,
    refetch: CompanyRefetch,
  } = useQuery({
    queryKey: ["CompanyData"],
    queryFn: () =>
      axiosPublic.get(`/Company?email=${user?.email}`).then((res) => res.data),
  });

  // Company Data Destructuring
  const company = CompanyData || {};

  // Refetching Data
  const refetch = () => {
    JobsRefetch();
    CompanyRefetch();
  };

  // Loading / Error UI
  if (CompanyIsLoading || JobsIsLoading || loading) return <Loading />;
  if (CompanyError || JobsError) return <Error />;

  console.log(JobsData);

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center py-3 px-5 ">
        {/* Title */}
        <h3 className="text-blue-700 font-bold text-2xl ">Manage My Jobs</h3>

        {/* Add New Job Button */}
        <button
          onClick={() =>
            document.getElementById("Add_New_Job_Modal").showModal()
          }
          className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
        >
          <FaPlus />
          Add New Job
        </button>
      </div>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mx-5" />

      <dialog id="Add_New_Job_Modal" className="modal">
        <AddNewJobModal CompanyData={company} refetch={refetch} />
      </dialog>
    </>
  );
};

export default ManageJobs;
