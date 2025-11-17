import { useState, useEffect } from 'react';

const SimpleDialog = ({ isOpen, onClose, title, message, onConfirm, confirmText = "OK", cancelText = "Cancel", showCancel = true, isNotification = false, autoCloseDelay = 3000 }) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (isNotification && isOpen) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isNotification, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Notification style
  if (isNotification) {
    return (
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        showNotification ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}>
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-sm mt-1">{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular modal dialog
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg border border-gray-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          {showCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleDialog;