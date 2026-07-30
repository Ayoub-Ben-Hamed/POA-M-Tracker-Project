export const Toast = ({ message, type = 'success', onDismiss }) => {
  if (!message) return null;

  const typeConfig = {
    success: {
      border: 'border-l-green-500',
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      border: 'border-l-red-500',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    info: {
      border: 'border-l-blue-500',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-white p-4 shadow-lg border-l-4 ${config.border} animate-slide-up max-w-sm`}>
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      <p className="text-sm font-medium text-text-primary flex-1">
        {message}
      </p>
      <button
        onClick={onDismiss}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
