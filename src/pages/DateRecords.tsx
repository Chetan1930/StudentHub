import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../context/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
  subjectName: string;
}

interface Subject {
  id: string;
  name: string;
  attended: number;
  total: number;
  lastUpdated?: string;
  records: AttendanceRecord[];
}

const DateRecords = () => {
  const { date } = useParams<{ date: string }>();
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('fetching records');
    const fetchRecords = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'attendance', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const subjects: Subject[] = docSnap.data().subjects || [];
            const filteredRecords = subjects.flatMap(subject =>
              subject.records
                .filter(record => record.date.startsWith(date))
                .map(record => ({ ...record, subjectName: subject.name }))
            );
            setRecords(filteredRecords);
          } else {
            setError('No attendance records found.');
          }
        } catch (err) {
          setError('Failed to fetch attendance records.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRecords();
  }, [user, date]);

  // Function to toggle status (present <-> absent)
  const toggleStatus = async (recordIndex: number) => {
    if (!user) return;
    
    const updatedRecords = [...records];
    updatedRecords[recordIndex].status = updatedRecords[recordIndex].status === 'present' ? 'absent' : 'present';
    setRecords(updatedRecords);

    try {
      const docRef = doc(db, 'attendance', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const subjects: Subject[] = data.subjects || [];

        for (let subject of subjects) {
          let record = subject.records.find(r => r.date === updatedRecords[recordIndex].date);
          if (record) {
            record.status = updatedRecords[recordIndex].status;
            break;
          }
        }

        await updateDoc(docRef, { subjects });
      }
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  // Function to delete a record
  const deleteRecord = async (recordIndex: number) => {
    if (!user) return;

    const recordToDelete = records[recordIndex];
    const updatedRecords = records.filter((_, index) => index !== recordIndex);
    setRecords(updatedRecords);

    try {
      const docRef = doc(db, 'attendance', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const subjects: Subject[] = data.subjects || [];

        for (let subject of subjects) {
          subject.records = subject.records.filter(r => r.date !== recordToDelete.date);
        }

        await updateDoc(docRef, { subjects });
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  if (loading) return <div>Loading records...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Records for {date}</h1>
      {records.length === 0 ? (
        <p>No records found for this date.</p>
      ) : (
        <ul className="list-disc pl-5">
          {records.map((record, index) => (
            <li key={index} className="mb-2 flex items-center gap-2">
              <span>{record.date} - {record.subjectName} - {record.status}</span>
              <button 
                onClick={() => toggleStatus(index)} 
                className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Change
              </button>
              <button 
                onClick={() => deleteRecord(index)} 
                className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul> 
      )}
    </div>
  );
};

export default DateRecords;