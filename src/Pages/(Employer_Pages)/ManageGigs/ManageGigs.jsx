import { useState } from "react";
import { Link } from "react-router-dom";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assets
import GigBlue from "../../../assets/EmployerLayout/Gig/GigBlue.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import GigCard from "../../../Shared/GigCard/GigCard";

// Modals
import EditGigModal from "./EditGigModal/EditGigModal";
import AddNewGigModal from "./AddNewGigModal/AddNewGigModal";
import GigDetailsModal from "../../(Public_Pages)/Home/FeaturedGigs/GigDetailsModal/GigDetailsModal";

const ManageGigs = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [selectedGigID, setSelectedGigID] = useState(null);
  const [selectedGigData, setSelectedGigData] = useState(null);

  // User Role Data
  const {
    data: UserRoleData,
    isLoading: UserRoleIsLoading,
    error: UserRoleError,
    refetch: UserRoleRefetch,
  } = useQuery({
    queryKey: ["UserRoleData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Users/Role?email=${user?.email}`);
      return res.data.role;
    },
    enabled: !!user?.email,
  });

  // Gigs Data
  const {
    data: GigsData,
    isLoading: GigsIsLoading,
    error: GigsError,
    refetch: GigsRefetch,
  } = useQuery({
    queryKey: ["GigsData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Gigs?postedBy=${user?.email}`);
        const data = res.data;

        if (Array.isArray(data)) return data;
        if (data && typeof data === "object") return [data]; // wrap single object in array
        return [];
      } catch (err) {
        if (err.response?.status === 404) return []; // no Gigs found
         console.log("Error", err);
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
    queryKey: ["CompanyData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Company?email=${user?.email}`).then((res) => res.data),
    enabled: UserRoleData === "Company",
  });

  // Employer Data
  const {
    data: EmployerData,
    isLoading: EmployerIsLoading,
    error: EmployerError,
    refetch: EmployerRefetch,
  } = useQuery({
    queryKey: ["EmployerData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Employers?email=${user?.email}`).then((res) => res.data),
    enabled: UserRoleData === "Employer",
  });

  // Unified Data Based on Role
  const userData =
    UserRoleData === "Company"
      ? CompanyData || {}
      : UserRoleData === "Employer"
        ? EmployerData || {}
        : {};

  // Refetching Data
  const refetch = async () => {
    await GigsRefetch();
    await CompanyRefetch();
    await EmployerRefetch();
    await UserRoleRefetch();
  };

  // Loading / Error UI
  if (CompanyIsLoading || GigsIsLoading || EmployerIsLoading || UserRoleIsLoading || loading) return <Loading />;
  if (CompanyError || GigsError || EmployerError || UserRoleError) return <Error />;

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center py-3 px-5 ">
        {/* Title */}
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-4">
          <img src={GigBlue} alt="Gig Blue Icon" className="w-8 h-8" /> Manage
          Gigs
        </h3>

        {/* Add New Gig Button */}
        <button
          onClick={() => {
            if (!userData?._id) {
              // Company data missing: show warning
              document
                .getElementById("Company_Profile_Warning_Modal")
                .showModal();
            } else {
              // Company data present: show Add New Job modal
              document.getElementById("Add_New_Gig_Modal").showModal();
            }
          }}
          className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
        >
          <FaPlus />
          Add New Gig
        </button>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Gigs Display */}
      <div className="py-3 px-5">
        {GigsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {GigsData.map((gig) => (
              <div key={gig._id}>
                <GigCard
                  gig={gig}
                  poster={true}
                  refetch={refetch}
                  setSelectedGigID={setSelectedGigID}
                  setSelectedGigData={setSelectedGigData}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-black text-2xl font-medium bg-white/10 rounded p-6">
            {/* Title */}
            <h3>No Gig postings available at the moment.</h3>

            {/* Content */}
            <p className="text-lg text-gray-800 mt-2 w-3xl mx-auto">
              You haven&apos;t published any tech gigs yet. Post a new
              opportunity to connect with skilled developers, designers, and IT
              professionals.
            </p>

            {/* Add New Gig Button */}
            <div className="flex justify-center pt-5">
              <button
                onClick={() => {
                  if (!userData?._id) {
                    // Company data missing: show warning
                    document
                      .getElementById("Company_Profile_Warning_Modal")
                      .showModal();
                  } else {
                    // Company data present: show Add New Job modal
                    document.getElementById("Add_New_Gig_Modal").showModal();
                  }
                }}
                className="flex items-center text-lg gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
              >
                <FaPlus />
                Add New Gig
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Gig Modals */}
      <dialog id="Add_New_Gig_Modal" className="modal">
        <AddNewGigModal CompanyData={userData} refetch={refetch} />
      </dialog>

      {/* Edit Gig Modals */}
      <dialog id="Edit_Gig_Modal" className="modal">
        <EditGigModal selectedGigData={selectedGigData} refetch={refetch} />
      </dialog>

      {/* Gig Details Modal */}
      <dialog id="Gig_Details_Modal" className="modal">
        <GigDetailsModal
          poster={true}
          selectedGigID={selectedGigID}
          setSelectedGigID={setSelectedGigID}
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

export default ManageGigs;
