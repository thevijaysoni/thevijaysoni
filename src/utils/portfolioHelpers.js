/**
 * Computes years of experience from a start date string (YYYY-MM-DD).
 * Returns a number rounded to one decimal place.
 */
export function calculateYearsOfExperience(startDateStr) {
  if (!startDateStr) return 0;
  const start = new Date(startDateStr);
  const now = new Date();
  const diffYears = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(diffYears * 10) / 10;
}

/**
 * Replaces the {yearsOfExperience} placeholder in the template summary string.
 */
export function getFormattedSummary(summaryTemplate, startDateStr) {
  if (!summaryTemplate) return '';
  const years = calculateYearsOfExperience(startDateStr);
  return summaryTemplate.replace('{yearsOfExperience}', `${years}`);
}
