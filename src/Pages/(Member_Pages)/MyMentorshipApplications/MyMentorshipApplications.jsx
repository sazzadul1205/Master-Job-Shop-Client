import { Link } from "react-router-dom";
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

// Icons
import { FaInfo } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assets
import JobApplication from "../../../assets/EmployerLayout/formWhite.png";

// Modals
import MentorshipDetailsModal from "../../(Public_Pages)/Home/FeaturedMentorship/MentorshipDetailsModal/MentorshipDetailsModal";
import MyMentorshipApplicationModal from "./MyMentorshipApplicationModal/MyMentorshipApplicationModal";

const MyMentorshipApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Mentorship ID
  const [applicationList, setApplicationList] = useState([]);
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // Step 1: Fetch Mentorship Bids
  const {
    data: MentorshipApplicationsData = [],
    isLoading: MentorshipApplicationsIsLoading,
    error: MentorshipApplicationsError,
    refetch: refetchMentorshipApplications,
  } = useQuery({
    queryKey: ["MentorshipApplicationsData"],
    queryFn: () =>
      axiosPublic
        .get(`/MentorshipApplications?email=${user?.email}`)
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email,
  });

  // Step 2: Extract unique mentorshipIds
  const mentorshipIds = MentorshipApplicationsData.map(
    (app) => app.mentorshipId
  );
  const uniqueMentorshipIds = [...new Set(mentorshipIds)];

  //   Step 3: Fetch Mentorship Data
  const {
    data: MentorshipData = [],
    isLoading: MentorshipIsLoading,
    error: MentorshipError,
    refetch: MentorshipRefetch,
  } = useQuery({
    queryKey: ["MentorshipData", uniqueMentorshipIds],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?mentorshipIds=${uniqueMentorshipIds.join(",")}`)
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email && uniqueMentorshipIds.length > 0,
  });

  useEffect(() => {
    if (MentorshipApplicationsData.length > 0) {
      setApplicationList(MentorshipApplicationsData);
    }
  }, [MentorshipApplicationsData]);

  // Delete Bid Handler
  const handleDeleteMentorshipApplication = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the Mentorship Application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`/MentorshipApplications/${id}`);

        if (res.status === 200) {
          // Temporary success toast (auto-dismiss)
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Mentorship Application has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Silent refetch
          await refetchMentorshipApplications({ throwOnError: false });
          await MentorshipRefetch({ throwOnError: false });
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

  //   UI Error / Loading
  if (loading || MentorshipApplicationsIsLoading || MentorshipIsLoading)
    return <Loading />;
  if (MentorshipApplicationsError || MentorshipError) return <Error />;

  // Merge mentorship and applications
  const mergedData = applicationList
    .map((application) => {
      const mentorship = MentorshipData.find(
        (item) => item._id === application.mentorshipId
      );
      return {
        ...application,
        mentorship,
      };
    })
    .filter((item) => item.mentorship);

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Mentorship Applications
      </h3>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mergedData.length > 0 ? (
          mergedData.map((item) => {
            return (
              <article
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between min-h-[320px]"
              >
                {/* Title & Category */}
                <div>
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-1 truncate"
                    title={item.mentorship?.title}
                  >
                    {item.mentorship?.title || "Mentorship Title"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.mentorship?.category} • {item.mentorship?.subCategory}
                  </p>
                </div>

                {/* Mentor Info */}
                <div className="mt-4 text-sm text-gray-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.mentorship?.Mentor?.profileImage}
                      alt={item.mentorship?.Mentor?.name}
                      className="w-8 h-8 rounded-full border"
                    />
                    <span className="font-medium">
                      {item.mentorship?.Mentor?.name || "N/A"}
                    </span>
                  </div>
                  <p>
                    <span className="font-semibold">Fee:</span>{" "}
                    {item.mentorship?.fee?.isFree
                      ? "Free"
                      : `$${item.mentorship?.fee?.amount} ${item.mentorship?.fee?.currency}`}
                  </p>
                  <p>
                    <span className="font-semibold">Applied:</span>{" "}
                    {item.appliedAt
                      ? formatDistanceToNow(new Date(item.appliedAt), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {item.mentorship?.status || "N/A"}
                  </p>
                </div>

                {/* Key Skills (Top 3 only) */}
                {item.skills?.length > 0 && (
                  <div className="mt-4">
                    <span className="font-semibold text-gray-800 block mb-1">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {item.skills.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{item.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-3 mt-6">
                  {/* View Application */}
                  <button
                    id={`view-app-${item._id}`}
                    data-tooltip-content="View Application"
                    onClick={() => {
                      setSelectedApplicationID(item._id);
                      document
                        .getElementById("View_Mentorship_Application_Modal")
                        ?.showModal();
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition cursor-pointer"
                  >
                    <img
                      src={JobApplication}
                      alt="Job Application"
                      className="w-5"
                    />
                  </button>
                  <Tooltip anchorSelect={`#view-app-${item._id}`} place="top" />

                  {/* Cancel */}
                  <button
                    id={`delete-app-${item._id}`}
                    data-tooltip-content="Cancel Application"
                    onClick={() => handleDeleteMentorshipApplication(item._id)}
                    className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition cursor-pointer"
                  >
                    <ImCross size={16} />
                  </button>
                  <Tooltip
                    anchorSelect={`#delete-app-${item._id}`}
                    place="top"
                  />

                  {/* Mentorship Details */}
                  <button
                    id={`details-btn-${item._id}`}
                    data-tooltip-content="View Mentorship Details"
                    onClick={() => {
                      setSelectedMentorshipID(item?.mentorship?._id);
                      document
                        .getElementById("Mentorship_Details_Modal")
                        ?.showModal();
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow transition cursor-pointer"
                  >
                    <FaInfo size={16} />
                  </button>
                  <Tooltip
                    anchorSelect={`#details-btn-${item._id}`}
                    place="top"
                  />
                </div>
              </article>
            );
          })
        ) : (
          <div className=" text-center col-span-full mt-24 px-6 max-w-xl mx-auto">
            <p className="text-2xl font-medium text-white mb-3">
              No Mentorship Applications Found
            </p>
            <p className="text-gray-200 font-semibold text-lg mb-5">
              You haven’t applied to any mentorship&apos;s yet. Browse available
              mentorship&apos;s and apply to grow under expert guidance.
            </p>
            <Link
              to="/Mentorship"
              className="inline-block bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-200 text-black font-semibold py-3 px-10 shadow-lg hover:shadow-xl rounded transition"
            >
              Explore Mentorship&apos;s
            </Link>
          </div>
        )}
      </div>

      {/* Modal */}
      <dialog id="View_Mentorship_Application_Modal" className="modal">
        <MyMentorshipApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* Mentorship Modal */}
      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>
    </section>
  );
};

export default MyMentorshipApplications;
