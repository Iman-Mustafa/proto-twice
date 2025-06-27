export default function ScreenFrame({
  image,
  screenLabel,
  onNext,
  onBack,
}: {
  image: string;
  screenLabel?: string;
  onNext?: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <img
        src={`data:image/png;base64,${image}`}
        alt={screenLabel || 'Screen preview'}
        className="w-full max-w-md mx-auto rounded shadow-lg"
      />
      {screenLabel && (
        <div className="absolute top-4 left-4 px-3 py-1 bg-white bg-opacity-80 text-gray-700 text-xs rounded shadow-md">
          {screenLabel}
        </div>
      )}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded shadow-md hover:bg-gray-300 transition"
          >
            Back
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow-md hover:bg-indigo-700 transition"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}