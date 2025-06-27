import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ScreenFrame from '@/components/ScreenFrame';

export default function FlowPreview() {
  const [screens, setScreens] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('protoScreens');
    const meta = sessionStorage.getItem('protoLabels');
    if (stored) setScreens(JSON.parse(stored));
    if (meta) setLabels(JSON.parse(meta));
  }, []);

  const handleNext = () => {
    if (current < screens.length - 1) {
      setCurrent((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-12">
      {screens.length ? (
        <>
          <ScreenFrame
            image={screens[current]}
            screenLabel={labels?.[current]}
            onNext={current < screens.length - 1 ? handleNext : undefined}
            onBack={current > 0 ? handleBack : undefined}
          />

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleExit}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Exit Flow
            </button>
            {current > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Back
              </button>
            )}
            {current < screens.length - 1 && (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center">No flow found. Please generate a prototype first.</p>
      )}
    </main>
  );
}