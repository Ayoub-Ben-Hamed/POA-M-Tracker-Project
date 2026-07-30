import { useState, useMemo, useEffect } from 'react';
import { FilterBar } from '../components/tracker/FilterBar.jsx';
import { POAMTable } from '../components/tracker/POAMTable.jsx';
import { AddPOAMModal } from '../components/forms/AddPOAMModal.jsx';
import { EditPOAMModal } from '../components/forms/EditPOAMModal.jsx';
import { POAMDetailModal } from '../components/tracker/POAMDetailModal.jsx';
import { ConfirmDialog } from '../components/shared/ConfirmDialog.jsx';
import { ExportButton } from '../components/shared/ExportButton.jsx';

export const Tracker = ({
  enrichedItems,
  addPOAM,
  updatePOAM,
  deletePOAM,
  resetToSeedData,
  // Filter state spread from useFilters
  searchQuery,
  setSearchQuery,
  filterSeverity,
  filterStatus,
  filterFamily,
  filterSLAStatus,
  sortField,
  sortDirection,
  setFilter,
  setSort,
  clearAllFilters,
  applyFilters,
  activeFilterCount,
  showToast
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Apply filters to get the data to display
  const filteredItems = useMemo(() => {
    return applyFilters(enrichedItems);
  }, [enrichedItems, applyFilters]);

  const handleAdd = (data) => {
    const res = addPOAM(data);
    if (res.success) {
      showToast(`Added POA&M: ${res.id}`, 'success');
    }
    return res;
  };

  const handleUpdate = (id, data) => {
    const res = updatePOAM(id, data);
    if (res.success) {
      showToast(`Updated POA&M: ${id}`, 'success');
    }
    return res;
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      const res = deletePOAM(deletingId);
      if (res.success) {
        showToast(`Deleted POA&M: ${deletingId}`, 'success');
      } else {
        showToast(`Failed to delete: ${res.error}`, 'error');
      }
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    return updatePOAM(id, { status: newStatus });
  };

  // Keyboard shortcut for adding POAM
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input/textarea/select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      // Ignore if any modal is open
      if (showAddModal || editingItem || deletingId) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowAddModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal, editingItem, deletingId]);

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">POA&M Tracker</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage and track vulnerability remediation milestones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-primary-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add POA&M
          </button>
        </div>
      </div>

      {/* Main Tracker Container */}
      <div className="card-float rounded-3xl flex flex-col shadow-sm border border-border-soft">
        
        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterSeverity={filterSeverity}
          filterStatus={filterStatus}
          filterFamily={filterFamily}
          filterSLAStatus={filterSLAStatus}
          setFilter={setFilter}
          clearAllFilters={clearAllFilters}
          activeFilterCount={activeFilterCount}
          items={enrichedItems}
        />

        {/* Results Summary Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-white border-b border-border-soft">
          <p className="text-sm font-medium text-text-secondary">
            Showing <span className="font-bold text-text-primary">{filteredItems.length}</span> of <span className="font-bold text-text-primary">{enrichedItems?.length || 0}</span> items
          </p>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <button
              onClick={resetToSeedData}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-white px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-tint focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors"
              title="Reset data to initial state"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Data
            </button>
            <ExportButton enrichedItems={filteredItems} filteredCount={filteredItems.length} />
          </div>
        </div>

        {/* Data Table */}
        <POAMTable
          filteredItems={filteredItems}
          onRowClick={(item) => setSelectedItem(item)}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(id) => setDeletingId(id)}
          sortField={sortField}
          sortDirection={sortDirection}
          setSort={setSort}
        />
      </div>

      {/* Modals */}
      <AddPOAMModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
      
      <EditPOAMModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onUpdate={handleUpdate}
      />

      <POAMDetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onEdit={(item) => setEditingItem(item)}
        onUpdateStatus={handleUpdateStatus}
        showToast={showToast}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete POA&M"
        message={`Are you sure you want to delete ${deletingId}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};
