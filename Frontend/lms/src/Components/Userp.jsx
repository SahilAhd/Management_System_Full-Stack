import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import ProfileSlider from './ProfileSlider';
import { useEffect, useState } from "react";
import UserP from '../assets/submitwork.mp4'; // Keeping the video import as it's used for background

const Userp = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Login backend logic code
  const [, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid JSON in localStorage:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/Userp");
      }
    } else {
      navigate("/Userp");
    }
  }, [navigate, setUser]);

  // Removed selectedFile, uploadMessage state variables.
  // Removed handleFileChange and handleUpload functions.
  // Their functionality is correctly handled in Workupdate.jsx

  return (
    <div>
      <video
        src={UserP}
        autoPlay
        loop
        muted
        playsInline
        tabIndex={-1}
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-[-1]"
      />

      {/* Hover zone to trigger sidebar */}
      <div
        className="absolute top-0 left-0 h-full w-6 z-50"
        onMouseEnter={() => setShowSidebar(true)}
      ></div>

      {/* Sidebar with animation */}
      {showSidebar && (
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          transition={{ duration: 0.5 }}
          // Applying blur/transparency to the sidebar itself
          className="fixed top-0 left-0 h-full w-56 bg-zinc-600 bg-opacity-70 backdrop-blur-sm text-white p-4 space-y-4 z-50" // Adjusted opacity and added backdrop-blur
          onMouseLeave={() => setShowSidebar(false)}
        >
          <div className="pt-12"></div>
          {/* Moved the transparent/blur div for the sidebar buttons here */}
          <div className="flex flex-col gap-y-6"> {/* This div now correctly wraps the buttons */}
            <button
              className="bg-blue-600 hover:bg-blue-900 px-2 py-2 w-[11.5rem] rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/notfound')}
            >
              📅 Attendance
            </button>

            <button
              className="bg-green-600 hover:bg-green-900 px-2 py-2 w-[11.5rem] rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/Workupdate')}
            >
              🛠 Work Update
            </button>

            <button
              className="bg-purple-600 hover:bg-purple-900 px-2 py-2 w-[11.5rem] rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/notfound')}
            >
              📂 Assignments
            </button>

            <button
              className="bg-yellow-600 hover:bg-yellow-900 px-2 py-2 w-[11.5rem] rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/notfound')}
            >
              📋 Daily Planner
            </button>

            <button
              className="bg-pink-600 hover:bg-pink-900 px-2 py-2 w-[11.5rem] rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/notfound')}
            >
              💬 Announcements
            </button>

            <button
              className="bg-indigo-600 hover:bg-indigo-900 px-2 py-2 w-[11.5rem] rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/notfound')}
            >
              📚 Resources
            </button>

            <button
              className="bg-red-600 hover:bg-red-800 px-2 py-2 w-[11.5rem] rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => navigate('/notfound')}
            >
              📊 Reports
            </button>
          </div>
        </motion.div>
      )}

      {/* Main content area */}
      <div className="relative min-h-screen">
        {/* Header with navigation buttons and profile dropdown */}
        {/* Corrected: Using w-full and justify-center to properly center the navigation block */}
        <div className="flex justify-center items-center text-white w-full py-4"> {/* Added w-full and justify-center/items-center */}
            {/* This inner div now groups all your main header content to be centered */}
            <div className="flex items-center ml-[22rem] gap-x-[20rem]"> {/* Used gap-x-16 instead of ml-[23rem]/gap-[30rem] */}
                <div className="flex gap-20"> {/* Group navigation buttons */}
                    <button className="relative group text-white font-medium">
                    Home
                    <span className="absolute left-0 -bottom-1 h-1 rounded-sm w-0 bg-red-500 transition-all duration-500 group-hover:w-full"></span>
                    </button>
                    <button className="relative group text-white font-medium">
                    Contact
                    <span className="absolute left-0 -bottom-1 h-1 rounded-sm w-0 bg-green-400 transition-all duration-500 group-hover:w-full"></span>
                    </button>
                    <button className="relative group text-white font-medium">
                    Announcement
                    <span className="absolute left-0 -bottom-1 h-1 rounded-sm w-0 bg-yellow-400 transition-all duration-500 group-hover:w-full"></span>
                    </button>
                    <button className="relative group text-white font-medium">
                    Cars
                    <span className="absolute left-0 -bottom-1 h-1 rounded-sm w-0 bg-pink-600 transition-all duration-500 group-hover:w-full"></span>
                    </button>
                </div>
                {/* ProfileDropdown */}
                <div>
                    <ProfileDropdown />
                </div>
            </div>
        </div>

        {/* Removed the empty <header> tag */}

        {/* Main content with slider */}
        <main className="pt-3 px-3 md:px-8 lg:px-12 max-w-6xl mx-auto h-[30rem]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <ProfileSlider />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
export default Userp;