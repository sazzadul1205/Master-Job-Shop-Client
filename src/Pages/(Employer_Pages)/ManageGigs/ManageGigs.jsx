import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa";

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

  // Gigs Data
  const {
    data: GigsData,
    isLoading: GigsIsLoading,
    error: GigsError,
    refetch: GigsRefetch,
  } = useQuery({
    queryKey: ["GigsData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Gigs?postedBy=${user?.email}`);
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") return [data]; // wrap single object in array
      return [];
    },
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
    GigsRefetch();
    CompanyRefetch();
  };

  // Loading / Error UI
  if (CompanyIsLoading || GigsIsLoading || loading) return <Loading />;
  if (CompanyError || GigsError) return <Error />;

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
          onClick={() =>
            document.getElementById("Add_New_Gig_Modal").showModal()
          }
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
                onClick={() =>
                  document.getElementById("Add_New_Gig_Modal").showModal()
                }
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
        <AddNewGigModal CompanyData={company} refetch={refetch} />
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
    </>
  );
};

export default ManageGigs;
