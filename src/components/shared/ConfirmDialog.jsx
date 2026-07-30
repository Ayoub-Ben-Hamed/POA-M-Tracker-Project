import { Modal } from './Modal.jsx';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmColor = 'bg-red-600 hover:bg-red-700'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="mb-6">
        <p className="text-sm text-text-secondary">
          {message}
        </p>
      </div>
      
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-text-primary border border-border-soft rounded-full hover:bg-bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-medium text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-colors ${confirmColor}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
