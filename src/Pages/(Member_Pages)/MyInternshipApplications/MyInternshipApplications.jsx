import { useEffect, useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Assets & Icons
import InternshipApplication from "../../../assets/Navbar/Member/InternshipApplication.png";
import { ImCross } from "react-icons/im";
import { FaInfo } from "react-icons/fa";

// Modals
import InternshipDetailsModal from "../../(Public_Pages)/Home/FeaturedInternships/InternshipDetailsModal/InternshipDetailsModal";
import MyInternshipApplicationModal from "./MyInternshipApplicationModal/MyInternshipApplicationModal";
import { Link } from "react-router-dom";

const MyInternshipApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Internship ID
  const [applicationList, setApplicationList] = useState([]);
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);
  const [selectedInternshipID, setSelectedInternshipID] = useState(null);

  // Fetch internship applications
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
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
    enabled: !!user?.email,
  });

  // Step 2: Extract unique gigIds
  const internshipIds = InternshipApplicationsData.map(
    (app) => app.internshipId
  );
  const uniqueInternshipIds = [...new Set(internshipIds)];

  // Fetch internships data
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
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
    enabled: !!user?.email && uniqueInternshipIds.length > 0,
  });

  // Set application list
  useEffect(() => {
    if (InternshipApplicationsData.length > 0) {
      setApplicationList(InternshipApplicationsData);
    }
  }, [InternshipApplicationsData]);

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
          // Optimistically update state
          setApplicationList((prev) =>
            prev.filter((internship) => internship._id !== id)
          );

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Internship has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Silent refetch
          await refetchInternshipApplications({ throwOnError: false });
          await InternshipsRefetch({ throwOnError: false });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
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

  // UI Error / Loading
  if (loading || InternshipApplicationsIsLoading || InternshipsIsLoading)
    return <Loading />;
  if (InternshipApplicationsError || InternshipsError) return <Error />;

  // Merge application with internship
  const mergedData = applicationList
    .map((application) => {
      const internship = InternshipsData.find(
        (internship) => internship._id === application.internshipId
      );
      return {
        ...application,
        internship,
      };
    })
    .filter((item) => item.internship);

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Internship Applications
      </h3>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      {/* Application Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {mergedData.length > 0 ? (
          mergedData.map((item, index) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg shadow-md p-5 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.internship.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.internship.category}
                  </p>
                </div>
                <div className="text-sm text-gray-400 font-mono">
                  #{index + 1}
                </div>
              </div>

              {/* Budget */}
              <div className="mb-3 text-sm text-gray-600">
                Budget:{" "}
                <span className="font-medium text-gray-800">
                  ${item.internship.budget.min} - ${item.internship.budget.max}{" "}
                  {item.internship.budget.currency}
                </span>
                {item.internship.budget.isNegotiable && (
                  <span className="text-green-600 text-xs ml-1">
                    (Negotiable)
                  </span>
                )}
              </div>

              {/* Poster */}
              <div className="mb-3 text-sm text-gray-600">
                Posted by:{" "}
                <span className="font-medium">
                  {item.internship.postedBy.name}
                </span>
                <div className="text-xs text-gray-500">
                  {item.internship.postedBy.jobsPosted} jobs | ⭐{" "}
                  {item.internship.postedBy.rating}
                </div>
              </div>

              {/* Remote & Applied Time */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    item.internship.isRemote
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.internship.isRemote ? "Remote" : "On-site"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(item.appliedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-4 mt-6">
                {/* View Application */}
                <button
                  id={`view-internship-application-${item._id}`}
                  data-tooltip-content="View Application Data"
                  onClick={() => {
                    setSelectedApplicationID(item._id);
                    document
                      .getElementById("View_Internship_Applications_Modal")
                      .showModal();
                  }}
                  className="flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <img
                    src={InternshipApplication}
                    alt="Application"
                    className="w-5"
                  />
                </button>
                <Tooltip
                  anchorSelect={`#view-internship-application-${item._id}`}
                  place="top"
                  className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                />

                {/* Delete */}
                <div
                  id={`delete-internship-${item._id}`}
                  data-tooltip-content="Cancel Internship"
                  onClick={() => handleDeleteInternship(item._id)}
                  className="flex items-center justify-center w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <ImCross />
                </div>
                <Tooltip
                  anchorSelect={`#delete-internship-${item._id}`}
                  place="top"
                  className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                />

                {/* View Details */}
                <div
                  id={`internship-details-btn-${item._id}`}
                  data-tooltip-content="View Internship Details"
                  onClick={() => {
                    setSelectedInternshipID(item.internship._id);
                    document
                      .getElementById("Internship_Details_Modal")
                      .showModal();
                  }}
                  className="flex items-center justify-center w-11 h-11 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <FaInfo />
                </div>
                <Tooltip
                  anchorSelect={`#internship-details-btn-${item._id}`}
                  place="top"
                  className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full mt-32 px-6 max-w-lg mx-auto">
            <p className="text-3xl font-semibold text-gray-100 mb-4">
              No Applications Found
            </p>
            <p className="text-lg text-gray-300 mb-8">
              You haven’t applied to any internships yet. Explore internships
              and apply to get started.
            </p>
            <Link
              href="/Internships"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 px-8 rounded shadow-lg transition"
            >
              Explore Internships
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* View Application Modal */}
      <dialog id="View_Internship_Applications_Modal" className="modal">
        <MyInternshipApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* Internship Details Modal */}
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
