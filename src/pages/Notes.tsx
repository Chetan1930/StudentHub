import React, { useState } from "react";
import { Upload, BookOpen } from "lucide-react";

export default function NotesApp() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formState, setFormState] = useState({
    course: "",
    branch: "",
    year: "",
    semester: "",
    subject: "",
    file: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("File uploaded successfully!");
    setFormState({ course: "", branch: "", year: "", semester: "", subject: "", file: null });
    setShowUploadForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 text-white">
      <h2 className="text-3xl font-bold mb-6">Student Notes Portal</h2>
      {!showUploadForm ? (
        <div className="flex space-x-4">
          <button
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2"
            onClick={() => setShowUploadForm(true)}
          >
            <Upload /> Upload Notes
          </button>
          <button className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg flex items-center gap-2">
            <BookOpen /> View Notes
          </button>
        </div>
      ) : (
        <div className="max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Upload Notes</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
              onChange={(e) => setFormState({ ...formState, course: e.target.value })}
              value={formState.course}
            >
              <option value="">Select Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.Sc">B.Sc</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
            </select>
            <select
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
              onChange={(e) => setFormState({ ...formState, branch: e.target.value })}
              value={formState.branch}
            >
              <option value="">Select Branch</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="IT">IT</option>
              <option value="CEDS">CEDS</option>
              <option value="EE">EE</option>
              <option value="ENC">ENC</option>
              <option value="Mech">Mech</option>
              <option value="IOT">IOT</option>
              <option value="Civil">Civil</option>
              <option value="Robotics">Robotics</option>
            </select>
            <select
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
              onChange={(e) => setFormState({ ...formState, year: e.target.value })}
              value={formState.year}
            >
              <option value="">Select Year</option>
              <option value="First">First</option>
              <option value="Second">Second</option>
              <option value="Third">Third</option>
              <option value="Fourth">Fourth</option>
            </select>
            <select
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
              onChange={(e) => setFormState({ ...formState, semester: e.target.value })}
              value={formState.semester}
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
            <input
              type="text"
              placeholder="Enter Subject"
              value={formState.subject}
              onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="file"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
              onChange={(e) => setFormState({ ...formState, file: e.target.files[0] })}
            />
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center gap-2 text-white transition-all duration-300"
            >
              <Upload /> Submit Notes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}