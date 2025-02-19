import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../context/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface AttendanceRecord {
  status: 'present' | 'absent';
  subjectName: string;
}

interface Subject {
  id: string;
  name: string;
  records: AttendanceRecord[];
}

const DateRecords = () => {
  const { date } = useParams<{ date: string }>();
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'attendance', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const subjects: Subject[] = docSnap.data().subjects || [];
            const filteredRecords = subjects.flatMap(subject =>
              subject.records
                .filter(record => record.status)
                .map(record => ({ ...record, subjectName: subject.name }))
            );
            setRecords(filteredRecords);
          } else {
            setError('No attendance records found.');
          }
        } catch {
          setError('Failed to fetch attendance records.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRecords();
  }, [user, date]);
  const toggleStatus = async (recordIndex: number) => {
    if (!user) return;
  
    const updatedRecords = [...records];
    updatedRecords[recordIndex].status =
      updatedRecords[recordIndex].status === 'present' ? 'absent' : 'present';
    setRecords(updatedRecords);
  
    try {
      const docRef = doc(db, 'attendance', user.uid);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        console.error("User attendance document not found.");
        return;
      }
  
      const data = docSnap.data();
      let subjects: Subject[] = data.subjects || [];
  
      let updatedSubjects = subjects.map(subject => ({
        ...subject,
        records: subject.records.map(record =>
          record.date === updatedRecords[recordIndex].date
            ? { ...record, status: updatedRecords[recordIndex].status }
            : record
        ),
      }));
  
      console.log("Updating Firestore with:", updatedSubjects);
      await updateDoc(docRef, { subjects: updatedSubjects });
  
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };
  const deleteRecord = async (recordIndex: number) => {
    if (!user) return;
  
    const updatedRecords = records.filter((_, index) => index !== recordIndex);
    setRecords(updatedRecords);
  
    try {
      const docRef = doc(db, 'attendance', user.uid);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        console.error("User attendance document not found.");
        return;
      }
  
      const data = docSnap.data();
      let subjects: Subject[] = data.subjects || [];
  
      let updatedSubjects = subjects.map(subject => ({
        ...subject,
        records: subject.records.filter(
          record => record.date !== records[recordIndex].date
        ),
      }));
  
      console.log("Updating Firestore after deletion with:", updatedSubjects);
      await updateDoc(docRef, { subjects: updatedSubjects });
  
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Records for {date}</h1>
        </div>
        <div className="bg-gray-800 rounded-lg p-8">
          {loading ? (
            <p className="text-gray-400">Loading records...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : records.length === 0 ? (
            <p className="text-gray-400">No records found for this date.</p>
          ) : (
            <ul className="space-y-3">
              {records.map((record, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                  <span className="text-gray-700">{record.subjectName} - {record.status}</span>
                  <div className="space-x-2">
                    <button 
                      onClick={() => toggleStatus(index)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                    >
                      Change
                    </button>
                    <button 
                      onClick={() => deleteRecord(index)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateRecords;
