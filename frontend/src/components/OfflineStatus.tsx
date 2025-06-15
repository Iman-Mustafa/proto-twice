import { useState, useEffect } from 'react';
import { FiWifiOff } from 'react-icons/fi';

export default function OfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      // Set initial state
      setIsOnline(navigator.onLine);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center animate-fade-in">
      <FiWifiOff className="h-5 w-5 mr-2" />
      <span>You are offline. Some features may be limited.</span>
    </div>
  );
}