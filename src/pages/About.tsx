import React from 'react';
import { Info, GraduationCap, Users, Target, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Info className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold">About Us</h1>
        </div>
        
        <div className="grid gap-8">
          {/* Main Content */}
          <div className="bg-gray-800 rounded-lg p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <GraduationCap className="w-12 h-12 text-purple-500" />
              <div>
                <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
                <p className="text-gray-400">
                  Created by Mayank Rawat and Chetan Chauhan, StudentHub was born from a deep understanding 
                  of the challenges that university students face during their academic journey.
                </p>
              </div>
            </div>
            
            <div className="space-y-6 text-gray-300">
              <p>
                As former students ourselves, we recognized the common hurdles that students encounter: 
                managing attendance, organizing study materials, and building a professional portfolio. 
                Our platform is designed to address these specific challenges and make student life more 
                manageable and productive.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <Users className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">For Students, By Students</h3>
                  <p className="text-gray-400">Built with a deep understanding of student needs and challenges</p>
                </div>
                
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Purpose-Driven</h3>
                  <p className="text-gray-400">Focused on solving real academic and organizational challenges</p>
                </div>
                
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <Heart className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community First</h3>
                  <p className="text-gray-400">Committed to supporting and empowering student success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}