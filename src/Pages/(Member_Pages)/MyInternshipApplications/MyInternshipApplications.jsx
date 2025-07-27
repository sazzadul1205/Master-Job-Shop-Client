import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { ImCross } from "react-icons/im";
import { FaInfo } from "react-icons/fa";

import InternshipApplication from "../../../assets/Navbar/Member/InternshipApplication.png";
import InternshipDetailsModal from "../../(Public_Pages)/Home/FeaturedInternships/InternshipDetailsModal/InternshipDetailsModal";
import MyInternshipApplicationModal from "./MyInternshipApplicationModal/MyInternshipApplicationModal";
import Swal from "sweetalert2";

const MyInternshipApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select internships ID
  const [
    selectedInterneshipApplicationID,
    setSelectedInterneshipApplicationID,
  ] = useState(null);
  const [selectedInternshipID, setSelectedInternshipID] = useState(null);

  // Step 1: Fetch internship Applications
  const {
    data: InternshipApplicationsData = [],
    isLoading: InternshipApplicationsIsLoading,
    error: InternshipApplicationsError,
    refetch: refetchInternshipApplications,
  } = useQuery({
    queryKey: ["InternshipApplicationsData"],
    queryFn: () =>
      axiosPublic
        .get(`/InternshipApplications?email=${user?.email}`)
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email,
  });

  console.log(InternshipApplicationsData);

  // Step 2: Extract unique internshipIds
  const InternshipIds = InternshipApplicationsData.map(
    (app) => app.internshipId
  );
  const uniqueInternshipIds = [...new Set(InternshipIds)];

  // Step 3: Fetch internships
  const {
    data: InternshipsData = [],
    isLoading: InternshipsIsLoading,
    error: InternshipsError,
    refetch: InternshipsRefetch,
  } = useQuery({
    queryKey: ["InternshipsData", uniqueInternshipIds],
    queryFn: () =>
      axiosPublic
        .get(`/Internship?internshipIds=${uniqueInternshipIds.join(",")}`)
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email && uniqueInternshipIds.length > 0,
  });

  //   Refetch All
  const refetchAll = async () => {
    await refetchInternshipApplications();
    await InternshipsRefetch();
  };

  // UI Error / Loading
  if (loading || InternshipApplicationsIsLoading || InternshipsIsLoading)
    return <Loading />;
  if (InternshipApplicationsError || InternshipsError) return <Error />;

  // Merge application & internship data
  const mergedData = InternshipApplicationsData.map((application) => {
    const internship = InternshipsData.find(
      (internship) => internship._id === application.internshipId
    );
    return {
      ...application,
      internship,
    };
  }).filter((item) => item.internship);

  // Delete Internship Handler
  const handleDeleteInternship = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the Internship Application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`/InternshipApplications/${id}`);

        if (res.status === 200) {
          // Refetch updated data
          await refetchAll();

          // Temporary success toast (auto-dismiss)
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Internship Application has been successfully removed.",
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
        My Internship Applications
      </h3>

      {/* Divider */}
      <p className="bg-white py-[2px] w-1/3 mx-auto" />

      {/* Table */}
      <div className="overflow-x-auto shadow mt-5">
        <table className="min-w-full text-sm text-gray-800">
          {/* Table Header */}
          <thead className="bg-gray-500 border-b text-xs text-white border border-black uppercase tracking-wide cursor-default">
            <tr>
              <th className="px-3 py-4 text-left">#</th>
              <th className="px-3 py-4 text-left">Internship Title</th>
              <th className="px-3 py-4 text-left">Category</th>
              <th className="px-3 py-4 text-left">Budget</th>
              <th className="px-3 py-4 text-left">Posted By</th>
              <th className="px-3 py-4 text-left">Remote</th>
              <th className="px-3 py-4 text-left">Applied</th>
              <th className="px-3 py-4 text-left">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {mergedData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-4">{index + 1}</td>

                {/* Internship Title */}
                <td className="px-5 py-4">{item.internship.title}</td>

                {/* Category */}
                <td className="px-5 py-4">
                  <div className="text-sm">{item.internship.category}</div>
                  <div className="text-xs text-gray-500">
                    {item.internship.subCategory}
                  </div>
                </td>

                {/* Budget */}
                <td className="px-5 py-4">
                  $ {item.internship.budget.min} - ${" "}
                  {item.internship.budget.max} {item.internship.budget.currency}
                  {item.internship.budget.isNegotiable && (
                    <span className="text-green-600 text-xs ml-1">
                      (Negotiable)
                    </span>
                  )}
                </td>

                {/* Posted By */}
                <td className="px-5 py-4">
                  <div>{item.internship.postedBy.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.internship.postedBy.jobsPosted} jobs | ⭐{" "}
                    {item.internship.postedBy.rating}
                  </div>
                </td>

                {/* Remote */}
                <td className="px-5 py-4">
                  {item.internship.isRemote ? (
                    <span className="text-green-600 font-medium">Remote</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">On-site</span>
                  )}
                </td>

                {/* Applied Ago */}
                <td className="px-5 py-4">
                  {formatDistanceToNow(new Date(item.appliedAt), {
                    addSuffix: true,
                  })}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 flex items-center gap-2">
                  {/* View Internship Application Button */}
                  <>
                    <button
                      id={`view-internship-application-${item?._id}`}
                      data-tooltip-content="View Application Data"
                      onClick={() => {
                        setSelectedInterneshipApplicationID(item?._id);
                        document
                          .getElementById("View_Internship_Applications_Modal")
                          .showModal();
                      }}
                      className="bg-white hover:bg-blue-300/50 border-2 border-blue-600 rounded-full p-3 transition cursor-pointer"
                    >
                      <img
                        src={InternshipApplication}
                        alt="internship Application"
                        className="w-5"
                      />
                    </button>
                    <Tooltip
                      anchorSelect={`#view-internship-application-${item?._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                    />
                  </>

                  {/* Delete Application Button */}
                  <>
                    <div
                      id={`delete-internship-${item._id}`}
                      data-tooltip-content="Cancel Internship"
                      onClick={() => handleDeleteInternship(item._id)}
                      className="p-3 text-lg rounded-full border-2 border-red-500 hover:bg-red-200 cursor-pointer"
                    >
                      <ImCross />
                    </div>
                    <Tooltip
                      anchorSelect={`#delete-internship-${item._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                    />
                  </>

                  {/* Details Button */}
                  <>
                    <div
                      id={`internship-details-btn-${item?._id}`}
                      data-tooltip-content="View Internship Details"
                      className="p-3 text-lg rounded-full border-2 border-yellow-500 hover:bg-yellow-200 cursor-pointer"
                      onClick={() => {
                        setSelectedInternshipID(item?.internship?._id);
                        document
                          .getElementById("Internship_Details_Modal")
                          .showModal();
                      }}
                    >
                      <FaInfo />
                    </div>

                    <Tooltip
                      anchorSelect={`#internship-details-btn-${item?._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                    />
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="View_Internship_Applications_Modal" className="modal">
        <MyInternshipApplicationModal
          selectedInterneshipApplicationID={selectedInterneshipApplicationID}
          setSelectedInterneshipApplicationID={
            setSelectedInterneshipApplicationID
          }
        />
      </dialog>

      {/* Internship Modal */}
      <dialog id="Internship_Details_Modal" className="modal">
        <InternshipDetailsModal
          selectedInternshipID={selectedInternshipID}
          setSelectedInternshipID={setSelectedInternshipID}
        />
      </dialog>
    </section>
  );
};

export default MyInternshipApplications;
