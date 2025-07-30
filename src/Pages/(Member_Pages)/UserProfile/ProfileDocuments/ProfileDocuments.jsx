import { useState, useEffect } from "react";

// Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Icons
import { FaStar } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Components
import AddNewDocumentModal from "./AddNewDocumentModal/AddNewDocumentModal";

const ProfileDocuments = ({ user, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State
  const [documents, setDocuments] = useState([]);

  // Load user documents on mount
  useEffect(() => {
    if (user?.documents) {
      // Assign unique IDs for internal handling
      const docsWithIds = user.documents.map((doc, idx) => ({
        ...doc,
        id: `${doc.name}-${idx}`,
        fileUrl: doc.file, // for consistent naming
      }));
      setDocuments(docsWithIds);
    }
  }, [user]);

  // Toggle star with optimistic update and rollback on failure
  const toggleStar = async (id) => {
    const targetDoc = documents.find((doc) => doc.id === id);
    if (!targetDoc) return;

    const starredCount = documents.filter((d) => d.starred).length;

    // Prevent toggling on if max 3 starred reached
    if (!targetDoc.starred && starredCount >= 3) {
      Swal.fire({
        icon: "warning",
        title: "Limit reached",
        text: "You can star up to 3 documents only.",
      });
      return;
    }

    // Save previous state for rollback
    const previousDocuments = [...documents];

    // Optimistically update UI
    const updatedDocuments = documents.map((doc) =>
      doc.id === id ? { ...doc, starred: !doc.starred } : doc
    );
    setDocuments(updatedDocuments);

    try {
      // Call backend to toggle star
      await axiosPublic.put(`/Users/ToggleStar/${user._id}`, {
        name: targetDoc.name,
      });

      refetch();
      // Success: nothing more needed here, UI already updated
    } catch (err) {
      // On failure, rollback UI and show error
      setDocuments(previousDocuments);

      Swal.fire({
        icon: "error",
        title: "Toggle failed",
        text: err.response?.data?.message || "Failed to update star status.",
        confirmButtonText: "OK",
      });
    }
  };

  // Delete document handler with confirmation and optimistic update
  const deleteDocument = async (id, name) => {
    const confirm = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "Are you sure you want to remove this document? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        // Optimistic update
        setDocuments((docs) => docs.filter((doc) => doc.id !== id));

        await axiosPublic.delete(`/Users/DeleteDocument/${user._id}`, {
          data: { name },
        });

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${name} has been deleted.`,
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
      } catch (err) {
        console.error("Failed to delete document:", err);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.response?.data?.message || "Something went wrong.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 max-w-7xl mx-auto mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-700">
          Resume & Documents
        </h2>
        <button
          onClick={() =>
            document.getElementById("Add_New_Document_Modal").showModal()
          }
          className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Add New Document
        </button>
      </div>

      {/* Document List */}
      {documents.length > 0 ? (
        <ul className="space-y-4">
          {documents.map(({ id, name, fileUrl, starred }) => (
            <li
              key={id}
              className="flex items-center justify-between border rounded-md p-3 shadow-sm"
            >
              <div className="flex items-center gap-3 max-w-[60%] truncate">
                {/* Star */}
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
                  download
                  className="text-blue-600 hover:underline truncate"
                  title={`Download ${name}`}
                >
                  {name}
                </a>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <a
                  href={fileUrl}
                  download
                  title="Download"
                  className="text-green-600 hover:text-green-800 hover:bg-green-100 transition px-3 py-1 rounded border border-green-600 cursor-pointer"
                >
                  Download
                </a>

                <button
                  onClick={() => deleteDocument(id, name)}
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
        // Fallback when no documents
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
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
          <p className="text-xl font-semibold mb-2">
            No documents uploaded yet
          </p>
          <p className="max-w-sm text-gray-400">
            Upload your important files here. Click &quot;Add New Document&quot;
            to get started.
          </p>
        </div>
      )}

      {/* Add Modal */}
      <dialog id="Add_New_Document_Modal" className="modal">
        <AddNewDocumentModal user={user} refetch={refetch} />
      </dialog>
    </div>
  );
};

// Prop Validation
ProfileDocuments.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        file: PropTypes.string.isRequired,
        starred: PropTypes.bool,
      })
    ),
  }).isRequired,
  refetch: PropTypes.func,
};

export default ProfileDocuments;
