import { useState } from 'react';
import axios from 'axios';
import workvd from '../assets/submitwork.mp4';

const Workupdate = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user"));

    // --- RESTORED (Removed _id check) ---
    // The previous check '!currentUser || !currentUser._id' is removed.
    // However, ensure 'currentUser' is available for 'username' and 'email'.
    if (!currentUser) {
      setUploadStatus("❌ User data not found in local storage. Please log in.");
      console.error("User data missing from localStorage for upload.");
      return;
    }
    // --- END RESTORED ---

    console.log("Current user:", currentUser);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("username", currentUser?.name || "Unknown");
    formData.append("email", currentUser?.email || "Unknown");
    // --- RESTORED (Removed appending userId) ---
    // formData.append("userId", currentUser._id); // This line is removed.
    // --- END RESTORED ---

    try {
      // It's still highly recommended to send the Authorization token for security.
      // Your backend should use this token to identify the user securely,
      // rather than relying on 'username' or 'email' from form data for user attribution.
      await axios.post('http://localhost:5002/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`, // Keep this for backend authentication
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('✅ File uploaded successfully!');
      setSelectedFile(null); // Clear selected file after successful upload
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(`❌ Upload failed: ${error.response?.data?.message || error.message}. Please try again.`);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <video
        src={workvd}
        autoPlay
        loop
        muted
        playsInline
        tabIndex={-1}
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-[-1]"/>
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Submit Your Work</h2>
        <p className="text-gray-600 mb-6">
          Accepted formats: <span className="font-medium">PDF, DOCX, PPTX</span>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf,.docx,.pptx"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600"
          />
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-200"
          >
            Upload
          </button>
        </form>

        {uploadStatus && (
          <p className="mt-4 text-sm text-gray-700">{uploadStatus}</p>
        )}
      </div>
    </div>
  );
};

export default Workupdate;