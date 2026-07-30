import { useState } from 'react';
import { Modal } from '../shared/Modal.jsx';
import { formatDate } from '../../utils/dateHelpers.js';
import { StatusBadge } from './StatusBadge.jsx';
import { RiskScoreBadge } from './RiskScoreBadge.jsx';

export const POAMDetailModal = ({ isOpen, onClose, item, onEdit, onUpdateStatus, showToast }) => {
  const [confirmingStatus, setConfirmingStatus] = useState(null);

  if (!item) return null;

  const handleStatusConfirm = () => {
    if (confirmingStatus) {
      const res = onUpdateStatus(item.id, confirmingStatus);
      if (res && res.success) {
        showToast(`Marked ${item.id} as ${confirmingStatus}`, 'success');
        setConfirmingStatus(null);
        onClose();
      } else {
        showToast(`Failed to update status: ${res?.error || 'Unknown error'}`, 'error');
        setConfirmingStatus(null);
      }
    }
  };

  const handleStatusCancel = () => {
    setConfirmingStatus(null);
  };

  const isClosed = item.status === 'Completed' || item.status === 'Risk Accepted' || item.status === 'Cancelled';

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col py-2 border-b border-border-soft last:border-b-0">
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</span>
      <span className="text-sm text-text-primary mt-1 font-medium">{value || '—'}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`POA&M Details: ${item.id}`} size="lg">
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="bg-bg-surface-tint p-4 rounded-xl border border-border-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-text-primary mb-2">{item.title}</h2>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge type="status" value={item.status} />
              <StatusBadge type="severity" value={item.severity} />
              <StatusBadge type="sla" value={item.slaStatus} />
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                Risk Score: <RiskScoreBadge score={item.riskScore} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Section for Open Items */}
        {!isClosed && (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-text-primary mb-3">Resolve this item</h3>
            
            {confirmingStatus ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-blue-200">
                <span className="text-sm font-semibold text-text-primary">
                  Confirm marking {item.id} as {confirmingStatus}?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStatusCancel}
                    className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border-soft rounded-full hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusConfirm}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-accent-primary rounded-full hover:bg-accent-primary-hover focus:outline-none"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setConfirmingStatus('Completed')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Mark Complete
                </button>
                <button
                  onClick={() => setConfirmingStatus('Risk Accepted')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 focus:outline-none transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Accept Risk
                </button>
                <button
                  onClick={() => setConfirmingStatus('Cancelled')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {isClosed && (
          <div className="bg-gray-50 p-3 rounded-lg border border-border-soft flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-text-secondary">
              Closed on {formatDate(item.dateOfClosure)} — no further action available
            </p>
          </div>
        )}

        {/* Description Section */}
        <div>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm text-text-primary bg-white p-3 rounded-lg border border-border-soft">
            {item.description}
          </p>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
          <div>
            <InfoRow label="Control ID & Family" value={`${item.controlId} (${item.controlFamilyName || item.controlFamily})`} />
            <InfoRow label="Asset Affected" value={item.assetAffected} />
            <InfoRow label="Asset Criticality" value={item.assetCriticality} />
            <InfoRow label="Detection Source" value={item.detectionSource} />
            <InfoRow label="Vendor Dependency" value={item.vendorDependency ? 'Yes' : 'No'} />
          </div>
          <div>
            <InfoRow label="Responsible POC" value={item.responsiblePOC} />
            <InfoRow label="Date Identified" value={formatDate(item.dateIdentified)} />
            <InfoRow label="Milestone Date" value={formatDate(item.scheduledCompletionDate)} />
            <InfoRow label="Date of Closure" value={item.dateOfClosure ? formatDate(item.dateOfClosure) : '—'} />
            <InfoRow 
              label="Days Overdue" 
              value={
                <span className={item.dateOfClosure && item.daysOverdue > 0 ? 'text-purple-600 font-bold' : item.daysOverdue > 0 ? 'text-red-600 font-bold' : ''}>
                  {item.daysOverdue} {item.dateOfClosure && item.daysOverdue > 0 ? '(Frozen)' : ''}
                </span>
              } 
            />
          </div>
        </div>

        {/* Optional Notes & Estimates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item.milestoneNotes && (
            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Milestone Notes</h3>
              <p className="text-sm text-text-primary bg-gray-50 p-3 rounded-lg border border-border-soft">
                {item.milestoneNotes}
              </p>
            </div>
          )}
          {item.resourceEstimate && (
            <div>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Resource Estimate</h3>
              <p className="text-sm text-text-primary font-medium">{item.resourceEstimate}</p>
            </div>
          )}
        </div>

        <div className="text-right border-t border-border-soft pt-4">
          <p className="text-xs text-text-muted mb-4">Last Updated: {formatDate(item.lastUpdated)}</p>
          <button
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-text-primary border border-border-soft rounded-full hover:bg-bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Item
          </button>
        </div>

      </div>
    </Modal>
  );
};
