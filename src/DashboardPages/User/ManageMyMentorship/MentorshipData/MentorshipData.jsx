import PropTypes from "prop-types";
import { FaRegTrashAlt, FaStar } from "react-icons/fa";
import Rating from "react-rating";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const MentorshipData = ({ mentorshipData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Function to handle review deletion with Swal confirmation
  const handleDeleteReview = async (reviewerEmail) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPublic.delete(
            `/Mentorship/reviews/${mentorshipData?._id}`,
            {
              data: { reviewerEmail },
            }
          );
          if (response.status === 200) {
            Swal.fire("Deleted!", "The review has been deleted.", "success");
            refetch();
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an error deleting the review.",
            "error"
          );
          console.error("Delete review error:", error);
        }
      }
    });
  };

  // Function to handle applicant deletion with Swal confirmation
  const handleDeleteApplicant = async (applicantEmail) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this applicant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPublic.delete(
            `/Mentorship/applicants/${mentorshipData?._id}`,
            {
              data: { applicantEmail },
            }
          );
          if (response.status === 200) {
            Swal.fire("Deleted!", "The applicant has been deleted.", "success");
            refetch();
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an error deleting the applicant.",
            "error"
          );
          console.error("Delete applicant error:", error);
        }
      }
    });
  };

  return (
    <div className="py-5 px-10">
      {/* Content */}
      <div className="flex justify-between">
        <div className="py-2">
          {/* Mentor Name */}
          <p className="font-bold text-3xl">{mentorshipData?.mentorName}</p>

          {/* Expertise */}
          <p className="text-xl py-1 grid grid-cols-2">
            <span className="font-bold mr-5">Expertise:</span>
            {mentorshipData?.expertise}
          </p>

          {/* Duration */}
          <p className="text-xl py-1 grid grid-cols-2">
            <span className="font-bold mr-5">Duration:</span>
            {mentorshipData?.duration}
          </p>

          {/* Contact Email */}
          <p className="text-xl py-1 grid grid-cols-2">
            <span className="font-bold mr-5">Contact Email:</span>
            {mentorshipData?.contactEmail}
          </p>

          {/* Price */}
          <p className="text-xl py-1 grid grid-cols-2">
            <span className="font-bold pr-3">Price:</span>
            {mentorshipData?.price}
          </p>

          {/* Session Format */}
          <p className="text-xl py-1 grid grid-cols-2">
            <span className="font-bold pr-3">Session Format:</span>
            {mentorshipData?.sessionFormat}
          </p>
        </div>

        {/* Mentor Image */}
        {mentorshipData?.mentorImage && (
          <img
            src={mentorshipData?.mentorImage}
            alt={`${mentorshipData?.mentorName} Image`}
            className="w-60 h-60 object-cover mb-4"
          />
        )}
      </div>

      {/* Bio */}
      <p className="text-lg py-2 leading-5">
        <span className="font-bold pr-5 text-xl">Bio:</span>
        {mentorshipData?.mentorBio}
      </p>

      {/* Description */}
      <p className="text-lg">
        <span className="font-bold pr-5 text-xl">Description:</span>
        {mentorshipData?.description}
      </p>

      {/* Language & Rating */}
      <div className="flex justify-between items-center">
        {/* Languages */}
        <p className="text-lg py-2 leading-5">
          <span className="font-bold pr-3">Languages:</span>
          <ul className="list-disc list-inside p-1">
            {mentorshipData?.languages.map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
        </p>

        {/* Rating */}
        <div>
          <h4 className="font-semibold mb-2">Company Rating:</h4>
          <Rating
            initialRating={mentorshipData?.rating}
            emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
            fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
            readonly
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-5">
        <p className="text-xl font-bold">Reviews</p>
        <div className="overflow-x-auto">
          <table className="table border border-black">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th>No</th>
                <th>Reviewer Name</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Applied Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mentorshipData?.reviews.length > 0 ? (
                mentorshipData?.reviews.map((review, index) => (
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
                    <td>
                      <button
                        className="border-2 border-red-500 p-2 hover:bg-red-500 hover:text-white text-lg"
                        onClick={() => handleDeleteReview(review.reviewerEmail)}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    No one has reviewed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Section */}
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mentorshipData?.applicant.length > 0 ? (
                mentorshipData?.applicant.map((applicant, index) => (
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
                    <td>
                      <button
                        className="border-2 border-red-500 p-2 hover:bg-red-500 hover:text-white text-lg"
                        onClick={() =>
                          handleDeleteApplicant(applicant.applicantEmail)
                        }
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    No one has applied yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for MentorshipData component
MentorshipData.propTypes = {
  mentorshipData: PropTypes.shape({
    _id: PropTypes.string,
    mentorName: PropTypes.string,
    expertise: PropTypes.string,
    duration: PropTypes.string,
    contactEmail: PropTypes.string,
    price: PropTypes.number,
    sessionFormat: PropTypes.string,
    mentorImage: PropTypes.string,
    mentorBio: PropTypes.string,
    description: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        reviewerName: PropTypes.string,
        reviewerEmail: PropTypes.string,
        reviewText: PropTypes.string,
        rating: PropTypes.number,
        appliedDate: PropTypes.string,
      })
    ),
    applicant: PropTypes.arrayOf(
      PropTypes.shape({
        applicantName: PropTypes.string,
        applicantEmail: PropTypes.string,
        appliedDate: PropTypes.string,
        applicantDetails: PropTypes.string,
        resumeLink: PropTypes.string,
      })
    ),
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default MentorshipData;
