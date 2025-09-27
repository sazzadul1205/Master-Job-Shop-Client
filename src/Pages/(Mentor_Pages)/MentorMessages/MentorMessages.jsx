import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { IoMdAdd } from "react-icons/io";
import { FiRefreshCcw } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Components
import MentorMessagesAvatar from "./MentorMessagesAvatar/MentorMessagesAvatar";

const MentorMessages = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Managements
  const [setTitle] = useState("");
  const [activeTab, setActiveTab] = useState("emails");
  const [selectedItem, setSelectedItem] = useState(null);

  // --------- My Messages Fetch APIs ---------
  const {
    data: MyMessagesData,
    isLoading: MyMessagesIsLoading,
    refetch: MyMessagesRefetch,
    error: MyMessagesError,
  } = useQuery({
    queryKey: ["MyMessagesData"],
    queryFn: () =>
      axiosPublic
        .get(`/MentorMessages?email=${user?.email}`)
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
  });

  // --------- My Emails Fetch APIs ---------
  const {
    data: MyEmailsData,
    isLoading: MyEmailsIsLoading,
    refetch: MyEmailsRefetch,
    error: MyEmailsError,
  } = useQuery({
    queryKey: ["MyEmailsData"],
    queryFn: () =>
      axiosPublic
        .get(`/MentorEmails?email=${user?.email}`)
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
  });

  // Loading & Error UI
  if (loading || MyMessagesIsLoading || MyEmailsIsLoading) return <Loading />;
  if (MyMessagesError || MyEmailsError) return <Error />;

  // Refetch All
  const RefetchAll = () => {
    MyMessagesRefetch();
    MyEmailsRefetch();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between pt-7 pb-4 px-8 bg-white shadow-sm">
        <h3 className="text-3xl font-semibold">Messages & Emails</h3>
        <button
          onClick={RefetchAll}
          title="Refresh"
          className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm transition"
        >
          <FiRefreshCcw className="w-5 h-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex px-8 gap-4 py-6">
        {/* Left Sidebar */}
        <div className="w-1/4 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
            <IoMdAdd className="w-5 h-5" />
            Add Message
          </button>

          <div className="flex bg-gray-200 rounded-lg p-1 shadow-inner">
            <button
              onClick={() => setActiveTab("emails")}
              className={`flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === "emails"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Emails
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === "phone"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Phone Messages
            </button>
          </div>

          <div className="border-t border-gray-300 mt-2" />

          {/* Message/Email List */}
          <div className="space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
            {activeTab === "emails" ? (
              Array.isArray(MyEmailsData) && MyEmailsData.length ? (
                MyEmailsData.map((email) => (
                  <div
                    key={email._id}
                    onClick={() => {
                      setSelectedItem(email);
                      setTitle(email.subject || "");
                    }}
                    className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
                  >
                    <p className="font-semibold text-sm truncate">
                      {email.subject || "Untitled Email"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(email.sentAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 italic">No emails found</div>
              )
            ) : Array.isArray(MyMessagesData) && MyMessagesData.length ? (
              MyMessagesData.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => {
                    setSelectedItem(msg);
                    setTitle(msg.title || "");
                  }}
                  className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
                >
                  <p className="font-semibold text-sm truncate">
                    {msg.title || "Untitled Message"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.sentAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500 italic">No messages found</div>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div className="w-3/4 bg-white rounded-lg shadow p-6 ">
          {selectedItem ? (
            // Message Content
            <div className="space-y-4">
              {/* Title / Subject */}
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedItem.title || selectedItem.subject}
              </h2>

              {/* Name & Email */}
              <p>
                <span className="font-semibold">From:</span> {selectedItem.name}{" "}
                ({selectedItem.email})
              </p>

              {/* Avatar */}
              <MentorMessagesAvatar selectedItem={selectedItem} />

              {/* Sent At */}
              <p>
                <span className="font-semibold">Sent At:</span>{" "}
                {new Date(selectedItem.sentAt).toLocaleString()}
              </p>

              {/* Message */}
              <div className="bg-gray-50 text-gray-900 p-4 rounded-md shadow-inner whitespace-pre-wrap">
                {selectedItem.message_raw}
              </div>
            </div>
          ) : (
            // Placeholder
            <div className="flex flex-col items-center justify-center h-full px-6">
              {/* Icon */}
              <HiOutlineMail className="text-gray-300 text-6xl mb-4" />

              {/* Message */}
              <p className="text-center text-gray-400 italic text-base sm:text-lg bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 shadow-sm">
                Select a message or email to preview its content here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorMessages;
