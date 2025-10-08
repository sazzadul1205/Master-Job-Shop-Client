export const calculateDaysAgo = (isoString) => {
  if (!isoString) return "Unknown";

  const now = new Date();
  const target = new Date(isoString);
  const diffMs = now.getTime() - target.getTime();

  // Handle future dates
  if (diffMs < 0) {
    const daysAhead = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    return daysAhead === 0
      ? "Later today"
      : `In ${daysAhead} day${daysAhead > 1 ? "s" : ""}`;
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12)
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
};
