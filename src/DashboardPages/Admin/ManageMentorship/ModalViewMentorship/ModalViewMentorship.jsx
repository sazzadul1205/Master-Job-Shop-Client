import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Rating from "react-rating";

const ModalViewMentorship = ({ mentorData }) => {
  return (
    <div className="modal-box bg-white max-w-[1000px] p-0 pb-10">
      {/* Top part */}
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p className="font-bold text-xl">View Mentorship</p>
        <button
          onClick={() =>
            document.getElementById("Modal_Mentorship_View").close()
          }
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <div className="py-2 px-10">
        {/* Content */}
        <div className="flex justify-between">
          <div className="py-2">
            {/* Mentor Name */}
            <p className="font-bold text-3xl">{mentorData.mentorName}</p>

            {/* Expertise */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Expertise:</span>
              {mentorData.expertise}
            </p>

            {/* Duration */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Duration:</span>
              {mentorData.duration}
            </p>

            {/* Contact Email */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold mr-5">Contact Email:</span>
              {mentorData.contactEmail}
            </p>

            {/* Price */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold pr-3">Price:</span>
              {mentorData.price}
            </p>

            {/* Session Format */}
            <p className="text-xl py-1 grid grid-cols-2">
              <span className="font-bold pr-3">Session Format:</span>
              {mentorData.sessionFormat}
            </p>
          </div>

          {/* Mentor Image */}
          {mentorData.mentorImage && (
            <img
              src={mentorData.mentorImage}
              alt={`${mentorData.mentorName} Image`}
              className="w-60 h-60 object-cover mb-4"
            />
          )}
        </div>

        {/* Bio */}
        <p className="text-lg py-2 leading-5">
          <span className="font-bold pr-5 text-xl">Bio:</span>
          {mentorData.mentorBio}
        </p>

        {/* Description */}
        <p className="text-lg">
          <span className="font-bold pr-5 text-xl">Description:</span>
          {mentorData.description}
        </p>

        {/* Language & Rating */}
        <div className="flex justify-between items-center">
          {/* Languages */}
          <p className="text-lg py-2 leading-5">
            <span className="font-bold pr-3">Languages:</span>
            <ul className="list-disc list-inside p-1">
              {mentorData.languages.map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
          </p>

          <div>
            <h4 className="font-semibold mb-2">Company Rating:</h4>
            <Rating
              initialRating={mentorData.rating}
              emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
              fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
              readonly
            />
          </div>
        </div>

        {/* Reviews Section */}
        {mentorData.reviews?.length > 0 && (
          <div className="py-5">
            <p className="text-xl font-bold">Reviews</p>
            <div className="overflow-x-auto p-2">
              <table className="table border border-black">
                <thead className="bg-gray-500 text-white">
                  <tr>
                    <th>No</th>
                    <th>Reviewer Name</th>
                    <th>Review</th>
                    <th>Rating</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mentorData.reviews.map((review, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{review.reviewerName}</td>
                      <td>{review.reviewText}</td>
                      <td>
                        <Rating
                          initialRating={review.rating}
                          emptySymbol={<FaStar className="text-gray-400" />}
                          fullSymbol={<FaStar className="text-yellow-500" />}
                          readonly
                        />
                      </td>
                      <td>{review.appliedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applicant Section */}
        {mentorData.applicant?.length > 0 && (
          <div className="py-5">
            <p className="text-xl font-bold">Applicants</p>
            <div className="overflow-x-auto p-2">
              <table className="table border border-black">
                <thead className="bg-gray-500 text-white">
                  <tr>
                    <th>No</th>
                    <th>Applicant Name</th>
                    <th>Email</th>
                    <th>Applied Date</th>
                    <th>Details</th>
                    <th>Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {mentorData.applicant.map((applicant, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{applicant.applicantName}</td>
                      <td>{applicant.applicantEmail}</td>
                      <td>{applicant.appliedDate}</td>
                      <td>{applicant.applicantDetails}</td>
                      <td>
                        <a
                          href={applicant.resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Resume
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Define prop types for validation
ModalViewMentorship.propTypes = {
  mentorData: PropTypes.shape({
    mentorName: PropTypes.string.isRequired,
    expertise: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    contactEmail: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    sessionFormat: PropTypes.string.isRequired,
    mentorImage: PropTypes.string,
    mentorBio: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        reviewerName: PropTypes.string.isRequired,
        reviewText: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        appliedDate: PropTypes.string.isRequired,
      })
    ),
    applicant: PropTypes.arrayOf(
      PropTypes.shape({
        applicantName: PropTypes.string.isRequired,
        applicantEmail: PropTypes.string.isRequired,
        appliedDate: PropTypes.string.isRequired,
        applicantDetails: PropTypes.string.isRequired,
        resumeLink: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default ModalViewMentorship;
