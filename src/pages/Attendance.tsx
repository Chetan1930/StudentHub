import React from 'react';
import { ClipboardList } from 'lucide-react';

export default function Attendance() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ClipboardList className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Attendance Tracker</h1>
        </div>
        <div className="bg-gray-800 rounded-lg p-8">
          <p className="text-gray-400">Attendance tracking features coming soon...</p>
        </div>
      </div>
    </div>
  );
}