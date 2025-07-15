import { useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import { FaSearch, FaTimes } from "react-icons/fa";

const CompanyProfiles = () => {
  const axiosPublic = useAxiosPublic();

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompanyID, setSelectedCompanyID] = useState(null);

  const {
    data: CompanyData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CompanyData"],
    queryFn: () => axiosPublic.get("/Company").then((res) => res.data),
  });

  // Loading /Error UI
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <div className="relative text-center">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
          <div
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white hover:bg-gray-200 rounded-full p-3 cursor-pointer"
            title={showFilters ? "Hide Filters" : "Show Filters"}
            aria-label="Toggle Filters"
          >
            {showFilters ? (
              <FaTimes className="text-lg text-black font-bold" />
            ) : (
              <FaSearch className="text-lg text-black font-bold" />
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white px-4 md:px-20">
          Explore Leading Company Profiles
        </h1>
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Get to know top organizations, their missions, values, and what makes
          them unique. Discover companies shaping the future of work and
          innovation.
        </p>
      </div>

      {/* Company Cards */}
      {/* <div className="py-6 px-4 md:px-20">
        {filteredCompany.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompany.map((Company) => (
              <CompanyCard
                key={Company._id}
                Company={Company}
                setSelectedCompanyID={setSelectedCompanyID}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No Company&apos;s found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting or clearing filters to see more results.
            </p>
          </div>
        )}
      </div> */}

      {/* Company Modal */}
      {/* <dialog id="Company_Details_Modal" className="modal">
        <CompanyDetailsModal
          selectedCompanyID={selectedCompanyID}
          setSelectedCompanyID={setSelectedCompanyID}
        />
      </dialog> */}
    </div>
  );
};

export default CompanyProfiles;
