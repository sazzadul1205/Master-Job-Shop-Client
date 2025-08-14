import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

const CompanyDashboardRecentApplicant = ({
  LatestGigBids,
  LatestJobApplications,
  LatestEventApplications,
  LatestInternshipApplications,
}) => {
  const axiosPublic = useAxiosPublic();

  // Helper function to get time ago
  function timeAgo(dateString) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return rtf.format(-count, interval.label);
      }
    }
    return "just now";
  }

  // Combine, format, include photo, keep actual date, and add respective IDs
  const formattedApplications = [
    ...LatestGigBids.map((item) => ({
      name: item.name,
      type: "Gig",
      photo: item.profileImage || item.name.charAt(0).toUpperCase(),
      date: item.submittedAt,
      timeAgo: timeAgo(item.submittedAt),
      gigId: item.gigId, // Add gigId
    })),
    // ...LatestJobApplications.map((item) => ({
    //   name: item.name,
    //   type: "Job",
    //   photo: item.profileImage || item.name.charAt(0).toUpperCase(),
    //   date: item.appliedAt,
    //   timeAgo: timeAgo(item.appliedAt),
    //   jobId: item.jobId, // Add jobId
    // })),
    // ...LatestEventApplications.map((item) => ({
    //   name: item.name,
    //   type: "Event",
    //   photo: item.profileImage || item.name.charAt(0).toUpperCase(),
    //   date: item.appliedAt,
    //   timeAgo: timeAgo(item.appliedAt),
    //   eventId: item.eventId, // Add eventId
    // })),
    // ...LatestInternshipApplications.map((item) => ({
    //   name: item.name,
    //   type: "Internship",
    //   photo: item.profileImage || item.name.charAt(0).toUpperCase(),
    //   date: item.appliedAt,
    //   timeAgo: timeAgo(item.appliedAt),
    //   internshipId: item.internshipId, // Add internshipId
    // })),
  ];

  // Sort by actual date descending (latest first)
  formattedApplications.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Keep only the latest 5
  const latestFiveApplications = formattedApplications.slice(0, 5);

  // Initialize arrays to hold IDs
  const gigIds = [];
  const jobIds = [];
  const eventIds = [];
  const internshipIds = [];

  // Loop through latestFiveApplications and push IDs into their respective arrays
  latestFiveApplications.forEach((app) => {
    switch (app.type) {
      case "Gig":
        if (app.gigId) gigIds.push(app.gigId);
        break;
      case "Job":
        if (app.jobId) jobIds.push(app.jobId);
        break;
      case "Event":
        if (app.eventId) eventIds.push(app.eventId);
        break;
      case "Internship":
        if (app.internshipId) internshipIds.push(app.internshipId);
        break;
      default:
        break;
    }
  });

  // Fetch Latest Job Summaries
  const {
    data: JobSummary,
    isLoading: JobSummaryLoading,
    error: JobSummaryError,
  } = useQuery({
    queryKey: ["JobSummary", jobIds],
    queryFn: () => {
      if (!jobIds?.length) return Promise.resolve([]);

      // Clean and join IDs as a comma-separated string
      const cleanIds = jobIds
        .map((id) => id.trim())
        .filter(Boolean)
        .join(",");

      return axiosPublic
        .get(`/Jobs/Summary`, {
          params: { jobIds: cleanIds }, // Send jobIds to server
        })
        .then((res) => res.data)
        .then((jobs) => {
          // Ensure only the latest 5 are returned
          return Array.isArray(jobs) ? jobs.slice(0, 5) : [jobs];
        });
    },
    enabled: !!jobIds?.length, // Only run if jobIds exist
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

  // Lookup map for JobSummary
  const jobTitleMap = {};
  if (Array.isArray(JobSummary)) {
    JobSummary.forEach((job) => {
      jobTitleMap[job._id] = job.title;
    });
  } else if (JobSummary?._id) {
    jobTitleMap[JobSummary._id] = JobSummary.title;
  }

  // Lookup map for GigSummary
  const gigTitleMap = {};
  if (Array.isArray(GigSummary)) {
    GigSummary.forEach((gig) => {
      gigTitleMap[gig._id] = gig.title;
    });
  } else if (GigSummary?._id) {
    gigTitleMap[GigSummary._id] = GigSummary.title;
  }

  // Enrich latestFiveApplications with titles
  const enrichedApplications = latestFiveApplications.map((app) => {
    if (app.type === "Job" && app.jobId && jobTitleMap[app.jobId]) {
      return { ...app, title: jobTitleMap[app.jobId] };
    }
    if (app.type === "Gig" && app.gigId && gigTitleMap[app.gigId]) {
      return { ...app, title: gigTitleMap[app.gigId] };
    }
    return app;
  });

  console.log("Enriched Applications:", enrichedApplications);

  // If Loading Show UI
  if (JobSummaryLoading || GigSummaryLoading) return <Loading />;

  // If Error Show UI
  if (JobSummaryError || GigSummaryError) return <Error />;

  console.log(JobSummary);

  return (
    <>
      {/* Title */}
      <h3 className="text-base text-black font-bold">
        Recent Applicant Actions
      </h3>

      {/* Map over the latest 5 */}
      <div className="flex flex-col gap-8 pt-6">
        {enrichedApplications.map((app, index) => (
          <div key={index} className="flex gap-2 items-center">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
              {app.photo && app.photo.startsWith("http") ? (
                <img
                  src={app.photo}
                  alt={app.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.style.display = "none"; // hide broken image
                  }}
                />
              ) : (
                // Show first 2 letters if no image
                app.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              )}
            </div>

            {/* Text */}
            <div className="text-gray-600">
              <h3>
                <span className="font-semibold text-black">{app.name}</span>{" "}
                applied for{" "}
                <span className="text-black font-semibold">{app.title}</span>{" "}
                {app.type}
              </h3>
              <p className="text-sm text-gray-500">{app.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CompanyDashboardRecentApplicant;
