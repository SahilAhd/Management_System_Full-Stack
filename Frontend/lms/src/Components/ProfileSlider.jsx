import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


const ProfileSlider = () => {
  
  
  // Mouse position for star constellation effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  

  // Star animation variants
  const starVariants = {
    animate: (i) => ({
      opacity: [0.1, 0.7, 0.1],
      scale: [1, 1.2, 1],
      transition: {
        opacity: {
          duration: 2 + i % 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        },
        scale: {
          duration: 3 + i % 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    })
  };

  // Moving constellation lines
  const constellationVariants = {
    animate: (i) => ({
      opacity: [0.1, 0.3, 0.1],
      pathLength: [0, 1, 0],
      transition: {
        opacity: {
          duration: 8 + i % 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        },
        pathLength: {
          duration: 10 + i % 4,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        }
      }
    })
  };

  // Generate random stars
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        id: `star-${i}`,
        size: Math.random() * 2 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5
      });
    }
    return stars;
  };
  
  const stars = generateStars(100);

  return (
    <motion.div
      className="h-auto mb-0  w-full relative overflow-hidden text-white bg-gradient-to-b from-gray-900 to-blue-900">
      {/* Star background */}
      {stars.map((star, i) => (
        <motion.div
          key={star.id}
          custom={i}
          variants={starVariants}
          animate="animate"
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
        />
      ))}

      {/* Interactive constellation effect near mouse */}
      {[...Array(5)].map((_, i) => {
        const x1 = mousePosition.x;
        const y1 = mousePosition.y;
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 100 + Math.random() * 50;
        const x2 = x1 + Math.cos(angle) * distance;
        const y2 = y1 + Math.sin(angle) * distance;
        
        return (
          <motion.svg
            key={`constellation-${i}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ overflow: 'visible' }}
          >
            <motion.line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="0.5"
              custom={i}
              variants={constellationVariants}
              animate="animate"
            />
          </motion.svg>
        );
      })}

      {/* Constellation lines */}
      <svg className="absolute top-0 left-0 w-full h-full">
        {[...Array(10)].map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = x1 + (Math.random() - 0.5) * 30;
          const y2 = y1 + (Math.random() - 0.5) * 30;
          
          return (
            <motion.line
              key={`fixed-constellation-${i}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.5"
              custom={i}
              variants={constellationVariants}
              animate="animate"
            />
          );
        })}
      </svg>

      {/* Top Navbar */}
 
      {/* Content area */}
      <div className="relative z-10 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="rounded-xl shadow-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-4 text-center"
            >
              Welcome to Your Workspace
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-center text-gray-300"
            >
              Your centralized hub for managing tasks, tracking progress, and collaborating with your team.
            </motion.p>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, staggerChildren: 0.1 }}
            >
              {[
                { title: 'Active Projects', count: '12', color: 'bg-blue-500/20' },
                { title: 'Pending Tasks', count: '24', color: 'bg-amber-500/20' },
                { title: 'Team Members', count: '8', color: 'bg-green-500/20' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`${item.color} rounded-lg p-6 text-center shadow-sm`}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                >
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-3xl font-bold mt-2">{item.count}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSlider;