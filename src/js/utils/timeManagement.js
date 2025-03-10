/**
 * Calculates the remaining time until an auction ends.
 * @param {string} endsAt - The end date of the auction in ISO format.
 * @returns {string} The remaining time in "Xh Ym" format, or "Expired" if the auction has ended.
 */

export function calculateTimeRemaining(endsAt) {
  const now = new Date();
  const endDate = new Date(endsAt);
  const diff = endDate - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}
