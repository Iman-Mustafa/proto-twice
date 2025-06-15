import { useState, FormEvent } from 'react';
import { FiDownload, FiBattery, FiBatteryCharging, FiZap, FiAlertCircle } from 'react-icons/fi';

type FidelityLevel = 'high' | 'medium' | 'low';

interface AIGeneratorProps {
  onGenerate: (prompt: string, fidelity: FidelityLevel) => Promise<void>;
  onDownload: () => void;
  loading: boolean;
}

export default function AIGenerator({ 
  onGenerate, 
  onDownload,
  loading 
}: AIGeneratorProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [fidelity, setFidelity] = useState<FidelityLevel>('high');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!prompt.trim()) {
      setError('Please describe your prototype');
      return;
    }

    try {
      await onGenerate(prompt, fidelity);
    } catch (err) {
      setError('Failed to generate prototype. Please try again.');
      console.error('Generation error:', err);
    }
  };

  const fidelityOptions = [
    {
      value: 'high',
      label: 'High Fidelity',
      icon: <FiBatteryCharging className="h-5 w-5" />,
      description: 'Production-ready design with full styling'
    },
    {
      value: 'medium',
      label: 'Balanced',
      icon: <FiBattery className="h-5 w-5" />,
      description: 'Good visuals with basic interactions'
    },
    {
      value: 'low',
      label: 'Wireframe',
      icon: <FiZap className="h-5 w-5" />,
      description: 'Basic layout structure only'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 transition-all hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Describe Your Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            className={`w-full h-40 p-4 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            placeholder="Example: 
A modern dashboard with:
- Navigation sidebar
- Statistics cards
- Interactive charts
- Recent activity feed"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            disabled={loading}
            aria-label="Prototype description"
          />
          {error && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <FiAlertCircle className="mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Fidelity Level</h3>
          <div className="grid grid-cols-3 gap-3">
            {fidelityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`flex flex-col items-center p-3 rounded-lg transition-all border ${
                  fidelity === option.value
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setFidelity(option.value as FidelityLevel)}
                disabled={loading}
                aria-label={`Set ${option.label} fidelity`}
              >
                <span className="mb-1">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
                <span className="text-xs mt-1 text-gray-500">{option.description}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className={`flex-1 py-3 px-6 rounded-lg text-white font-bold transition-all flex items-center justify-center ${
              loading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
            }`}
            disabled={loading}
            aria-label="Generate prototype"
          >
            {loading ? (
              <>
                <div className="spinner border-2 border-t-white rounded-full w-5 h-5 mr-2 animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <FiZap className="h-5 w-5 mr-2" />
                Generate with AI
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onDownload}
            className="py-3 px-6 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 hover:shadow-lg transition-all flex items-center justify-center"
            aria-label="Download prototype"
          >
            <FiDownload className="h-5 w-5 mr-2" />
            Download
          </button>
        </div>
      </form>
    </div>
  );
}