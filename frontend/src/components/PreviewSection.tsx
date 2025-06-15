import { RefObject } from 'react';
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface PreviewSectionProps {
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  previewFrameRef: RefObject<HTMLIFrameElement | null>;
  generatedHTML: string;
  downloadPrototype: () => void;
  loading: boolean;
  error: string | null;
  deviceStyles: {
    desktop: { width: string; margin: string };
    tablet: { width: string; margin: string };
    mobile: { width: string; margin: string };
  };
}

export default function PreviewSection({
  device,
  setDevice,
  previewFrameRef,
  generatedHTML,
  downloadPrototype,
  loading,
  error,
  deviceStyles
}: PreviewSectionProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-md ${
              device === 'desktop'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setDevice('desktop')}
            disabled={loading}
            title="Desktop"
            aria-label="Desktop view"
          >
            <FiMonitor className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-md ${
              device === 'tablet'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setDevice('tablet')}
            disabled={loading}
            title="Tablet"
            aria-label="Tablet view"
          >
            <FiTablet className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-md ${
              device === 'mobile'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setDevice('mobile')}
            disabled={loading}
            title="Mobile"
            aria-label="Mobile view"
          >
            <FiSmartphone className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-grow relative border border-gray-300 rounded-lg overflow-hidden bg-white">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-red-50 text-red-700">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-center font-medium">{error}</p>
            </div>
          </div>
        )}

        {!generatedHTML && !error && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <p className="text-lg">Your AI-generated prototype will appear here</p>
              <p className="mt-2">Describe your application to get started</p>
            </div>
          </div>
        )}

        <iframe
          ref={previewFrameRef}
          className="w-full h-full"
          style={deviceStyles[device]}
          title="Prototype Preview"
          sandbox="allow-same-origin allow-scripts"
          aria-label="Prototype preview"
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center ${
            generatedHTML && !loading
              ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={downloadPrototype}
          disabled={!generatedHTML || loading}
          aria-label="Download prototype"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download Prototype
        </button>
      </div>
    </div>
  );
}