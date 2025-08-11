import { useState } from "react";
import { Link } from "react-router-dom";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { ImCross } from "react-icons/im";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import JobCard from "../../../Shared/JobCard/JobCard";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Modal
import EditJobModal from "./EditJobModal/EditJobModal";
import AddNewJobModal from "./AddNewJobModal/AddNewJobModal";
import JobDetailsModal from "../../(Public_Pages)/Home/FeaturedJobs/JobDetailsModal/JobDetailsModal";

const ManageJobs = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [selectedJobData, setSelectedJobData] = useState(null);
  
  // Jobs Data
  const {
    data: JobsData = [],
    isLoading: JobsIsLoading,
    error: JobsError,
    refetch: JobsRefetch,
  } = useQuery({
    queryKey: ["JobsData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Jobs?postedBy=${user?.email}`);
        const data = res.data;

        if (Array.isArray(data)) return data;
        if (data && typeof data === "object") return [data]; // wrap single object in array
        return [];
      } catch (err) {
        if (err.response?.status === 404) return []; // no jobs found
        return []; // fallback for other cases too
      }
    },
    enabled: !!user?.email, // prevents running before user is loaded
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

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center py-3 px-5 ">
        {/* Title */}
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <MdWork className="text-blue-700" /> Manage Jobs
        </h3>

        {/* Add New Job Button */}
        <button
          onClick={() => {
            if (!company?._id) {
              // Company data missing: show warning
              document
                .getElementById("Company_Profile_Warning_Modal")
                .showModal();
            } else {
              // Company data present: show Add New Job modal
              document.getElementById("Add_New_Job_Modal").showModal();
            }
          }}
          className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
        >
          <FaPlus />
          Add New Job
        </button>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Display Jobs */}
      <div className="py-3 px-5">
        {JobsData?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {JobsData.map((job) => (
              <div key={job._id}>
                <JobCard
                  job={job}
                  poster={true}
                  refetch={refetch}
                  setSelectedJobID={setSelectedJobID}
                  setSelectedJobData={setSelectedJobData}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-black text-2xl font-medium bg-white/10 rounded p-6">
            {/* Title */}
            <h3>No job postings available at the moment.</h3>

            {/* Content */}
            <p className="text-lg text-gray-800 mt-2 w-3xl mx-auto">
              You haven&apos;t published any job listings yet. Post a new
              opportunity to start attracting qualified candidates.
            </p>

            {/* Add New Job Button */}
            <div className="flex justify-center pt-5">
              <button
                onClick={() => {
                  if (!company?._id) {
                    // Company data missing: show warning
                    document
                      .getElementById("Company_Profile_Warning_Modal")
                      .showModal();
                  } else {
                    // Company data present: show Add New Job modal
                    document.getElementById("Add_New_Job_Modal").showModal();
                  }
                }}
                className="flex items-center text-lg gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
              >
                <FaPlus />
                Add New Job
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Job Modals */}
      <dialog id="Add_New_Job_Modal" className="modal">
        <AddNewJobModal CompanyData={company} refetch={refetch} />
      </dialog>

      {/* Edit Job Modals */}
      <dialog id="Edit_Job_Modal" className="modal">
        <EditJobModal selectedJobData={selectedJobData} refetch={refetch} />
      </dialog>

      {/* Jobs Details Modal */}
      <dialog id="Jobs_Details_Modal" className="modal">
        <JobDetailsModal
          poster={true}
          selectedJobID={selectedJobID}
          setSelectedJobID={setSelectedJobID}
        />
      </dialog>

      {/* If No Company Profile Warning */}
      <dialog id="Company_Profile_Warning_Modal" className="modal">
        <div className="modal-box min-w-[24rem] max-w-xl mx-auto max-h-[90vh] p-8 bg-white rounded-lg shadow-lg relative overflow-y-auto text-gray-900 flex flex-col items-center text-center">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              document.getElementById("Company_Profile_Warning_Modal").close();
            }}
            className="absolute top-3 right-3 z-50 bg-gray-50 hover:bg-gray-200 p-2 rounded-full"
          >
            <ImCross className="text-xl text-black hover:text-red-500 cursor-pointer" />
          </button>

          <h3 className="text-xl font-semibold mb-4 text-red-700">
            Please Create Your Company Profile First
          </h3>
          <p className="mb-8 text-gray-700 leading-relaxed max-w-md">
            You need to set up your company profile before posting jobs. This
            helps you showcase your business and attract the right candidates.
          </p>

          <Link
            to={"/Employer/CompanyProfile"}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              document.getElementById("Company_Profile_Warning_Modal").close();
            }}
          >
            Make My Profile Now
          </Link>
        </div>
      </dialog>
    </>
  );
};

export default ManageJobs;
