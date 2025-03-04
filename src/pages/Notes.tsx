import React, { useState, useEffect } from "react";
import { 
  Upload, 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  FileText, 
  Plus, 
  X, 
  Check, 
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Save,
  Loader2,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mock data for notes
const MOCK_NOTES = [
  {
    id: '1',
    title: 'Introduction to Data Structures',
    course: 'B.Tech',
    year: 'Second',
    semester: '3',
    subject: 'Data Structures',
    uploadDate: '2025-01-15',
    fileUrl: '#',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    uploadedBy: 'John Doe'
  },
  {
    id: '2',
    title: 'Algorithms Analysis',
    course: 'B.Tech',
    year: 'Second',
    semester: '4',
    subject: 'Algorithms',
    uploadDate: '2025-02-10',
    fileUrl: '#',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadedBy: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Database Management Systems',
    course: 'B.Tech',
    year: 'Third',
    semester: '5',
    subject: 'DBMS',
    uploadDate: '2025-03-05',
    fileUrl: '#',
    fileType: 'pdf',
    fileSize: '3.2 MB',
    uploadedBy: 'Alex Johnson'
  },
  {
    id: '4',
    title: 'Operating Systems Concepts',
    course: 'B.Tech',
    year: 'Third',
    semester: '5',
    subject: 'Operating Systems',
    uploadDate: '2025-03-20',
    fileUrl: '#',
    fileType: 'pdf',
    fileSize: '4.1 MB',
    uploadedBy: 'Sarah Williams'
  },
  {
    id: '5',
    title: 'Computer Networks',
    course: 'B.Tech',
    year: 'Third',
    semester: '6',
    subject: 'Networks',
    uploadDate: '2025-04-12',
    fileUrl: '#',
    fileType: 'pdf',
    fileSize: '2.9 MB',
    uploadedBy: 'Michael Brown'
  }
];

export default function Notes() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
    file: null,
  });
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    course: "",
    year: "",
    semester: "",
    subject: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'uploadDate',
    direction: 'desc'
  });
  
  const { user } = useAuth();
  
  // For demo purposes, we'll consider a specific user as admin
  const isAdmin = user && user.email === 'test@example.com';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newNote = {
        id: Date.now().toString(),
        title: formState.title,
        course: formState.course,
        year: formState.year,
        semester: formState.semester,
        subject: formState.subject,
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: '#',
        fileType: formState.file ? formState.file.name.split('.').pop() : 'pdf',
        fileSize: formState.file ? `${(formState.file.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
        uploadedBy: user ? user.name : 'Guest User'
      };
      
      setNotes([newNote, ...notes]);
      setFormState({ title: "", course: "", year: "", semester: "", subject: "", file: null });
      setShowUploadForm(false);
      setIsUploading(false);
    }, 1500);
  };

  const handleDelete = (id) => {
    // Only admin can delete notes
    if (isAdmin) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      course: "",
      year: "",
      semester: "",
      subject: ""
    });
    setSearchTerm("");
  };

  const filteredNotes = notes.filter(note => {
    return (
      (searchTerm === "" || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.course === "" || note.course === filters.course) &&
      (filters.year === "" || note.year === filters.year) &&
      (filters.semester === "" || note.semester === filters.semester) &&
      (filters.subject === "" || note.subject === filters.subject)
    );
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Notes Repository</h1>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Notes
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, subject, or uploader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="course"
                value={filters.course}
                onChange={handleFilterChange}
                className="px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">All Courses</option>
                <option value="B.Tech">B.Tech</option>
                <option value="B.Sc">B.Sc</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Com">B.Com</option>
                <option value="M.Com">M.Com</option>
                <option value="BBA">BBA</option>
              </select>
              
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">All Years</option>
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
                <option value="Fourth">Fourth</option>
              </select>
              
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">All Semesters</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
              
              <div className="flex gap-2 md:col-span-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {sortedNotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 py-3 text-left">
                      <button 
                        className="flex items-center gap-1 text-gray-300 hover:text-white"
                        onClick={() => requestSort('title')}
                      >
                        Title {getSortIcon('title')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button 
                        className="flex items-center gap-1 text-gray-300 hover:text-white"
                        onClick={() => requestSort('subject')}
                      >
                        Subject {getSortIcon('subject')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button 
                        className="flex items-center gap-1 text-gray-300 hover:text-white"
                        onClick={() => requestSort('course')}
                      >
                        Course {getSortIcon('course')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button 
                        className="flex items-center gap-1 text-gray-300 hover:text-white"
                        onClick={() => requestSort('uploadedBy')}
                      >
                        Uploaded By {getSortIcon('uploadedBy')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button 
                        className="flex items-center gap-1 text-gray-300 hover:text-white"
                        onClick={() => requestSort('uploadDate')}
                      >
                        Date {getSortIcon('uploadDate')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNotes.map((note) => (
                    <tr key={note.id} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-purple-500 mt-1" />
                          <div>
                            <div className="font-medium">{note.title}</div>
                            <div className="text-sm text-gray-400">{note.fileType.toUpperCase()} • {note.fileSize}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                          {note.subject}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>{note.course}</div>
                        <div className="text-sm text-gray-400">Year {note.year.charAt(0)} • Sem {note.semester}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {note.uploadedBy}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(note.uploadDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(note.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors group relative"
                              title="Delete (Admin Only)"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Admin Only
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-xl font-medium mb-2">No notes found</p>
              <p className="mb-4">Try adjusting your search or filters, or upload a new note.</p>
              <button
                onClick={() => {
                  resetFilters();
                  setShowUploadForm(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload New Note
              </button>
            </div>
          )}
        </div>

        {/* Admin Badge */}
        {isAdmin && (
          <div className="mt-4 bg-purple-900/30 border border-purple-800 rounded-lg p-3 flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-500" />
            <p className="text-purple-300 text-sm">
              You have admin privileges. You can delete any uploaded notes.
            </p>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Upload className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold">Upload New Note</h2>
                </div>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Note Title
                  </label>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState({...formState, title: e.target.value})}
                    placeholder="Enter a descriptive title"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Course
                    </label>
                    <select
                      value={formState.course}
                      onChange={(e) => setFormState({...formState, course: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    >
                      <option value="">Select Course</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="B.Com">B.Com</option>
                      <option value="M.Com">M.Com</option>
                      <option value="BBA">BBA</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Year
                    </label>
                    <select
                      value={formState.year}
                      onChange={(e) => setFormState({...formState, year: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="First">First</option>
                      <option value="Second">Second</option>
                      <option value="Third">Third</option>
                      <option value="Fourth">Fourth</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Semester
                    </label>
                    <select
                      value={formState.semester}
                      onChange={(e) => setFormState({...formState, semester: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    >
                      <option value="">Select Semester</option>
                      {formState.year === "First" && (
                        <>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </>
                      )}
                      {formState.year === "Second" && (
                        <>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </>
                      )}
                      {formState.year === "Third" && (
                        <>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </>
                      )}
                      {formState.year === "Fourth" && (
                        <>
                          <option value="7">7</option>
                          <option value="8">8</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      placeholder="Enter Subject"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      onChange={(e) => setFormState({...formState, file: e.target.files[0]})}
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-gray-500" />
                      <span className="text-gray-400">
                        {formState.file ? formState.file.name : "Click to select a file"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Supported formats: PDF, DOCX, PPT, TXT (Max: 10MB)
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Upload Note
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}