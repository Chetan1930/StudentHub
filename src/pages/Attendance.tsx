
import { db } from '../context/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Check, 
  Clock, 
  Trash2, 
  PlusCircle, 
  AlertTriangle, 
  ThumbsUp, 
  Calendar, 
  BarChart2, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Save,
  AlertCircle
} from 'lucide-react';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

interface Subject {
  id: string;
  name: string;
  attended: number;
  total: number;
  lastUpdated?: string;
  records: AttendanceRecord[];
}

export default function Attendance() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthlyDetails, setShowMonthlyDetails] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  

  useEffect(() => {
    const fetchAttendance = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'attendance', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSubjects(docSnap.data().subjects || []);
          }
        } catch (err) {
          setError('Failed to fetch attendance data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAttendance();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const saveAttendance = (updatedSubjects) => {
    setSubjects((prevSubjects) => {
      const mergedSubjects = updatedSubjects.map((newSubj) => {
        const existingSubj = prevSubjects.find((subj) => subj.id === newSubj.id);
        return existingSubj ? { ...existingSubj, ...newSubj } : newSubj;
      });
  
      // Add subjects that are not in updatedSubjects
      const remainingSubjects = prevSubjects.filter(
        (subj) => !updatedSubjects.some((newSubj) => newSubj.id === subj.id)
      );
  
      return [...mergedSubjects, ...remainingSubjects];
    });
  };



  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects(prevsubjects =>{
        const updatedSubjects = [
          ...prevsubjects,
          {
            id: Date.now().toString(),
            name: newSubject.trim(),
            attended: 0,
            total: 0,
            lastUpdated: new Date().toISOString(),
            records: []
          }
        ];
        saveAttendance(updatedSubjects);
        return updatedSubjects;
      }
        
      );
      setNewSubject('');
      setShowAddModal(false);
      setHasUnsavedChanges(true);
    }
  };

  const adjustAttendance = (subjectId: string, field: 'attended' | 'total', increment: boolean) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === subjectId) {
        const newValue = increment 
          ? subject[field] + 1 
          : Math.max(0, subject[field] - 1);
        // Ensure attended doesn't exceed total
        if (field === 'attended' && newValue > subject.total) {
          return subject;
        }
        // If reducing total, ensure it doesn't go below attended
        if (field === 'total' && !increment && newValue < subject.attended) {
          return subject;
        }
        
        setHasUnsavedChanges(true);
        return {
          ...subject,
          [field]: newValue,
          lastUpdated: new Date().toISOString(),
          // records: newRecords
        };
      }
      return subject;
    }));
  };

  const recordClass = (subjectId: string) => {
    setSubjects( prevsubjects =>{
      const updatedSubjects = prevsubjects.map(subject =>
        subject.id === subjectId 
        ? { 
            ...subject, 
            total: subject.total + 1,
            lastUpdated: new Date().toISOString(),
            records: [
              ...subject.records,
              { date: new Date().toISOString(), status: 'absent' }
            ]
          }
        : subject
    );
    saveAttendance(updatedSubjects);
    return updatedSubjects;
    
  });
  setHasUnsavedChanges(true);
  };

  const markAttendance = (subjectId: string) => {
    setSubjects(prevsubjects => {
      const updatedSubjects = prevsubjects.map(subject =>
        subject.id === subjectId 
        ? { 
            ...subject, 
            attended: subject.attended + 1,
            total: subject.total + 1,
            lastUpdated: new Date().toISOString(),
            records: [
              ...subject.records,
              { date: new Date().toISOString(), status: 'present' }
            ]
          }
        : subject
      );
      saveAttendance(updatedSubjects);
            return updatedSubjects;
    });
    setHasUnsavedChanges(true);
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(prevSubjects => {
      const updatedSubjects = prevSubjects.filter(subject => subject.id !== subjectId);
      saveAttendance(updatedSubjects);
      return updatedSubjects;
    });
    setHasUnsavedChanges(true);
  };
  
  const saveChanges = async () => {
    setIsSaving(true);
    try {
      if(user){
        const docRef = doc(db, 'attendance', user.uid);
        await setDoc(docRef, { subjects }, { merge: true });
        setHasUnsavedChanges(false);
      }
      console.error('Failed to save changes:', error);
      // Here you would show an error message to the user
    } finally {
      setIsSaving(false);
    }
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

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateRequiredClasses = (attended: number, total: number) => {
    if (total === 0) return 0;
    const currentPercentage = (attended / total) * 100;
    
    if (currentPercentage >= 75) {
      const maxSkippableClasses = Math.floor((attended - (0.75 * total)) / 0.75);
      return maxSkippableClasses;
    } else {
      const requiredAttendance = Math.ceil((0.75 * total - attended) / 0.25);
      return requiredAttendance;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalAttended = subjects.reduce((acc, subject) => acc + subject.attended, 0);
  const totalClasses = subjects.reduce((acc, subject) => acc + subject.total, 0);
  const overallPercentage = Number(calculatePercentage(totalAttended, totalClasses));
  const requiredClasses = calculateRequiredClasses(totalAttended, totalClasses);

  // Get days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get attendance data for selected month
  const getMonthlyAttendanceData = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const data = Array(daysInMonth).fill(0).map((_, index) => {
      const day = index + 1;
      const date = new Date(selectedYear, selectedMonth, day);
      const records = subjects.flatMap(subject => 
        subject.records.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getDate() === day && 
                 recordDate.getMonth() === selectedMonth && 
                 recordDate.getFullYear() === selectedYear;
        })
      );
      
      const present = records.filter(r => r.status === 'present').length;
      const total = records.length;
      
      return {
        day,
        date,
        present,
        total,
        percentage: total > 0 ? (present / total) * 100 : 0
      };
    });

    return data;
  };

  const monthlyData = getMonthlyAttendanceData();

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (

    
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ClipboardList className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Attendance Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
            <button
              onClick={saveChanges}
              disabled={!hasUnsavedChanges || isSaving}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                hasUnsavedChanges 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className={`w-5 h-5 ${isSaving ? 'animate-spin' : ''}`} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Subject
            </button>
          </div>
        </div>

        {/* Overall Attendance Stats */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Circular Progress and Stats */}
          <div className="bg-gray-800 rounded-lg p-6 animate-fade-in">
            <div className="flex items-center gap-6">
              {/* Circular Progress */}
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-gray-700 fill-none"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="45"
                  />
                  <circle
                    className={`fill-none transition-all duration-1000 ${
                      overallPercentage >= 75 ? 'stroke-green-500' : 
                      overallPercentage >= 60 ? 'stroke-yellow-500' : 'stroke-red-500'
                    }`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${overallPercentage * 2.83}, 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    cx="50"
                    cy="50"
                    r="45"
                  />
                  <text
                    x="50"
                    y="50"
                    className="font-bold text-2xl"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="currentColor"
                  >
                    {overallPercentage}%
                  </text>
                </svg>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Overall Attendance</h2>
                <div className="text-gray-400 mb-2">
                  {totalAttended} / {totalClasses} classes attended
                </div>
                {totalClasses > 0 && (
                  <div className="text-sm">
                    {overallPercentage >= 75 ? (
                      <div className="text-green-500 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Can skip {requiredClasses} classes
                      </div>
                    ) : (
                      <div className="text-yellow-500 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Need {requiredClasses} more classes
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Attendance View */}
          <div className="bg-gray-800 rounded-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold">Monthly Progress</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMonthlyDetails(!showMonthlyDetails)}
                  className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {showMonthlyDetails ? 'Hide Details' : 'Show Details'}
                </button>
                {showMonthlyDetails && (
                  <>
                    <button 
                      onClick={prevMonth}
                      className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium min-w-[120px] text-center">
                      {months[selectedMonth]} {selectedYear}
                    </span>
                    <button 
                      onClick={nextMonth}
                      className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {showMonthlyDetails && (
  <div className="grid grid-cols-7 gap-1 text-center text-sm">
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
      <div key={day} className="text-gray-500 font-medium py-1">
        {day}
      </div>
    ))}
    {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, i) => (
      <div key={`empty-${i}`} className="aspect-square" />
    ))}
    {monthlyData.map(({ day, present, total, percentage }) => (
      <div 
      key={day}
      className={`cursor-pointer aspect-square p-1 rounded-lg ${
        total > 0 
          ? percentage >= 75 
            ? 'bg-green-500/20' 
            : percentage >= 60 
              ? 'bg-yellow-500/20'
              : 'bg-red-500/20'
          : 'bg-gray-700/50'
      }`}
      onClick={() => {
        const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        window.location.href = `/date-records/${formattedDate}`;
      }}
    >
      <div className="h-full flex flex-col justify-between p-1">
        <span className="text-xs">{day}</span>
        {total > 0 && (
          <div className="text-[10px] font-medium">
            {present}/{total}
          </div>
        )}
      </div>
    </div>
    ))}
  </div>
)}
          </div>
        </div>

        {/* Subjects List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 font-medium text-gray-400">
            <div className="col-span-3">Subject</div>
            <div className="col-span-3 text-center">Attended</div>
            <div className="col-span-3 text-center">Total</div>
            <div className="col-span-1 text-center">%</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          
          {subjects.map(subject => {
            const percentage = Number(calculatePercentage(subject.attended, subject.total));
            return (
              <div key={subject.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 items-center hover:bg-gray-700/50 transition-colors">
                <div className="col-span-3">
                  <div className="font-medium">{subject.name}</div>
                  {subject.lastUpdated && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(subject.lastUpdated)}
                    </div>
                  )}
                </div>
                
                {/* Attended Classes with Adjustment */}
                <div className="col-span-3 flex items-center justify-center gap-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => adjustAttendance(subject.id, 'attended', true)}
                      className="p-1 hover:bg-gray-700 rounded-t-lg transition-colors text-gray-400 hover:text-purple-500"
                      title="Increase attended classes"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-center py-1">{subject.attended}</span>
                    <button
                      onClick={() => adjustAttendance(subject.id, 'attended', false)}
                      className="p-1 hover:bg-gray-700 rounded-b-lg transition-colors text-gray-400 hover:text-purple-500"
                      title="Decrease attended classes"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Total Classes with Adjustment */}
                <div className="col-span-3 flex items-center justify-center gap-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => adjustAttendance(subject.id, 'total', true)}
                      className="p-1 hover:bg-gray-700 rounded-t-lg transition-colors text-gray-400 hover:text-purple-500"
                      title="Increase total classes"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-center py-1">{subject.total}</span>
                    <button
                      onClick={() => adjustAttendance(subject.id, 'total', false)}
                      className="p-1 hover:bg-gray-700 rounded-b-lg transition-colors text-gray-400 hover:text-purple-500"
                      title="Decrease total classes"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="col-span-1 text-center">
                  <span className={getAttendanceColor(percentage)}>
                    {percentage}%
                  </span>
                </div>

                <div className="col-span-2 flex justify-center gap-2">
                  <button
                    onClick={() => markAttendance(subject.id)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    title="Mark Present"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => recordClass(subject.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Mark Absent"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          
          {subjects.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No subjects added yet. Click the "Add Subject" button to get started.
            </div>
          )}
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