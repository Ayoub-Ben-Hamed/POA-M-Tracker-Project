export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-xl shadow-xl flex flex-col overflow-hidden`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <h3 className="text-lg font-bold text-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[80vh] p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
