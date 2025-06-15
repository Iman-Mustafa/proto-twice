import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const handler = (e: Event) => {
        e.preventDefault();
        const promptEvent = e as BeforeInstallPromptEvent;
        setDeferredPrompt(promptEvent);
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User ${outcome} the install prompt`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-xl p-4 border border-blue-200 z-50 max-w-sm animate-fade-in-up">
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          <div className="bg-blue-100 p-2 rounded-full">
            <FiDownload className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">Install PROTO Twice</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add PROTO Twice to your home screen for faster access and offline capabilities.
          </p>
          <div className="mt-3 flex gap-2">
            <button 
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Install Now
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center"
            >
              <FiX className="mr-1" /> Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}