import { useState } from "react";

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
import Mentorship from "../../../assets/Navbar/Member/Mentorship.png";

// Modals
import MentorshipDetailsModal from "../../(Public_Pages)/Home/FeaturedMentorship/MentorshipDetailsModal/MentorshipDetailsModal";
import MyMentorshipApplicationModal from "./MyMentorshipApplicationModal/MyMentorshipApplicationModal";

const MyMentorshipApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Mentorship ID
  const [selectedMentorshipApplicationID, setSelectedMentorshipApplicationID] =
    useState(null);
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);

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
        .then((res) => res.data),
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
        .then((res) => res.data),
    enabled: !!user?.email && uniqueMentorshipIds.length > 0,
  });

  // Refetch All
  const refetchAll = async () => {
    await refetchMentorshipApplications();
    await MentorshipRefetch();
  };

  //   UI Error / Loading
  if (loading || MentorshipApplicationsIsLoading || MentorshipIsLoading)
    return <Loading />;
  if (MentorshipApplicationsError || MentorshipError) return <Error />;

  // Merge application & Mentorship data
  const mergedData = MentorshipApplicationsData.map((application) => {
    const mentorship = MentorshipData.find(
      (mentorship) => mentorship._id === application.mentorshipId
    );
    return {
      ...application,
      mentorship,
    };
  }).filter((item) => item.mentorship);

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
          // Refetch updated data
          await refetchAll();

          // Temporary success toast (auto-dismiss)
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Mentorship Application has been successfully removed.",
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
        My Mentorship Applications
      </h3>

      {/* Divider */}
      <p className="bg-white py-[2px] w-1/3 mx-auto" />

      {/* Table */}
      <div className="overflow-x-auto shadow mt-5">
        <table className="min-w-full text-sm text-gray-800">
          {/* Table Header */}
          <thead className="bg-gray-500 border-b text-xs text-white border border-black uppercase tracking-wide cursor-default">
            <tr>
              <th className="px-3 py-4 text-left">Mentorship Title</th>
              <th className="px-3 py-4 text-left">Mentor</th>
              <th className="px-3 py-4 text-left">Skills</th>
              <th className="px-3 py-4 text-left">Fee</th>
              <th className="px-3 py-4 text-left">Applied</th>
              <th className="px-3 py-4 text-left">Status</th>
              <th className="px-3 py-4 text-left">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {mergedData?.length > 0 ? (
              mergedData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  {/* Title & Category */}
                  <td className="px-4 py-3 font-medium">
                    <div>{item.mentorship?.title}</div>
                    <div className="text-xs text-gray-500">
                      {item.mentorship?.category} →{" "}
                      {item.mentorship?.subCategory}
                    </div>
                  </td>

                  {/* Mentor */}
                  <td className="px-4 py-3">
                    <div>{item.mentorship?.mentor?.name}</div>
                    <div className="text-xs text-gray-500">
                      ⭐ {item.mentorship?.mentor?.rating} •{" "}
                      {item.mentorship?.mentor?.totalMentees} mentees
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="px-4 py-3">
                    {item.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1"
                      >
                        {skill}
                      </span>
                    ))}
                  </td>

                  {/* Fee */}
                  <td className="px-4 py-3">
                    {item.mentorship?.fee?.type === "free" ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      <span>
                        ${item.mentorship?.fee?.amount}{" "}
                        <span className="text-xs text-gray-500">
                          {item.mentorship?.fee?.currency}
                        </span>
                      </span>
                    )}
                  </td>

                  {/* Applied */}
                  <td className="px-4 py-3">
                    {item.appliedAt
                      ? formatDistanceToNow(new Date(item.appliedAt), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 capitalize">
                    {item.mentorship?.status || "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 flex items-center gap-2">
                    {/* View Mentorship Application Button */}
                    <>
                      <button
                        id={`view-mentorship-application-${item?._id}`}
                        data-tooltip-content="View Mentorship Application Data"
                        onClick={() => {
                          setSelectedMentorshipApplicationID(item?._id);
                          document
                            .getElementById("View_Mentorship_Application_Modal")
                            .showModal();
                        }}
                        className="bg-white hover:bg-blue-300/50 border-2 border-blue-600 rounded-full p-3 transition cursor-pointer"
                      >
                        <img src={Mentorship} alt="gig app" className="w-5" />
                      </button>
                      <Tooltip
                        anchorSelect={`#view-mentorship-application-${item?._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                      />
                    </>

                    {/* Delete Application Button */}
                    <>
                      <div
                        id={`delete-mentorship-application-${item._id}`}
                        data-tooltip-content="Cancel Mentorship Application"
                        onClick={() =>
                          handleDeleteMentorshipApplication(item._id)
                        }
                        className="p-3 text-lg rounded-full border-2 border-red-500 hover:bg-red-200 cursor-pointer"
                      >
                        <ImCross />
                      </div>
                      <Tooltip
                        anchorSelect={`#delete-mentorship-application-${item._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                      />
                    </>

                    {/* Details Button */}
                    <>
                      <div
                        id={`mentorship-details-btn-${item?._id}`}
                        data-tooltip-content="View Mentorship Details"
                        className="p-3 text-lg rounded-full border-2 border-yellow-500 hover:bg-yellow-200 cursor-pointer"
                        onClick={() => {
                          setSelectedMentorshipID(item?.gig?._id);
                          document
                            .getElementById("Mentorship_Details_Modal")
                            .showModal();
                        }}
                      >
                        <FaInfo />
                      </div>

                      <Tooltip
                        anchorSelect={`#gig-details-btn-${item?._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                      />
                    </>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="View_Mentorship_Application_Modal" className="modal">
        <MyMentorshipApplicationModal
          selectedMentorshipApplicationID={selectedMentorshipApplicationID}
          setSelectedMentorshipApplicationID={
            setSelectedMentorshipApplicationID
          }
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
