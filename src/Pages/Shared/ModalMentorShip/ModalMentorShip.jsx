import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { Link } from "react-router-dom";

const ModalMentorShip = ({ selectedMentor, closeModal }) => {
  return (
    <div className="modal-box bg-emerald-50 text-black max-w-[800px]">
      {/* Top */}
      <div className="flex flex-col-reverse md:flex-row justify-between gap-5">
        {/* Content */}
        <div>
          {/* Name */}
          <p className="font-bold text-2xl">{selectedMentor.mentorName}</p>

          {/* Expertise */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28  mr-5">Expertise:</span>
            <span className="ml-5">{selectedMentor.expertise}</span>
          </p>

          {/* Duration */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28  mr-5">Duration:</span>
            <span className="ml-5">{selectedMentor.duration}</span>
          </p>

          {/* price */}
          <p className="text-lg flex flex-col md:flex-row py-2 leading-5">
            <span className="font-bold w-28  mr-5">Price:</span>
            <span className="ml-5">{selectedMentor.price}</span>
          </p>

          {/* contactEmail */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28  mr-5">ContactEmail:</span>
            <span className="ml-5">{selectedMentor.contactEmail}</span>
          </p>
        </div>
        {/* Mentor Image */}
        <div>
          {selectedMentor.mentorImage && (
            <img
              src={selectedMentor.mentorImage}
              alt={`${selectedMentor.mentorName} Image`}
              className="w-60 h-60 object-cover mb-4"
            />
          )}
        </div>
      </div>

      {/* Bio */}
      <p className="text-lg flex flex-col md:flex-row py-2 leading-5">
        <span className="font-bold pr-3">Bio:</span>
        <span className="ml-5">{selectedMentor.mentorBio}</span>
      </p>

      {/* Description */}
      <p className="text-lg flex flex-col md:flex-row py-2 leading-5">
        <span className="font-bold mr-5">Description:</span>
        <span className="ml-5">{selectedMentor.description}</span>
      </p>

      {/* sessionFormat */}
      <p className="text-lg flex flex-col md:flex-row py-2 leading-5">
        <span className="font-bold pr-3">Session Format:</span>
        <span className="ml-5">{selectedMentor.sessionFormat}</span>
      </p>

      <div className="flex justify-between items-center">
        {/* Languages */}
        <p className="text-lg py-2 leading-5">
          <span className="font-bold pr-3">Languages:</span>
          <ul className="list-disc list-inside p-1">
            {selectedMentor.languages.map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
        </p>

        {/* Rating */}
        <div>
          <h4 className="font-semibold mb-2">Company Rating:</h4>
          <Rating
            initialRating={selectedMentor.rating}
            emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
            fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
            readonly
          />
        </div>
      </div>

      <div className="modal-action">
        <Link to={`/Mentorship/${selectedMentor._id}`}>
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Join Now
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
ModalMentorShip.propTypes = {
  selectedMentor: PropTypes.shape({
    mentorName: PropTypes.string.isRequired,
    expertise: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    contactEmail: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    mentorImage: PropTypes.string,
    mentorBio: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    sessionFormat: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModalMentorShip;
