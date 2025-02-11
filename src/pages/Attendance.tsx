import React, { useState } from 'react';
import { ClipboardList, Plus, Check, Clock, Trash2, PlusCircle, AlertTriangle, ThumbsUp } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  attended: number;
  total: number;
}

export default function Attendance() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([
        ...subjects,
        {
          id: Date.now().toString(),
          name: newSubject.trim(),
          attended: 0,
          total: 0
        }
      ]);
      setNewSubject('');
      setShowAddModal(false);
    }
  };

  const recordClass = (subjectId: string) => {
    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { ...subject, total: subject.total + 1 }
        : subject
    ));
  };

  const markAttendance = (subjectId: string) => {
    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { 
            ...subject, 
            attended: subject.attended + 1,
            total: subject.total + 1
          }
        : subject
    ));
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(subject => subject.id !== subjectId));
  };

  const calculatePercentage = (attended: number, total: number) => {
    if (total === 0) return 0;
    return ((attended / total) * 100).toFixed(1);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateRequiredClasses = (attended: number, total: number) => {
    if (total === 0) return 0;
    const currentPercentage = (attended / total) * 100;
    
    if (currentPercentage >= 75) {
      // Calculate how many classes can be skipped while maintaining 75%
      const maxSkippableClasses = Math.floor((attended - (0.75 * total)) / 0.75);
      return maxSkippableClasses;
    } else {
      // Calculate how many classes need to be attended to reach 75%
      const requiredAttendance = Math.ceil((0.75 * total - attended) / 0.25);
      return requiredAttendance;
    }
  };

  const totalAttended = subjects.reduce((acc, subject) => acc + subject.attended, 0);
  const totalClasses = subjects.reduce((acc, subject) => acc + subject.total, 0);
  const overallPercentage = Number(calculatePercentage(totalAttended, totalClasses));
  const requiredClasses = calculateRequiredClasses(totalAttended, totalClasses);

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ClipboardList className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Attendance Tracker</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Subject
          </button>
        </div>

        {/* Overall Attendance Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Overall Attendance</h2>
          <div className="flex items-center gap-8">
            <div>
              <div className={`text-4xl font-bold ${getAttendanceColor(overallPercentage)}`}>
                {overallPercentage}%
              </div>
              <div className="text-gray-400 mt-1">
                {totalAttended} / {totalClasses} classes
              </div>
            </div>
            
            {totalClasses > 0 && (
              <div className="flex-1 p-4 rounded-lg bg-gray-700/50">
                {overallPercentage >= 75 ? (
                  <div className="flex items-start gap-3">
                    <ThumbsUp className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <div className="text-green-500 font-semibold">Good Standing!</div>
                      <div className="text-gray-300">
                        You can skip up to <span className="text-green-500 font-bold">{requiredClasses}</span> more {requiredClasses === 1 ? 'class' : 'classes'} while maintaining 75% attendance.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <div className="text-yellow-500 font-semibold">Attention Needed</div>
                      <div className="text-gray-300">
                        You need to attend <span className="text-yellow-500 font-bold">{requiredClasses}</span> more {requiredClasses === 1 ? 'class' : 'classes'} to reach 75% attendance.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map(subject => (
            <div 
              key={subject.id}
              className="bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold group-hover:text-purple-500 transition-colors">
                  {subject.name}
                </h3>
                <button
                  onClick={() => deleteSubject(subject.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className={`text-3xl font-bold ${getAttendanceColor(Number(calculatePercentage(subject.attended, subject.total)))}`}>
                  {calculatePercentage(subject.attended, subject.total)}%
                </div>
                <div className="text-gray-400">
                  {subject.attended} / {subject.total} classes
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => markAttendance(subject.id)}
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Present
                </button>
                <button
                  onClick={() => recordClass(subject.id)}
                  className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Subject Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Add New Subject</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter subject name"
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  onClick={addSubject}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}