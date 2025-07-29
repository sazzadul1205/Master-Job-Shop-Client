import { useState } from "react";
import { FaStar } from "react-icons/fa";
import AddNewDocumentModal from "./AddNewDocumentModal/AddNewDocumentModal";

const initialDocuments = [
  {
    id: "resume",
    name: "Resume.pdf",
    fileUrl: "https://example.com/files/john-doe-resume.pdf",
    starred: false,
  },
  {
    id: "portfolio",
    name: "Portfolio.pdf",
    fileUrl: "https://example.com/files/john-doe-portfolio.pdf",
    starred: false,
  },
];

const ProfileDocuments = ({ user }) => {
  const [documents, setDocuments] = useState(initialDocuments);

  lo

  // Toggle star, max 3
  const toggleStar = (id) => {
    const starredCount = documents.filter((d) => d.starred).length;
    setDocuments((docs) =>
      docs.map((doc) => {
        if (doc.id === id) {
          if (!doc.starred && starredCount >= 3) return doc; // max 3 stars
          return { ...doc, starred: !doc.starred };
        }
        return doc;
      })
    );
  };

  // Delete document
  const deleteDocument = (id) => {
    setDocuments((docs) => docs.filter((doc) => doc.id !== id));
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 max-w-7xl mx-auto mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-blue-700">
          Resume & Documents
        </h2>

        {/* Add New Document Modal */}
        <button
          onClick={() =>
            document.getElementById("Add_New_Document_Modal").showModal()
          }
          className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Add New Document
        </button>
      </div>

      {/* Documents List or fallback */}
      {documents.length > 0 ? (
        <ul className="space-y-4">
          {documents.map(({ id, name, fileUrl, starred }) => (
            <li
              key={id}
              className="flex items-center justify-between border rounded-md p-3 shadow-sm"
            >
              <div className="flex items-center gap-3 max-w-[60%] truncate">
                {/* Star Button */}
                <button
                  onClick={() => toggleStar(id)}
                  title={
                    starred
                      ? "Un-star this document"
                      : documents.filter((d) => d.starred).length >= 3
                      ? "Max 3 starred documents"
                      : "Star to prioritize"
                  }
                  disabled={
                    !starred && documents.filter((d) => d.starred).length >= 3
                  }
                  className={`transition cursor-pointer text-xl ${
                    starred
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  <FaStar />
                </button>

                {/* Document Name */}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  title={name}
                >
                  {name}
                </a>
              </div>

              {/* Document Actions */}
              <div className="flex items-center gap-3">
                {/* Download Button */}
                <a
                  href={fileUrl}
                  download={name}
                  title="Download"
                  className="text-green-600 hover:text-green-800 hover:bg-green-100 transition px-3 py-1 rounded border border-green-600 cursor-pointer"
                >
                  Download
                </a>

                {/* Delete Button */}
                <button
                  onClick={() => deleteDocument(id)}
                  title="Delete document"
                  className="text-red-600 hover:text-red-800 hover:bg-red-100 transition px-3 py-1 rounded border border-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // Fallback UI
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          {/* Empty Icon */}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          {/* Fallback Title */}
          <p className="text-xl font-semibold mb-2">
            No documents uploaded yet
          </p>

          {/* Fallback Description */}
          <p className="max-w-sm text-gray-400">
            Upload your important files here. Click &quot;Add New Document&quot;
            to get started.
          </p>
        </div>
      )}

      {/* Add New Document Modal */}
      <dialog id="Add_New_Document_Modal" className="modal">
        <AddNewDocumentModal user={user} />
      </dialog>
    </div>
  );
};

export default ProfileDocuments;
