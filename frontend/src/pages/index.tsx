import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import AIGenerator from '@/components/AIGenerator';
import PreviewSection from '@/components/PreviewSection';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const OfflineStatus = dynamic(() => import('@/components/OfflineStatus'), {
  ssr: false,
  loading: () => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2">
      Loading status...
    </div>
  ),
});

const InstallPrompt = dynamic(() => import('@/components/InstallPrompt'), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-4 right-4">Loading install prompt...</div>
  ),
});

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type FidelityLevel = 'high' | 'medium' | 'low';

export default function Home() {
  const [image, setImage] = useState<string>('');
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressState, setProgressState] = useState<'idle' | 'starting' | 'generating' | 'completing'>('idle');
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/test-connection');
      const result = await res.json();
      if (!result.success) {
        setError('Stable Diffusion backend is not reachable.');
        console.error('Connection error:', result.error);
      }
    } catch (err) {
      setError('Failed to connect to backend.');
      console.error('Connection error:', err);
    }
  };

  const generatePrototype = async (prompt: string, fidelity: FidelityLevel) => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImage('');
    setProgress(0);
    setEta(null);
    setProgressState('starting');

    let poller: NodeJS.Timeout | null = null;

    const pollProgress = async () => {
      try {
        const res = await fetch('/api/progress');
        const data = await res.json();

        const pct = data.progress ?? 0;
        const etaSec = data.eta_relative ?? null;

        setProgress(pct * 100);
        setEta(etaSec);

        if (pct === 0 && etaSec === null) {
          setProgressState('starting');
        } else if (pct > 0 && pct < 99.5) {
          setProgressState('generating');
        } else {
          setProgressState('completing');
        }
      } catch {
        // Fail silently
      }
    };

    try {
      await pollProgress();
      poller = setInterval(pollProgress, 1500);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, fidelity }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || `Generation failed with status ${res.status}`);
      }

      const data = await res.json();
      if (!data.image) throw new Error('No image returned');

      setProgress(100);
      setImage(data.image);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error during generation';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      if (poller) clearInterval(poller);
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setProgressState('idle');
        setEta(null);
      }, 2000);
    }
  };

  const downloadPrototype = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image}`;
    link.download = `prototype-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deviceStyles = {
    desktop: { width: '100%', margin: '0' },
    tablet: { width: '768px', margin: '0 auto' },
    mobile: { width: '375px', margin: '0 auto' },
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">PROTO Twice AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>PROTO Twice - AI-Powered UI Generator</title>
        <meta name="description" content="Generate UI flows with AI and Stable Diffusion" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4361ee" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <Header />
      <OfflineStatus />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all hover:shadow-2xl">
            <AIGenerator
              onGenerate={generatePrototype}
              onDownload={downloadPrototype}
              loading={loading}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col transition-all hover:shadow-2xl">
            <PreviewSection
              device={device}
              setDevice={setDevice}
              image={image}
              downloadPrototype={downloadPrototype}
              loading={loading}
              error={error}
              deviceStyles={deviceStyles}
              progress={progress}
              progressState={progressState}
              eta={eta}
            />
          </div>
        </div>
      </main>

      <Footer />
      <InstallPrompt />
    </div>
  );
}