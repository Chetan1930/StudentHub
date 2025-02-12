import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles,
  ChevronDown,
  GraduationCap,
  ClipboardList,
  BookOpen,
  Briefcase,
  Info,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: ClipboardList,
      title: "Attendance Tracker",
      description: "Keep track of your attendance across all subjects and stay on top of your academic requirements.",
      path: "/attendance"
    },
    {
      icon: BookOpen,
      title: "Smart Notes",
      description: "Organize and access your study materials, lecture notes, and resources in one place.",
      path: "/notes"
    },
    {
      icon: Briefcase,
      title: "Portfolio Builder",
      description: "Create a professional portfolio to showcase your projects, skills, and achievements.",
      path: "/portfolio"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-purple-500 animate-float" />
          </div>
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 relative z-10">
              <span className="bg-clip-text text-transparent animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 background-animate">
              Your All-in-One College Companion
              </span>
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-3xl -z-10" />
          </div>
          <p className="text-xl md:text-2xl text-gray-300 text-center max-w-2xl mx-auto mb-8">
            Track attendance, manage notes, build your portfolio, and excel in your academic journey with our comprehensive student platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/attendance')}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 flex items-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="px-8 py-3 border border-purple-500 hover:bg-purple-500/10 rounded-lg transition-all duration-300 flex items-center gap-2 group"
            >
              <Info className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Learn More</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToFeatures}
          className="absolute bottom-8 animate-bounce p-2 hover:text-purple-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full"
          aria-label="Scroll to features"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => navigate(feature.path)}
              className="p-6 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 group text-left cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <feature.icon className="w-10 h-10 text-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}