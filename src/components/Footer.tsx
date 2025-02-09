import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 mb-4 md:mb-0">© 2025 StudentHub. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors duration-300">
            <Github className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors duration-300">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors duration-300">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}