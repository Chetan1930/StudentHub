import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <p className="text-gray-400">
            Made with ❤️ by{' '}
            <span className="text-purple-500">Chetan Chauhan</span> and{' '}
            <span className="text-purple-500">Mayank Rawat</span>
          </p>
          <div className="flex gap-4">
            <a 
              href="https://github.com/Chetan1930/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-purple-500 transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/Chetan571" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-purple-500 transition-colors duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/chetan71/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-purple-500 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        <p className="text-gray-500">© 2025 StudentHub. All rights reserved.</p>
      </div>
    </footer>
  );
}