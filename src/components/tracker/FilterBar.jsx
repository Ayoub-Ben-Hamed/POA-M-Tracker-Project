import { useState, useEffect } from 'react';
import { NIST_FAMILIES, SEVERITY_LEVELS, STATUS_OPTIONS } from '../../utils/constants.js';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  filterSeverity,
  filterStatus,
  filterFamily,
  filterSLAStatus,
  setFilter,
  clearAllFilters,
  activeFilterCount,
  items // Need all enrichedItems to determine which families are present
}) => {
  // Local state for debounced search
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync prop to local state (e.g. when cleared externally)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== localSearch) {
        setSearchQuery(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, setSearchQuery]);

  // Determine active control families from items
  const activeFamilies = new Set();
  if (items) {
    items.forEach(item => {
      if (item.controlFamily) {
        activeFamilies.add(item.controlFamily);
      }
    });
  }

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  const slaOptions = ['On Track', 'At Risk', 'Overdue', 'Severely Overdue', 'Completed'];

  return (
    <div className="card-float rounded-t-3xl border-b border-border-soft p-4 flex flex-wrap items-center gap-4 bg-white z-20 relative">
      
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-[320px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2 border border-border-soft rounded-xl text-sm text-text-primary focus:ring-accent-primary focus:border-accent-primary placeholder-text-muted"
          placeholder="Search by title, control, asset, POC..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        {localSearch && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary focus:outline-none"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Severity Dropdown */}
      <select
        value={filterSeverity}
        onChange={(e) => setFilter('filterSeverity', e.target.value)}
        className="py-2 pl-3 pr-8 border border-border-soft rounded-xl text-sm text-text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary bg-white appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
      >
        <option value="All">All Severities</option>
        {SEVERITY_LEVELS.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Status Dropdown */}
      <select
        value={filterStatus}
        onChange={(e) => setFilter('filterStatus', e.target.value)}
        className="py-2 pl-3 pr-8 border border-border-soft rounded-xl text-sm text-text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary bg-white appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
      >
        <option value="All">All Statuses</option>
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Control Family Dropdown */}
      <select
        value={filterFamily}
        onChange={(e) => setFilter('filterFamily', e.target.value)}
        className="py-2 pl-3 pr-8 border border-border-soft rounded-xl text-sm text-text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary bg-white appearance-none max-w-[200px] truncate"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
      >
        <option value="All">All Families</option>
        {Object.entries(NIST_FAMILIES).map(([code, name]) => {
          const isEnabled = activeFamilies.has(code);
          return (
            <option key={code} value={code} disabled={!isEnabled}>
              {code} - {name}
            </option>
          );
        })}
      </select>

      {/* SLA Status Dropdown */}
      <select
        value={filterSLAStatus}
        onChange={(e) => setFilter('filterSLAStatus', e.target.value)}
        className="py-2 pl-3 pr-8 border border-border-soft rounded-xl text-sm text-text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary bg-white appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
      >
        <option value="All">All SLA Statuses</option>
        {slaOptions.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Clear ({activeFilterCount})
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

    </div>
  );
};
