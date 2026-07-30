const pageTitles = {
  dashboard: 'Dashboard',
  tracker: 'POA&M Tracker',
  reports: 'Reports & Export',
};

import { formatDateShort } from '../../utils/dateHelpers.js';

export const TopBar = ({ currentPage, toggleSidebar, itemCounts, lastUpdated }) => {
  const { open = 0, overdue = 0, critical = 0 } = itemCounts || {};

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left: mobile toggle + page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-surface-tint text-text-primary hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
          </svg>
        </button>

        <h1 className="text-xl font-semibold text-gray-800">
          {pageTitles[currentPage] || 'POA&M Tracker'}
        </h1>
      </div>

      {/* Right: stat pills & last updated (hidden on mobile) */}
      <div className="hidden items-center gap-4 md:flex">
        {lastUpdated && (
          <span className="text-xs font-medium text-gray-400">
            Last updated: {formatDateShort(lastUpdated)}
          </span>
        )}
        <div className="flex items-center gap-3">
          <StatPill count={open} label="Open" dotColor="bg-blue-600" />
          <StatPill count={overdue} label="Overdue" dotColor="bg-orange-500" />
          <StatPill count={critical} label="Critical" dotColor="bg-red-600" />
        </div>
      </div>
    </header>
  );
};

const StatPill = ({ count, label, dotColor }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-text-primary">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>
        {count} {label}
      </span>
    </div>
  );
};
