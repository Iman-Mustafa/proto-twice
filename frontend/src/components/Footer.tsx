import { FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg">PROTO Twice &copy; {currentYear}</p>
            <p className="text-sm text-gray-400 mt-1">
              Generate interactive prototypes in seconds
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/yourusername/proto-twice" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <FaGithub className="h-6 w-6" />
            </a>
            <a 
              href="https://twitter.com/yourhandle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Twitter Profile"
            >
              <FaTwitter className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>Powered by Next.js, Tailwind CSS, and OpenAI</p>
        </div>
      </div>
    </footer>
  );
}