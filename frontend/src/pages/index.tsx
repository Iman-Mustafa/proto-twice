import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import AIGenerator from '@/components/AIGenerator';
import PreviewSection from '@/components/PreviewSection';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Dynamically import components that use browser APIs
const OfflineStatus = dynamic(() => import('@/components/OfflineStatus'), { 
  ssr: false,
  loading: () => <div className="fixed top-4 left-1/2 transform -translate-x-1/2">Loading status...</div>
});

const InstallPrompt = dynamic(() => import('@/components/InstallPrompt'), { 
  ssr: false,
  loading: () => <div className="fixed bottom-4 right-4">Loading install prompt...</div>
});

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type FidelityLevel = 'high' | 'medium' | 'low';

export default function Home() {
  const [generatedHTML, setGeneratedHTML] = useState<string>('');
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false); // Track client-side state
  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts on client
  }, []);

  const generatePrototype = async (prompt: string, fidelity: FidelityLevel) => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, fidelity })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const { html } = await response.json() as { html: string };
      setGeneratedHTML(html);
      
      // Update iframe content
      if (previewFrameRef.current?.contentDocument) {
        const iframeDoc = previewFrameRef.current.contentDocument;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPrototype = () => {
    if (!generatedHTML) return;
    
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prototype.html';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Set up device-specific styles
  const deviceStyles = {
    desktop: { width: '100%', margin: '0' },
    tablet: { width: '768px', margin: '0 auto' },
    mobile: { width: '375px', margin: '0 auto' }
  };

  // Show loading state while initializing
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Initializing PROTO Twice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>PROTO Twice - AI-Powered Prototype Generator</title>
        <meta name="description" content="Generate responsive prototypes with AI" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4361ee" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <Header />
      <OfflineStatus />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Describe Your Application</h2>
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
              previewFrameRef={previewFrameRef}
              generatedHTML={generatedHTML}
              downloadPrototype={downloadPrototype}
              loading={loading}
              error={error}
              deviceStyles={deviceStyles}
            />
          </div>
        </div>
      </main>
      
      <Footer />
      <InstallPrompt />
    </div>
  );
}