// Utility to safely return an array
export const safeArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && Object.keys(data).length === 0) return [];
  return [data];
};
