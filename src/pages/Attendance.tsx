
import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Check, Clock, Trash2, PlusCircle, AlertTriangle, ThumbsUp } from 'lucide-react';
import { db } from '../context/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface Subject {
  id: string;
  name: string;
  attended: number;
  total: number;
}

export default function Attendance() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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

  const saveAttendance = async (updatedSubjects: Subject[]) => {
    if (user) {
      const docRef = doc(db, 'attendance', user.uid);
      await setDoc(docRef, { subjects: updatedSubjects }, { merge: true });
    }
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      const updatedSubjects = [
        ...subjects,
        { id: Date.now().toString(), name: newSubject.trim(), attended: 0, total: 0 }
      ];
      setSubjects(updatedSubjects);
      saveAttendance(updatedSubjects);
      setNewSubject('');
      setShowAddModal(false);
    }
  };

  const recordClass = (subjectId: string) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId ? { ...subject, total: subject.total + 1 } : subject
    );
    setSubjects(updatedSubjects);
    saveAttendance(updatedSubjects);
  };

  const markAttendance = (subjectId: string) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, attended: subject.attended + 1, total: subject.total + 1 }
        : subject
    );
    setSubjects(updatedSubjects);
    saveAttendance(updatedSubjects);
  };

  const deleteSubject = (subjectId: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    setSubjects(updatedSubjects);
    saveAttendance(updatedSubjects);
  };

  const calculatePercentage = (attended: number, total: number) => {
    if (total === 0) return 0;
    return ((attended / total) * 100).toFixed(1);
  };

  const calculateRequiredClasses = (attended: number, total: number) => {
    if (total === 0) return 0;
    const currentPercentage = (attended / total) * 100;
    if (currentPercentage >= 75) {
      return Math.floor((attended - 0.75 * total) / 0.75);
    } else {
      return Math.ceil((0.75 * total - attended) / 0.25);
    }
  };

  const totalAttended = subjects.reduce((acc, s) => acc + s.attended, 0);
  const totalClasses = subjects.reduce((acc, s) => acc + s.total, 0);
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
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Subject
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Overall Attendance</h2>
          <div className="text-4xl font-bold text-green-400">{overallPercentage}%</div>
          <div className="text-gray-300">{totalAttended} / {totalClasses} classes</div>
          <div className="mt-4 text-gray-200">
            {overallPercentage >= 75 ? (
              <div>
                You can skip {requiredClasses} classes without dropping below 75%.
              </div>
            ) : (
              <div>
                Attend {requiredClasses} more classes to reach 75%.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map(subject => (
            <div key={subject.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold text-purple-300">{subject.name}</h3>
                <button onClick={() => deleteSubject(subject.id)}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
              <div className="text-3xl font-bold text-green-400">{calculatePercentage(subject.attended, subject.total)}%</div>
              <div className="text-gray-300">{subject.attended}/{subject.total} classes</div>
              <div className="mt-4 flex gap-2">
                <button
                  className="px-3 py-2 bg-green-600 rounded" 
                  onClick={() => markAttendance(subject.id)}
                >Present</button>
                <button
                  className="px-3 py-2 bg-yellow-600 rounded"
                  onClick={() => recordClass(subject.id)}
                >Absent</button>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded">
              <input
                className="p-2 w-full mb-4 text-white bg-gray-700"
                type="text"
                placeholder="Enter subject name"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-purple-600 text-white mr-2"
                onClick={addSubject}
              >Add</button>
              <button
                className="px-4 py-2 bg-gray-600 text-white"
                onClick={() => setShowAddModal(false)}
              >Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}