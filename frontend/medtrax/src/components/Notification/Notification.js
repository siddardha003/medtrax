import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Notification = () => {
  const notification = useSelector(state => state.notification || {});
  const dispatch = useDispatch();

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification.message) {
    return null;
  }
  const getNotificationClasses = () => {
    const baseClasses = "fixed top-4 right-4 max-w-md w-full bg-white border-l-4 rounded-lg shadow-lg z-[99999] p-4";
    
    switch (notification.messageType) {
      case 'success':
        return `${baseClasses} border-green-500`;
      case 'error':
        return `${baseClasses} border-red-500`;
      case 'warning':
        return `${baseClasses} border-yellow-500`;
      default:
        return `${baseClasses} border-blue-500`;
    }
  };

  const getIconClasses = () => {
    switch (notification.messageType) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  const getIcon = () => {
    switch (notification.messageType || notification.messageType) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={getNotificationClasses()}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${getIconClasses()}`}>
          <span className="text-xl">{getIcon()}</span>
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">
            {notification.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}
          >
            <span className="sr-only">Close</span>
            <span className="text-xl">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
