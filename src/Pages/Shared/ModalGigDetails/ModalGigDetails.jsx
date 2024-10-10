import PropTypes from "prop-types"; // Import PropTypes for validation
import { FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { Link } from "react-router-dom";

const ModalGigDetails = ({ selectedGig, closeModal }) => {
  // Destructure selectedGig properties
  const {
    gigTitle,
    clientName,
    gigType,
    location,
    paymentRate,
    duration,
    responsibilities,
    requiredSkills,
    workingHours,
    projectExpectations,
    communication,
    additionalBenefits,
    postedDate,
    rating,
    _id,
  } = selectedGig;

  return (
    <div className="modal-box bg-red-50 text-black max-w-[700px]">
      {/* Top */}
      <div className="py-1">
        <p className="font-bold text-2xl">{gigTitle}</p>
        <div className="text-lg">
          <p>
            <span className="font-bold mr-5">Client Name:</span>
            {clientName}
          </p>
          <p>
            <span className="font-bold mr-5">Gig Type:</span>
            {gigType}
          </p>
          <p>
            <span className="font-bold mr-5">Location:</span>
            {location}
          </p>
          <p>
            <span className="font-bold mr-5">Payment Rate:</span>
            {paymentRate}
          </p>
          <p>
            <span className="font-bold mr-5">Duration:</span>
            {duration}
          </p>
        </div>
      </div>

      <div className="text-lg py-3 leading-5">
        <span className="font-bold pr-3">Responsibilities:</span>
        {responsibilities}
      </div>
      <div className="text-lg py-3 leading-5">
        <span className="font-bold pr-3">Required Skills:</span>
        {requiredSkills}
      </div>
      <div className="text-lg py-3 leading-5">
        <span className="font-bold pr-3">Working Hours:</span>
        {workingHours}
      </div>
      <div className="text-lg py-3 leading-5">
        <span className="font-bold pr-3">Project Expectations:</span>
        {projectExpectations}
      </div>
      <div className="text-lg py-3 leading-5">
        <span className="font-bold pr-3">Communication:</span>
        {communication}
      </div>
      <div className="text-lg py-3 leading-5">
        <span className="font-bold pr-3">Additional Benefits:</span>
        {additionalBenefits}
      </div>

      <div className="flex justify-between items-center mt-5">
        <p>
          <span className="font-bold">Posted:</span>
          {new Date(postedDate).toLocaleDateString()}
        </p>
        <div>
          <h4 className="font-semibold mb-2">Company Rating:</h4>
          <Rating
            initialRating={rating}
            emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
            fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
            readonly
          />
        </div>
      </div>

      <div className="modal-action">
        <Link to={`/PostedGigsDetails/${_id}`}>
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Apply Now
          </button>
        </Link>
        <button
          className="bg-red-500 hover:bg-red-600 px-5 py-2 text-lg font-semibold text-white"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// PropTypes validation
ModalGigDetails.propTypes = {
  selectedGig: PropTypes.shape({
    gigTitle: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    gigType: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    paymentRate: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    responsibilities: PropTypes.string.isRequired,
    requiredSkills: PropTypes.string.isRequired,
    workingHours: PropTypes.string.isRequired,
    projectExpectations: PropTypes.string.isRequired,
    communication: PropTypes.string.isRequired,
    additionalBenefits: PropTypes.string.isRequired,
    postedDate: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModalGigDetails;
