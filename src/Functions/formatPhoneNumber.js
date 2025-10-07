import { parsePhoneNumberFromString } from "libphonenumber-js";

// Format Bangladeshi phone numbers
export function formatBDPhoneNumber(phone) {
  if (!phone) return "";

  const phoneNumber = parsePhoneNumberFromString(phone, "BD");
  if (!phoneNumber) return phone;

  return phoneNumber.formatInternational(); // +880 17 1234 5678
}
