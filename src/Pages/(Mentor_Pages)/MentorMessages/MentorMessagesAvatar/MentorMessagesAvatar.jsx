// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Tooltip
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
  AiOutlineReload,
} from "react-icons/ai";

// Assets
const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=ccc&color=555&size=64";

const MentorMessagesAvatar = ({ selectedItem }) => {
  const axiosPublic = useAxiosPublic();

  // Get emails and phones
  const emails =
    selectedItem?.recipients
      ?.filter((r) => r.to_email)
      .map((r) => r.to_email) || [];
  const phones =
    selectedItem?.recipients
      ?.filter((r) => r.to_phone)
      .map((r) => r.to_phone) || [];

  // --------- Recipients Profiles Fetch APIs ---------
  const {
    data: recipientProfiles = [],
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["recipientProfiles", emails, phones],
    queryFn: async () => {
      if (emails.length === 0 && phones.length === 0) return [];
      const params = new URLSearchParams();
      if (emails.length) params.append("emails", emails.join(","));
      if (phones.length) params.append("phones", phones.join(","));
      const res = await axiosPublic.get(
        `/Users/ProfilesByContacts?${params.toString()}`
      );
      return res.data;
    },
    enabled: selectedItem?.recipients?.length > 0,
  });

  // Loading state
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center p-6">
        {/* Loading Icon */}
        <AiOutlineLoading3Quarters className="w-10 h-10 text-blue-500 animate-spin" />

        {/* Loading Message */}
        <p className="text-gray-700 mt-2">Loading recipients...</p>
      </div>
    );

  // Error state with refetch button
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center p-6 gap-2 bg-red-100 rounded-lg shadow-md">
        {/* Error Icon */}
        <AiOutlineExclamationCircle className="w-10 h-10 text-red-500" />

        {/* Error Message */}
        <p className="text-red-700">Error loading recipients.</p>

        {/* Retry Button */}
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <AiOutlineReload /> Retry
        </button>
      </div>
    );

  return (
    <div className="flex flex-wrap gap-2">
      {/* Recipients avatars */}
      {selectedItem.recipients?.map((r, idx) => {
        // Get recipient profile
        const profile = recipientProfiles.find(
          (p) => p.email === r.to_email || p.phone === r.to_phone
        );

        // Avatar URL
        const avatarUrl = profile?.profileImage || FALLBACK_AVATAR;

        // Tooltip ID
        const tooltipId = `tooltip-${idx}`;

        return (
          <div key={idx}>
            {/* Avatar */}
            <img
              src={avatarUrl}
              alt={r.to_name}
              className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm cursor-pointer"
              data-tooltip-id={tooltipId}
              data-tooltip-html={`
                <div style="min-width: 200px; text-align: left;">
                  <p style="font-weight: bold; margin: 0;">${r.to_name}</p>
                  <p style="margin: 0; font-size: 0.85rem; color: #eee;">
                    ${r.to_email || r.to_phone || ""}
                  </p>
                </div>
              `}
            />

            {/* Tooltip */}
            <ReactTooltip
              id={tooltipId}
              place="top"
              variant="dark"
              effect="solid"
              clickable
              appendTo="body"
            />
          </div>
        );
      })}
    </div>
  );
};

// PropTypes validation
MentorMessagesAvatar.propTypes = {
  selectedItem: PropTypes.shape({
    recipients: PropTypes.arrayOf(
      PropTypes.shape({
        to_id: PropTypes.string,
        to_name: PropTypes.string.isRequired,
        to_email: PropTypes.string,
        to_phone: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default MentorMessagesAvatar;
