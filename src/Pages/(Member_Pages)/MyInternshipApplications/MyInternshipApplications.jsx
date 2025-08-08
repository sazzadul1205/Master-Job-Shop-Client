import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Packages
import { formatDistanceToNow, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Assets & Icons
import InternshipApplicationWhite from "../../../assets/EmployerLayout/InternshipApplication/InternshipApplicationWhite.png";

import { ImCross } from "react-icons/im";
import { FaInfo, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";

// Modals
import MyInternshipApplicationModal from "./MyInternshipApplicationModal/MyInternshipApplicationModal";
import InternshipDetailsModal from "../../(Public_Pages)/Home/FeaturedInternships/InternshipDetailsModal/InternshipDetailsModal";

const MyInternshipApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // UI & State
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

  // Extract unique internship IDs
  const uniqueInternshipIds = [
    ...new Set(InternshipApplicationsData.map((app) => app.internshipId)),
  ];

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
          setApplicationList((prev) => prev.filter((app) => app._id !== id));

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Internship Application has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });

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

  if (loading || InternshipApplicationsIsLoading || InternshipsIsLoading)
    return <Loading />;
  if (InternshipApplicationsError || InternshipsError) return <Error />;

  // Merge applications with internship data
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
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Internship Applications
      </h3>

      <div className="flex items-center justify-center gap-4 my-5">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
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
                  {item.internship.budget.currency}
                  {item.internship.budget.min} - {item.internship.budget.max}
                </span>
                {item.internship.budget.isNegotiable && (
                  <span className="text-green-600 text-xs ml-1">
                    (Negotiable)
                  </span>
                )}
              </div>

              {/* Posted By */}
              <div className="mb-3 text-sm text-gray-600">
                Posted by:{" "}
                <span className="font-medium">
                  {item.internship.postedBy.name}
                </span>
                <div className="text-xs text-gray-500">
                  {item.internship.postedBy.jobsPosted ?? 0} jobs | ⭐{" "}
                  {item.internship.postedBy.rating ?? "N/A"}
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
                  Applied{" "}
                  {formatDistanceToNow(new Date(item.appliedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Start Date */}
              <div className="mb-3 text-sm text-gray-600">
                Start Date:{" "}
                <span className="font-medium">
                  {format(new Date(item.startDate), "PPP")}
                </span>
              </div>

              {/* Resume */}
              <div className="mb-3 flex items-center gap-2 text-blue-600">
                <FaFilePdf />
                <a
                  href={item.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 flex items-center gap-1"
                >
                  View Resume <FaExternalLinkAlt className="text-xs" />
                </a>
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
                    src={InternshipApplicationWhite}
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
                <button
                  id={`delete-internship-${item._id}`}
                  data-tooltip-content="Cancel Internship"
                  onClick={() => handleDeleteInternship(item._id)}
                  className="flex items-center justify-center w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <ImCross />
                </button>
                <Tooltip
                  anchorSelect={`#delete-internship-${item._id}`}
                  place="top"
                  className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                />

                {/* View Details */}
                <button
                  id={`internship-details-btn-${item._id}`}
                  data-tooltip-content="View Internship Details"
                  onClick={() => {
                    setSelectedInternshipID(item.internship._id);
                    document
                      .getElementById("Internship_Details_Modal")
                      .showModal();
                  }}
                  className="flex items-center justify-center w-11 h-11 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <FaInfo />
                </button>
                <Tooltip
                  anchorSelect={`#internship-details-btn-${item._id}`}
                  place="top"
                  className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full mt-24 px-6 max-w-xl mx-auto">
            <p className="text-2xl font-medium text-white mb-3">
              No Internship Applications Found
            </p>
            <p className="text-gray-200 font-semibold text-lg mb-5">
              You haven’t applied to any internships yet. Explore internships
              and apply to get started.
            </p>
            <Link
              to="/Internships"
              className="inline-block bg-gradient-to-br from-white to-gray-200 text-black font-semibold py-3 px-10 shadow-lg hover:shadow-xl rounded transition"
            >
              Explore Internships
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      <dialog id="View_Internship_Applications_Modal" className="modal">
        <MyInternshipApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

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
