import { FiZap } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 shadow-lg">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center">
          <FiZap className="h-8 w-8 mr-2" />
          <h1 className="text-4xl font-bold">PROTO Twice</h1>
        </div>
        <p className="text-xl opacity-90 mt-2">AI-Powered Prototype Generator</p>
      </div>
    </header>
  );
}