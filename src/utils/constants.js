import nistFamiliesData from '../assets/nist-families.json';

export const NIST_FAMILIES = nistFamiliesData;

export const SEVERITY_LEVELS = ["Critical", "High", "Moderate", "Low"];

export const SEVERITY_COLORS = {
  Critical: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-600" },
  High: { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-600" },
  Moderate: { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  Low: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-600" }
};

export const SLA_STATUS_COLORS = {
  "On Track": { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  "At Risk": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  "Overdue": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  "Severely Overdue": { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  "Completed": { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" }
};

export const STATUS_OPTIONS = ["Open", "In Progress", "Completed", "Risk Accepted", "Cancelled"];

export const STATUS_COLORS = {
  "Open": { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-600" },
  "In Progress": { bg: "bg-indigo-100", text: "text-indigo-800", dot: "bg-indigo-600" },
  "Completed": { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-500" },
  "Risk Accepted": { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-600" },
  "Cancelled": { bg: "bg-slate-100", text: "text-slate-800", dot: "bg-slate-600" }
};

export const DETECTION_SOURCES = [
  { value: "vulnerability_scan", label: "Vulnerability Scan" },
  { value: "penetration_test", label: "Penetration Test" },
  { value: "audit", label: "Audit" },
  { value: "self_assessment", label: "Self Assessment" },
  { value: "continuous_monitoring", label: "Continuous Monitoring" }
];

export const ASSET_CRITICALITY_LEVELS = ["Critical", "High", "Moderate", "Low"];

export const SLA_THRESHOLDS = { Critical: 15, High: 30, Moderate: 90, Low: 365 };

export const RISK_SCORE_BANDS = [
  { min: 0, max: 2.9, label: "Low Risk", color: "text-green-700", bg: "bg-green-50" },
  { min: 3, max: 5.9, label: "Moderate Risk", color: "text-amber-700", bg: "bg-amber-50" },
  { min: 6, max: 7.9, label: "High Risk", color: "text-orange-700", bg: "bg-orange-50" },
  { min: 8, max: 10, label: "Critical Risk", color: "text-red-700", bg: "bg-red-50" }
];

export const getRiskBand = (score) => {
  return RISK_SCORE_BANDS.find(band => score >= band.min && score <= band.max) || RISK_SCORE_BANDS[0];
};
