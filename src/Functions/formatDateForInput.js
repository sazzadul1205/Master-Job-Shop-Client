export const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  // Convert to YYYY-MM-DD format
  return date.toISOString().split("T")[0];
};
