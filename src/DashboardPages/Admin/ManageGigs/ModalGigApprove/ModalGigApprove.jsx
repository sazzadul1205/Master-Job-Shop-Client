/* eslint-disable react/prop-types */
import { useState } from "react";
import Rating from "react-rating"; // Make sure to install this package
import { FaStar } from "react-icons/fa";

const ModalGigApprove = ({ gigData, onApprove, onClose }) => {
  const [rating, setRating] = useState(parseFloat(gigData?.rating));

  const handleApprove = () => {
    // Call the approve function with the rating
    onApprove(gigData._id, rating);
    onClose(); // Close the modal after approving
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-[600px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Approve Gig</h2>
        <h3 className="font-semibold mb-2">Gig Title: {gigData.gigTitle}</h3>
        <h4 className="font-semibold mb-2">
          Client Name: {gigData.clientName}
        </h4>

        <div>
          <h4 className="font-semibold mb-2">Rating:</h4>
          <Rating
            initialRating={rating}
            emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
            fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
            onChange={(value) => setRating(value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGigApprove;
