// Packages
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { format } from "date-fns";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../../Shared/Loading/Loading";
import Error from "../../../../Shared/Error/Error";

const MyGigBidsModal = ({ selectedGigID, setSelectedGigID }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected Bids Data
  const {
    data: bidsData = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedGigBidsData", selectedGigID],
    queryFn: () =>
      axiosPublic.get(`/GigBids?id=${selectedGigID}`).then((res) => res.data),
    enabled: !!selectedGigID,
  });

  // UI Loading / Error State
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

  return (
    <div className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800">Bid Summary</h3>
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedGigID(null);
            document.getElementById("View_Gig_Bids_Modal").close();
          }}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-5 text-gray-800 space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Full Name:</span>
            <p className="text-gray-900">{bidsData?.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Email Address:</span>
            <p className="text-gray-900">{bidsData?.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Phone Number:</span>
            <p className="text-gray-900">{bidsData?.phone}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Submitted At:</span>
            <p className="text-gray-900">
              {bidsData?.submittedAt
                ? format(new Date(bidsData.submittedAt), "PPpp")
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Bid Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Bid Amount:</span>
            <p className="text-gray-900">${bidsData?.bidAmount}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Delivery Time:</span>
            <p className="text-gray-900">{bidsData?.deliveryDays} Days</p>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="text-sm">
          <span className="font-medium text-gray-600 block mb-2">
            Cover Letter:
          </span>
          <div className="bg-gray-100 p-4 rounded-lg text-gray-700 whitespace-pre-line leading-relaxed">
            {bidsData?.coverLetter}
          </div>
        </div>
      </div>
    </div>
  );
};

MyGigBidsModal.propTypes = {
  selectedGigID: PropTypes.string,
  setSelectedGigID: PropTypes.func.isRequired,
};

export default MyGigBidsModal;
