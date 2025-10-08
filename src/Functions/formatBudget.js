// Utility: Format Budget Display
export const formatBudget = (
  amount,
  currency = "USD",
  isNegotiable = false
) => {
  // Handle missing or zero amount
  if (amount == null || amount === 0) return "Free";

  // Format amount with commas and no trailing decimals if unnecessary
  const formattedAmount = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Handle large numbers more cleanly (e.g. 1.2K, 3.5M)
  const formatShortNumber = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return formattedAmount;
  };

  const shortDisplay = formatShortNumber(amount);

  // Build final display string
  return `${currency} ${shortDisplay}${isNegotiable ? " (Negotiable)" : ""}`;
};
