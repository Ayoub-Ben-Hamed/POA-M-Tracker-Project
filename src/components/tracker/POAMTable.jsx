import { RiskScoreBadge } from './RiskScoreBadge.jsx';
import { StatusBadge } from './StatusBadge.jsx';
import { formatDateShort } from '../../utils/dateHelpers.js';
import { isDatePast } from '../../utils/dateHelpers.js';

export const POAMTable = ({
  filteredItems,
  onEdit,
  onDelete,
  onRowClick,
  sortField,
  sortDirection,
  setSort
}) => {
  const handleSortClick = (field) => {
    if (sortField === field) {
      setSort(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return sortDirection === 'asc' 
      ? <span className="text-accent-primary ml-1 font-bold">↑</span> 
      : <span className="text-accent-primary ml-1 font-bold">↓</span>;
  };

  const truncate = (str, maxLen = 50) => {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
  };

  if (!filteredItems || filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-b-3xl border-t border-border-soft">
        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-text-secondary font-medium text-sm">No POA&M items match your current filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-b-3xl">
      <table className="w-full text-left text-sm whitespace-nowrap min-w-[1100px]">
        <thead className="sticky top-0 z-10 bg-bg-surface-tint border-y border-border-soft">
          <tr>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs w-[90px]"
              onClick={() => handleSortClick('riskScore')}
            >
              Risk Score {getSortIcon('riskScore')}
            </th>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs w-[120px]"
              onClick={() => handleSortClick('id')}
            >
              POA&M ID {getSortIcon('id')}
            </th>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs flex-1 min-w-[200px]"
              onClick={() => handleSortClick('title')}
            >
              Title {getSortIcon('title')}
            </th>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs w-[100px]"
              onClick={() => handleSortClick('severity')}
            >
              Severity {getSortIcon('severity')}
            </th>
            <th className="px-4 py-3 font-semibold text-text-secondary uppercase tracking-wider text-xs w-[80px]">
              Control
            </th>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs w-[120px]"
              onClick={() => handleSortClick('status')}
            >
              Status {getSortIcon('status')}
            </th>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs w-[130px]"
              onClick={() => handleSortClick('slaStatus')}
            >
              SLA Status {getSortIcon('slaStatus')}
            </th>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs w-[100px] text-right"
              onClick={() => handleSortClick('daysOverdue')}
            >
              Days Overdue {getSortIcon('daysOverdue')}
            </th>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs w-[120px]"
              onClick={() => handleSortClick('scheduledCompletionDate')}
            >
              Milestone {getSortIcon('scheduledCompletionDate')}
            </th>
            <th 
              className="px-4 py-3 font-semibold text-text-secondary cursor-pointer hover:bg-gray-100 uppercase tracking-wider text-xs w-[120px]"
              onClick={() => handleSortClick('dateOfClosure')}
            >
              Date of Closure {getSortIcon('dateOfClosure')}
            </th>
            <th className="px-4 py-3 font-semibold text-text-secondary uppercase tracking-wider text-xs w-[130px]">
              POC
            </th>
            <th className="px-4 py-3 font-semibold text-text-secondary uppercase tracking-wider text-xs w-[80px] text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => {
            const isSeverelyOverdue = item.slaStatus === 'Severely Overdue';
            const isOverdue = item.slaStatus === 'Overdue';
            const borderLeftClass = isSeverelyOverdue 
              ? 'border-l-4 border-l-red-600' 
              : isOverdue 
                ? 'border-l-4 border-l-orange-500' 
                : 'border-l-4 border-l-transparent'; // Keep padding consistent
            const rowBgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

            const milestonePastAndOpen = (item.status === 'Open' || item.status === 'In Progress') && isDatePast(item.scheduledCompletionDate);
            
            let daysOverdueColor = 'text-text-muted font-medium';
            if (item.dateOfClosure && item.daysOverdue > 0) {
              daysOverdueColor = 'text-purple-600 font-bold';
            } else if (!item.dateOfClosure && item.daysOverdue > 0) {
              daysOverdueColor = 'text-red-600 font-bold';
            }

            return (
              <tr 
                key={item.id} 
                onClick={() => onRowClick && onRowClick(item)}
                className={`${rowBgClass} ${borderLeftClass} hover:bg-blue-50/50 transition-colors border-b border-border-soft last:border-b-0 cursor-pointer`}
              >
                <td className="px-4 py-2 align-middle">
                  <RiskScoreBadge score={item.riskScore} />
                </td>
                <td className="px-4 py-2 font-mono text-xs text-text-secondary align-middle">
                  {item.id}
                </td>
                <td className="px-4 py-2 text-text-primary align-middle max-w-[200px] truncate" title={item.title}>
                  {truncate(item.title, 40)}
                </td>
                <td className="px-4 py-2 align-middle">
                  <StatusBadge type="severity" value={item.severity} />
                </td>
                <td className="px-4 py-2 text-text-secondary text-xs align-middle">
                  {item.controlId}
                </td>
                <td className="px-4 py-2 align-middle">
                  <StatusBadge type="status" value={item.status} />
                </td>
                <td className="px-4 py-2 align-middle">
                  <StatusBadge type="sla" value={item.slaStatus} />
                </td>
                <td className={`px-4 py-2 text-right align-middle ${daysOverdueColor}`}>
                  {item.daysOverdue > 0 ? item.daysOverdue : '—'}
                </td>
                <td className={`px-4 py-2 text-xs align-middle ${milestonePastAndOpen ? 'text-red-600 font-semibold' : 'text-text-secondary'}`}>
                  {formatDateShort(item.scheduledCompletionDate)}
                </td>
                <td className="px-4 py-2 text-xs align-middle text-text-secondary">
                  {item.dateOfClosure ? formatDateShort(item.dateOfClosure) : '—'}
                </td>
                <td className="px-4 py-2 text-xs text-text-secondary align-middle">
                  {item.responsiblePOC}
                </td>
                <td className="px-4 py-2 align-middle text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                      className="p-1.5 text-text-muted hover:text-accent-primary hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      aria-label={`Edit ${item.id}`}
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                      className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${item.id}`}
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
