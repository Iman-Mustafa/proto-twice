import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface PreviewSectionProps {
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  images: string[];
  labels: string[];
  downloadPrototype: () => void;
  loading: boolean;
  error: string | null;
  deviceStyles: {
    desktop: { width: string; margin: string };
    tablet: { width: string; margin: string };
    mobile: { width: string; margin: string };
  };
  progress?: number;
  progressState?: 'idle' | 'starting' | 'generating' | 'completing';
  eta?: number | null;
}

export default function PreviewSection({
  device,
  setDevice,
  images,
  labels,
  downloadPrototype,
  loading,
  error,
  deviceStyles,
  progress = 0,
  progressState = 'idle',
  eta = null,
}: PreviewSectionProps) {
  const CIRCUMFERENCE = 2 * Math.PI * 45;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
        <div className="flex gap-2">
          {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((type) => {
            const Icon = type === 'desktop' ? FiMonitor : type === 'tablet' ? FiTablet : FiSmartphone;
            return (
              <button
                key={type}
                onClick={() => setDevice(type)}
                disabled={loading}
                aria-label={`${type} view`}
                title={type}
                className={`p-2 rounded-md ${
                  device === type ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-grow relative border border-gray-300 rounded-lg overflow-hidden bg-white">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-red-50 text-red-700 text-center">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white text-indigo-600">
            <svg className="w-16 h-16 rotate-[-90deg]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="10"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-indigo-700">
              {progressState === 'starting'
                ? 'Warming up the model...'
                : progressState === 'generating'
                ? `Rendering (${Math.round(progress)}%)`
                : progressState === 'completing'
                ? 'Finalizing render...'
                : 'Generating...'}
            </p>
            {eta !== null && eta > 1 && (
              <p className="text-xs text-gray-500 mt-1">~{Math.ceil(eta)}s remaining</p>
            )}
          </div>
        )}

        {!images.length && !loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M9.663 17h4.673m-3.41-3.904a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p className="text-lg">Your UI screens will appear here</p>
            <p className="mt-1 text-sm">Describe your app and click Generate</p>
          </div>
        )}

        {images.length > 0 && !error && (
          <div className="flex flex-wrap justify-center items-start gap-6 p-4">
            {images.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center" style={deviceStyles[device]}>
                <p className="text-sm text-gray-600 mb-2">
                  {labels?.[idx] ? `Screen ${idx + 1}: ${labels[idx]}` : `Screen ${idx + 1}`}
                </p>
                <img
                  src={`data:image/png;base64,${img}`}
                  alt={`Screen ${idx + 1}`}
                  className="rounded shadow max-w-full max-h-[600px] object-contain"
                />
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && !loading && (
          <div className="mt-4 flex justify-center">
            <button
              className="px-6 py-3 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transition-all flex items-center"
              onClick={downloadPrototype}
              aria-label="Download all screens"
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
        )}
      </div>
    </div>
  );
}