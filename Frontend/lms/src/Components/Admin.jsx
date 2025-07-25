
import Settings from "../assets/settings.png"
import profile from "../assets/profile.jpg"
import works from "../assets/works.png"
import reports from "../assets/reports.jpg"
import adminbg from "../assets/adminbg.mp4"
import announce from "../assets/announce.jpg"
import React, { useState, useRef, useEffect } from 'react';
import data from "../assets/data.jpg"
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showWorkSubmitted, setShowWorkSubmitted] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  //Data submisioon t admin below 
  const fetchSubmissions = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch('http://localhost:5002/admin/submissions');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    setSubmissions(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  
  
  return (

    <div className="relative min-h-screen overflow-hidden">
  <div aria-hidden="true"
  className="pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
  <video
    src={adminbg}
    autoPlay
    loop
    muted
    playsInline
    tabIndex={-1}
    className="w-full h-full object-cover pointer-events-none "/>
</div>

      {/* Navbar */}
      <div className="w-full p-4 flex justify-between items-center z-50
     bg-blue-600 bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-20 text-white shadow-md">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
        
        {/* Dropdown Button */}
        <div className="relative z-50">
    <button onClick={() => setIsOpen(!isOpen)}className="w-26 h-10 p-3 flex justify-between items-center 
  bg-white bg-opacity-10 backdrop-blur-md text-white border border-white border-opacity-30 rounded-md shadow-md">
  Admin
</button>
       
          
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-6">
  {/* Individual Grid Boxes */}
  <button
  onClick={() => {
    setShowWorkSubmitted(true);
    fetchSubmissions();
  }}
  className="bg-white bg-opacity-10 backdrop-blur-md text-white
hover:scale-105 hover:bg-opacity-20 transition-transform duration-300 ease-in-out
flex flex-col items-center justify-center z-0 rounded-lg p-6 border border-white border-opacity-30 shadow-lg"
>
  <img src={works} alt="Courses Logo" className="w-16 h-16 mb-2 opacity-80 hover:opacity-100 transition-opacity duration-300" />
  <h2 className="text-lg font-semibold tracking-wide">Work Submitted</h2>
</button>


  <button className="bg-white bg-opacity-10 backdrop-blur-md text-white
hover:scale-105 hover:bg-opacity-20 transition-transform duration-300 ease-in-out
flex flex-col items-center justify-center rounded-lg p-6 border border-white border-opacity-30 shadow-lg">
    <img src={announce} alt="Students Logo" className="w-16 h-16 mb-2" />
    <h2 className="text-lg font-semibold">Announcement</h2>
  </button>

  <button className="relative z-[0] bg-white bg-opacity-10 backdrop-blur-md text-white
hover:scale-105 hover:bg-opacity-20 transition-transform duration-300 ease-in-out
flex flex-col items-center justify-center rounded-lg p-6 border border-white border-opacity-30 shadow-lg">
    <img src={reports} alt="Reports Logo" className="w-16 h-16 mb-2" />
    <h2 className="text-lg font-semibold">Reports</h2>
  </button>

  <button className="bg-white bg-opacity-10 backdrop-blur-md text-white
hover:scale-105 hover:bg-opacity-20 transition-transform duration-300 ease-in-out
flex flex-col items-center justify-center rounded-lg p-6 border border-white border-opacity-30 shadow-lg">
    <img src={Settings} alt="Settings Logo" className="w-16 h-16 mb-2" />
    <h2 className="text-lg font-semibold">Settings</h2>
  </button>

  <button className="bg-white bg-opacity-10 backdrop-blur-md text-white
hover:scale-105 hover:bg-opacity-20 transition-transform duration-300 ease-in-out
flex flex-col items-center justify-center rounded-lg p-6 border border-white border-opacity-30 shadow-lg">
    <img src={profile} alt="Profile Logo" className="w-16 h-16 mb-2" />
    <h2 className="text-lg font-semibold">Profiles Emp</h2>
  </button>

  <button className="bg-white bg-opacity-10 backdrop-blur-md text-white
hover:scale-105 hover:bg-opacity-20 transition-transform duration-300 ease-in-out
flex flex-col items-center justify-center rounded-lg p-6 border border-white border-opacity-30 shadow-lg">
    <img src={data} alt="Analytics Logo" className="w-16 h-16 mb-2" />
    <h2 className="text-lg font-semibold">Analytics</h2>
  </button>
</div>
{showWorkSubmitted && (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Submitted Works</h2>
    {loading && <p>Loading...</p>}
    {error && <p className="text-red-600">Error: {error}</p>}
    {!loading && submissions.length === 0 && <p>No work submitted yet.</p>}
    {!loading && submissions.length > 0 && (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">File</th>
              <th className="px-4 py-2 border">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-2 border">{submission.username}</td>
                <td className="px-4 py-2 border">{submission.email}</td>
                <td className="px-4 py-2 border">
                  <a href={submission.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View File</a>
                </td>
                <td className="px-4 py-2 border">{new Date(submission.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
{isOpen && (
  <div
    ref={dropdownRef}
    className="absolute top-[70px] right-[20px] w-40 bg-gray-600 shadow-md rounded-md z-[9999]"
  >
    <ul className="py-2">
      <li className="w-full text-left px-4 py-2 hover:bg-blue-500 cursor-pointer text-white">Settings</li>
      <li>
        <button
          className="w-full text-left px-3 py-2 hover:bg-blue-500 cursor-pointer text-white"
          onClick={() => navigate('/Loginpage')}
        >
          Logout
        </button>
      </li>
    </ul>
  </div>
)}

</div>
  
);
};

export default Admin;