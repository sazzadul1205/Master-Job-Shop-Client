// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../../Shared/Loading/Loading";
import Error from "../../../../Shared/Error/Error";

const MyInternshipApplicationModal = ({
  selectedApplicationID,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedInternshipApplication", selectedApplicationID],
    queryFn: () =>
      axiosPublic
        .get(`/InternshipApplications?id=${selectedApplicationID}`)
        .then((res) => res.data),
    enabled: !!selectedApplicationID,
  });

  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );

  if (error) return <Error />;

  return (
    <div
      id="View_Internship_Applications_Modal"
      className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800">
          Application Summary
        </h3>
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedApplicationID(null);
            document
              .getElementById("View_Internship_Applications_Modal")
              .close();
          }}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600">Full Name</p>
            <p className="text-gray-800">{application?.name || "N/A"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-600">Email</p>
            <p className="text-gray-800">{application?.email || "N/A"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-600">Phone</p>
            <p className="text-gray-800">{application?.phone || "N/A"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-600">Location</p>
            <p className="text-gray-800">{application?.location || "N/A"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-600">Applied</p>
            <p className="text-gray-800">
              {application?.appliedAt
                ? formatDistanceToNow(new Date(application.appliedAt), {
                    addSuffix: true,
                  })
                : "Not available"}
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-600">Resume</p>
            <a
              href={application?.resumeUrl}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-600 mb-1">Cover Letter</p>
          <div className="bg-gray-100 border border-gray-300 rounded p-3 text-gray-800 whitespace-pre-line">
            {application?.coverLetter || "No cover letter provided."}
          </div>
        </div>

        {application?.submittedFiles &&
          application?.submittedFiles.length > 0 && (
            <div>
              <p className="font-medium text-gray-600 mb-1">Attached Files</p>
              <ul className="list-disc list-inside text-blue-700">
                {application?.submittedFiles.map((file, idx) => (
                  <li key={idx}>
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      File {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};

MyInternshipApplicationModal.propTypes = {
  selectedApplicationID: PropTypes.string,
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default MyInternshipApplicationModal;
