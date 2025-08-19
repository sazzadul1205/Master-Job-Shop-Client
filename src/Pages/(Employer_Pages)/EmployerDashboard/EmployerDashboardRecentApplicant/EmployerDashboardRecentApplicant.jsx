import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

// Components
import { Avatar } from "../../CompanyDashboard/CompanyDashboardRecentApplicant/CompanyDashboardRecentApplicant";
import ViewMemberProfileModal from "../../CompanyDashboard/CompanyDashboardRecentApplicant/ViewMemberProfileModal/ViewMemberProfileModal";

const EmployerDashboardRecentApplicant = ({
  LatestGigBids,
  LatestEventApplications,
}) => {
  const axiosPublic = useAxiosPublic();

  // User Email State
  const [userEmail, setUserEmail] = useState("");

  // Helper function to get "time ago" or "in X time"
  function recentApplicantTimeAgo(dateString, locale = "en") {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const date = new Date(dateString);

    if (isNaN(date)) return "Invalid date";

    const now = new Date();
    const diffInSeconds = Math.floor((date - now) / 1000); // can be negative or positive

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const { label, seconds } of intervals) {
      const count = Math.floor(Math.abs(diffInSeconds) / seconds);
      if (count >= 1) {
        return rtf.format(diffInSeconds < 0 ? -count : count, label);
      }
    }

    return "just now";
  }

  // Combine, format, include photo, keep actual date, and add respective IDs
  const formattedApplications = [
    ...LatestGigBids.map((item) => ({
      name: item.name,
      email: item.email,
      type: "Gig",
      photo: item.profileImage || item.name.charAt(0).toUpperCase(),
      date: item.submittedAt,
      timeAgo: recentApplicantTimeAgo(item.submittedAt),
      gigId: item.gigId, // Add gigId
    })),

    ...LatestEventApplications.map((item) => ({
      name: item.name,
      email: item.email,
      type: "Event",
      photo: item.profileImage || item.name.charAt(0).toUpperCase(),
      date: item.appliedAt,
      timeAgo: recentApplicantTimeAgo(item.appliedAt),
      eventId: item.eventId, // Add eventId
    })),
  ];

  // Sort by actual date descending (latest first)
  formattedApplications.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Keep only the latest 5
  const latestFiveApplications = formattedApplications.slice(0, 5);

  // Initialize arrays to hold IDs
  const gigIds = [];
  const eventIds = [];

  // Loop through latestFiveApplications and push IDs into their respective arrays
  latestFiveApplications.forEach((app) => {
    switch (app.type) {
      case "Gig":
        if (app.gigId) gigIds.push(app.gigId);
        break;
      case "Event":
        if (app.eventId) eventIds.push(app.eventId);
        break;
      default:
        break;
    }
  });

  // Fetch Latest Gig Summaries
  const {
    data: GigSummary,
    isLoading: GigSummaryLoading,
    error: GigSummaryError,
  } = useQuery({
    queryKey: ["GigSummary", gigIds],
    queryFn: () => {
      if (!gigIds?.length) return Promise.resolve([]);

      // Clean and join IDs as a comma-separated string
      const cleanIds = gigIds
        .map((id) => id.trim())
        .filter(Boolean)
        .join(",");

      return axiosPublic
        .get(`/Gigs/Summary`, {
          params: { gigIds: cleanIds },
        })
        .then((res) => res.data)
        .then((gigs) => {
          return Array.isArray(gigs) ? gigs.slice(0, 5) : [gigs];
        });
    },
    enabled: !!gigIds?.length,
  });

  // Fetch Latest Event Summaries
  const {
    data: EventSummary,
    isLoading: EventSummaryLoading,
    error: EventSummaryError,
  } = useQuery({
    queryKey: ["EventSummary", eventIds],
    queryFn: () => {
      if (!eventIds?.length) return Promise.resolve([]);

      // Clean and join IDs as a comma-separated string
      const cleanIds = eventIds
        .map((id) => id.trim())
        .filter(Boolean)
        .join(",");

      return axiosPublic
        .get(`/Events/Summary`, {
          params: { eventIds: cleanIds },
        })
        .then((res) => res.data)
        .then((events) => {
          return Array.isArray(events) ? events.slice(0, 5) : [events];
        });
    },
    enabled: !!eventIds?.length,
  });

  // Lookup map for GigSummary
  const gigTitleMap = {};
  if (Array.isArray(GigSummary)) {
    GigSummary.forEach((gig) => {
      gigTitleMap[gig._id] = gig.title;
    });
  } else if (GigSummary?._id) {
    gigTitleMap[GigSummary._id] = GigSummary.title;
  }

  // Lookup map for EventSummary
  const eventTitleMap = {};
  if (Array.isArray(EventSummary)) {
    EventSummary.forEach((event) => {
      eventTitleMap[event._id] = event.title;
    });
  } else if (EventSummary?._id) {
    eventTitleMap[EventSummary._id] = EventSummary.title;
  }


  // Enrich latestFiveApplications with titles
  const enrichedApplications = latestFiveApplications.map((app) => {
    if (app.type === "Gig" && app.gigId && gigTitleMap[app.gigId]) {
      return { ...app, title: gigTitleMap[app.gigId] };
    }
    if (app.type === "Event" && app.eventId && eventTitleMap[app.eventId]) {
      return { ...app, title: eventTitleMap[app.eventId] };
    }

    return app;
  });


  // If Loading Show UI
  if (
    GigSummaryLoading ||
    EventSummaryLoading
  )
    return <Loading />;

  // If Error Show UI
  if (
    GigSummaryError ||
    EventSummaryError
  )
    return <Error />;

  return (
    <>
      {/* Title */}
      <h3 className="text-base text-black font-bold">
        Recent Applicant Actions
      </h3>

      {/* Map over the latest 5 or show fallback */}
      <div className="flex flex-col gap-8 pt-6">
        {enrichedApplications && enrichedApplications.length > 0 ? (
          enrichedApplications.map((app, index) => (
            <div key={index} className="flex gap-2 items-center">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                <Avatar photo={app.photo} name={app.name} />
              </div>

              {/* Text */}
              <div className="text-gray-600">
                <h3>
                  <span
                    onClick={() => {
                      document.getElementById("View_Profile_Modal").showModal();
                      setUserEmail(app.email);
                    }}
                    className="font-semibold text-black hover:underline cursor-pointer"
                  >
                    {app.name}
                  </span>{" "}
                  applied for{" "}
                  <span className="text-black font-semibold hover:underline cursor-pointer">
                    {app.title}
                  </span>{" "}
                  {app.type}
                </h3>
                {/* Times Ago Part */}
                <p className="text-sm text-gray-500">{app.timeAgo}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 border border-gray-200 rounded-lg bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-6h6v6m2 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2M7 17H5a2 2 0 01-2-2V7a2 2 0 012-2h2"
              />
            </svg>
            <p className="text-gray-500 text-sm">No applications or bids have been submitted yet.</p>
            <p className="text-gray-400 text-xs mt-1">Once users apply, they will appear here.</p>
          </div>
        )}
      </div>

      {/* View User Profile Modal */}
      <dialog id="View_Profile_Modal" className="modal">
        <ViewMemberProfileModal userEmail={userEmail} setUserEmail={setUserEmail} />
      </dialog>
    </>
  );
};

// Prop Validation
EmployerDashboardRecentApplicant.propTypes = {
  LatestGigBids: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      profileImage: PropTypes.string,
      submittedAt: PropTypes.string.isRequired,
      gigId: PropTypes.string.isRequired,
    })
  ).isRequired,
  LatestEventApplications: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      profileImage: PropTypes.string,
      appliedAt: PropTypes.string.isRequired,
      eventId: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EmployerDashboardRecentApplicant;