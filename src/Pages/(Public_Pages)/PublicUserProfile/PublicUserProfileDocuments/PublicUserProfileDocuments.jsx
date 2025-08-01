import { useState, useEffect } from "react";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaStar } from "react-icons/fa";

const PublicUserProfileDocuments = ({ user }) => {
  // State to hold documents
  const [documents, setDocuments] = useState([]);

  //   Load user documents on mount
  useEffect(() => {
    if (Array.isArray(user?.documents)) {
      const starredDocs = user.documents
        .filter((doc) => doc.starred)
        .map((doc, idx) => ({
          ...doc,
          id: `${doc.name}-${idx}`,
          fileUrl: doc.file,
        }));
      setDocuments(starredDocs);
    }
  }, [user]);

  return (
    <div>
      {/* Header */}
      <h3 className="text-black font-semibold text-lg flex items-center gap-2 pb-5">
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block" />
        <span className="text-blue-700">My Document&apos;s</span>
      </h3>

      {documents.length > 0 ? (
        <ul className="space-y-4">
          {documents.map(({ id, name, fileUrl }) => (
            // Document Item
            <li
              key={id}
              className="flex items-center justify-between border rounded-md p-3 shadow-sm"
            >
              <div className="flex items-center gap-3 max-w-[60%] truncate">
                {/* Static Star Icon */}
                <FaStar className="text-yellow-400 text-xl" />

                {/* Document Name */}
                <a
                  href={fileUrl}
                  download
                  className="text-blue-600 hover:underline truncate"
                  title={`Download ${name}`}
                >
                  {name}
                </a>
              </div>

              {/* Download Button */}
              <div>
                <a
                  href={fileUrl}
                  download
                  title="Download"
                  className="text-green-600 hover:text-green-800 hover:bg-green-100 transition px-3 py-1 rounded border border-green-600 cursor-pointer"
                >
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // Placeholder for no documents
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-600">
          {/* Placeholder Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mb-4 text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
          </svg>

          {/* Placeholder Text */}
          <p className="text-xl font-semibold mb-2">No documents to display</p>

          {/* Placeholder Description */}
          <p className="max-w-sm text-gray-400">
            This user hasn&apos;t highlighted any documents for public viewing.
          </p>
        </div>
      )}
    </div>
  );
};

// Prop Validation
PublicUserProfileDocuments.propTypes = {
  user: PropTypes.shape({
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        file: PropTypes.string.isRequired,
        starred: PropTypes.bool,
      })
    ),
  }),
};

export default PublicUserProfileDocuments;
