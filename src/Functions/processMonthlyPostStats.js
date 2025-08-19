// processMonthlyPostStats.js

/**
 * Processes an array of data items to calculate total count, monthly change, and growth trend.
 *
 * @param {Array} data - The dataset (e.g., events, applications, bids).
 * @param {Object} [options={}] - Options to customize processing.
 * @param {string} [options.dateKey="postedDate"] - The field name that contains the date string.
 * @param {string} [options.countKey="DocumentCount"] - The field name that contains the count value.
 * @returns {Object} Stats { totalPosts, monthlyChange, isIncrease, lastMonthCount, prevMonthCount }
 */
export function processMonthlyPostStats(
  data,
  { dateKey = "postedDate", countKey = "DocumentCount" } = {}
) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      totalPosts: 0,
      monthlyChange: 0,
      isIncrease: false,
      lastMonthCount: 0,
      prevMonthCount: 0,
    };
  }

  // Total count across all months
  const totalPosts = data.reduce(
    (total, item) => total + (item[countKey] || 0),
    0
  );

  // Group counts by month (YYYY-MM)
  const monthlyStats = {};
  data.forEach((item) => {
    const dateField = item[dateKey];
    if (!dateField) return; // skip if no date

    const monthKey = dateField.slice(0, 7); // Extract YYYY-MM
    const count = item[countKey] || 0;

    monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + count;
  });

  const sortedMonths = Object.keys(monthlyStats).sort();
  if (sortedMonths.length < 2) {
    return {
      totalPosts,
      monthlyChange: 0,
      isIncrease: false,
      lastMonthCount: monthlyStats[sortedMonths[0]] || 0,
      prevMonthCount: 0,
    };
  }

  const lastMonthKey = sortedMonths[sortedMonths.length - 1];
  const prevMonthKey = sortedMonths[sortedMonths.length - 2];

  const lastMonthCount = monthlyStats[lastMonthKey] || 0;
  const prevMonthCount = monthlyStats[prevMonthKey] || 0;

  const monthlyChange = lastMonthCount - prevMonthCount;
  const isIncrease = monthlyChange >= 0;

  return {
    totalPosts,
    monthlyChange,
    isIncrease,
    lastMonthCount,
    prevMonthCount,
  };
}
