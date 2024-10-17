import PropTypes from "prop-types"; // Import PropTypes
import { FaStar } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Rating from "react-rating";

const ModalViewGigs = ({ GigData }) => {
  return (
    <div>
      <div className="modal-box bg-white min-w-[1000px] p-0 pb-10">
        {/* Top part */}
        <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
          <p className="font-bold text-xl">View Gig Details</p>
          <button
            onClick={() => document.getElementById("Modal_Gig_View").close()}
          >
            <ImCross className="hover:text-gray-700" />
          </button>
        </div>

        <div className="px-5">
          <div className="py-5 ">
            <p className="font-bold text-3xl py-2">{GigData?.gigTitle}</p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Client Name:</span>
              {GigData?.clientName}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Gig Type:</span>
              {GigData?.gigType}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Location:</span>
              {GigData?.location}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Payment Rate:</span>
              {GigData?.paymentRate}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold mr-5">Duration:</span>
              {GigData?.duration}
            </p>
          </div>
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Responsibilities:</h4>
            <p>{GigData?.responsibilities}</p>
          </div>
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Required Skills:</h4>
            <p>{GigData?.requiredSkills}</p>
          </div>
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Working Hours:</h4>
            <p>{GigData?.workingHours}</p>
          </div>
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Project Expectations:</h4>
            <p>{GigData?.projectExpectations}</p>
          </div>
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Communication:</h4>
            <p>{GigData?.communication}</p>
          </div>
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Additional Benefits:</h4>
            <p>{GigData?.additionalBenefits}</p>
          </div>
          <div className="flex justify-between items-center mt-5 text-xl">
            <p>
              <span className="font-bold">Posted:</span>
              {new Date(GigData?.postedDate).toLocaleDateString()}
            </p>
            <div>
              <h4 className="font-semibold mb-2">Company Rating:</h4>
              <Rating
                initialRating={parseFloat(GigData?.rating)}
                emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                readonly
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          {GigData?.peopleBided?.length > 0 ? (
            <table className="table border border-gray-300 w-full">
              <thead className="bg-blue-200 text-black">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>About Bider</th>
                  <th>Applied Date</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {GigData?.peopleBided?.map((applicant, i) => (
                  <tr key={i}>
                    <td>
                      <img
                        src={applicant.biderImage}
                        alt={applicant.biderName}
                        className="w-12 h-12"
                      />
                    </td>
                    <td>{applicant.biderName}</td>
                    <td>{applicant.biderEmail}</td>
                    <td>{applicant.AboutBider}</td>
                    <td>{applicant.appliedDate}</td>
                    <td>
                      <a
                        href={applicant.resumeLink}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-red-500 font-bold text-lg">
              No applicants yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add PropTypes validation
ModalViewGigs.propTypes = {
  GigData: PropTypes.shape({
    gigTitle: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    clientType: PropTypes.string,
    gigType: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    paymentRate: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    rating: PropTypes.string.isRequired,
    responsibilities: PropTypes.string.isRequired,
    requiredSkills: PropTypes.string.isRequired,
    workingHours: PropTypes.string.isRequired,
    projectExpectations: PropTypes.string.isRequired,
    communication: PropTypes.string.isRequired,
    additionalBenefits: PropTypes.string.isRequired,
    postedDate: PropTypes.string.isRequired,
    peopleBided: PropTypes.array,
  }).isRequired,
};

export default ModalViewGigs;
