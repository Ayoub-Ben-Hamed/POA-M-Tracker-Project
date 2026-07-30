import { exportToCSV } from '../../utils/exportCSV.js';

export const ExportButton = ({ enrichedItems, filteredCount }) => {
  const handleExport = () => {
    exportToCSV(enrichedItems, 'poam-export.csv');
  };

  return (
    <button
      onClick={handleExport}
      disabled={filteredCount === 0}
      className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-white px-4 py-2 text-sm font-medium text-text-primary shadow-sm hover:bg-bg-surface-tint focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Export to CSV"
    >
      <svg
        className="h-4 w-4 text-text-secondary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Export CSV ({filteredCount} items)
    </button>
  );
};
