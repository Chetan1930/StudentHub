import React, { useState } from 'react';
import { Phone, Send, User, Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");
    
    const formData = new FormData(e.target);
    formData.append("access_key", "4522fcfd-2555-419a-8d88-11de4d4b20cc");
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setResult("Form Submitted Successfully");
        setFormState({ name: '', email: '', query: '' });
      } else {
        console.error("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      console.error("Submission Error", error);
      setResult("An error occurred. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Phone className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Contact Us</h1>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-8">
          <form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            name="contact"
            method="POST"
          >
            <input type="hidden" name="access_key" value="4522fcfd-2555-419a-8d88-11de4d4b20cc" />
            
            <div className="relative group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                <User className="w-4 h-4 inline-block mr-2" />
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none text-white"
                placeholder="Enter your name"
              />
            </div>

            <div className="relative group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                <Mail className="w-4 h-4 inline-block mr-2" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formState.email}
                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none text-white"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative group">
              <label htmlFor="query" className="block text-sm font-medium text-gray-400 mb-2">
                <MessageSquare className="w-4 h-4 inline-block mr-2" />
                Your Query
              </label>
              <textarea
                id="query"
                name="query"
                required
                value={formState.query}
                onChange={(e) => setFormState(prev => ({ ...prev, query: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none text-white resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <Send className={`w-4 h-4 ${isSubmitting ? 'animate-ping' : ''}`} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          <span className="block text-center mt-4 text-white">{result}</span>
        </div>
      </div>
    </div>
  );
}
