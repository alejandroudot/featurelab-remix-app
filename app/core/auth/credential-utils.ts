export function normalizeComparableEmail(value: string) {
  return value.trim().toLowerCase();
}

export function areEquivalentEmails(left: string, right: string) {
  return normalizeComparableEmail(left) === normalizeComparableEmail(right);
}

export function isValidEmailFormat(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
