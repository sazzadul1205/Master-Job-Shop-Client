import { useQuery } from "@tanstack/react-query";
import { ImCross } from "react-icons/im";
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditMentorshipModal = ({
  selectedMentorshipID,
  setSelectedMentorshipID,
}) => {
  const axiosPublic = useAxiosPublic();

  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Mentorship Data
  const {
    data: MentorshipData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedMentorshipData", selectedMentorshipID],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?id=${selectedMentorshipID}`)
        .then((res) => res.data),
    enabled: !!selectedMentorshipID,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: MentorshipData?.title || "",
      description: MentorshipData?.description || "",
      category: MentorshipData?.category || "",
      subCategory: MentorshipData?.subCategory || "",
      durationWeeks: MentorshipData?.durationWeeks || "",
      sessionsPerWeek: MentorshipData?.sessionsPerWeek || "",
      sessionLength: MentorshipData?.sessionLength || "",
      sessionDays: MentorshipData?.sessionDays || [],
      sessionStartTime: MentorshipData?.sessionStartTime || "",
      sessionEndTime: MentorshipData?.sessionEndTime || "",
      location: MentorshipData?.location || {
        city: "",
        state: "",
        country: "",
        address: "",
      },
      fee: MentorshipData?.fee || {
        isFree: false,
        type: "",
        amount: "",
        currency: "",
        paymentMethod: "",
        confirmationType: "",
        negotiable: false,
        paymentLink: "",
      },
      startDate: MentorshipData?.startDate || "",
      endDate: MentorshipData?.endDate || "",
      communication: MentorshipData?.communication || {
        preferredMethod: "",
        groupChatEnabled: false,
        oneOnOneSupport: false,
        frequency: "",
        notes: "",
      },
    },
  });

  // Close Modal
  const handleClose = () => {
    setSelectedMentorshipID("");
    document.getElementById("Mentorship_Details_Modal")?.close();
  };

  // Re-run reset whenever MentorshipData changes
  useEffect(() => {
    if (MentorshipData) {
      reset({
        title: MentorshipData?.title || "",
        description: MentorshipData?.description || "",
        category: MentorshipData?.category || "",
        subCategory: MentorshipData?.subCategory || "",
        durationWeeks: MentorshipData?.durationWeeks || "",
        sessionsPerWeek: MentorshipData?.sessionsPerWeek || "",
        sessionLength: MentorshipData?.sessionLength || "",
        sessionDays: MentorshipData?.sessionDays || [],
        sessionStartTime: MentorshipData?.sessionStartTime || "",
        sessionEndTime: MentorshipData?.sessionEndTime || "",
        location: MentorshipData?.location || {
          city: "",
          state: "",
          country: "",
          address: "",
        },
        fee: MentorshipData?.fee || {
          isFree: false,
          type: "",
          amount: "",
          currency: "",
          paymentMethod: "",
          confirmationType: "",
          negotiable: false,
          paymentLink: "",
        },
        startDate: MentorshipData?.startDate || "",
        endDate: MentorshipData?.endDate || "",
        communication: MentorshipData?.communication || {
          preferredMethod: "",
          groupChatEnabled: false,
          oneOnOneSupport: false,
          frequency: "",
          notes: "",
        },
      });
    }
  }, [MentorshipData, reset]);

  // If loading
  if (isLoading)
    return (
      <div className="min-w-[600px] max-h-[90vh] relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Loading />
      </div>
    );

  // If error
  if (error)
    return (
      <div className="min-w-[600px] max-h-[90vh] relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Error />
      </div>
    );

  if (!MentorshipData) return null;

  return (
    <div
      id="Edit_Mentorship_Modal"
      className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => handleClose()}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        Create Mentor Profile
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Alert Messages */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Modal Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Inputs ---- */}
      </form>
    </div>
  );
};

export default EditMentorshipModal;
