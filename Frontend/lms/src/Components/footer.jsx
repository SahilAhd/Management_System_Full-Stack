import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; 
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed bottom-0 w-full h-45 p-6 backdrop-blur-md bg-gradient-to-l from-pink-600/90 via-black/50 to-black/80 text-white shadow-t z-40"
    >
      <div className='flex flex-col md:flex-row justify-evenly items-start gap-6'>
        <div className='flex flex-col space-y-2'>
          <button className='hover:scale-105 hover:shadow-lg transition-all duration-300'>Home</button>
          <button className='hover:scale-105 hover:shadow-lg transition-all duration-300'>Affiliate</button>
          <button className='hover:scale-105 hover:shadow-lg transition-all duration-300'>Contact Us</button>
          <button className='hover:scale-105 hover:shadow-lg transition-all duration-300'>Testimonials</button>
        </div>
        <div className='flex flex-col space-y-2'>
          <button className='flex items-center gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300'>
            <FaLinkedin /> LinkedIn
          </button>
          <button className='flex items-center gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300'>
            <FaXTwitter /> X.com
          </button>
          <button className='flex items-center gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300'>
            <FaInstagram /> Instagram
          </button>
          <button className='flex items-center gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300'>
            <FaFacebook /> Facebook
          </button>
        </div>
        <div className='flex flex-col space-y-2'>
          <p>All Rights Reserved @2025</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer;
