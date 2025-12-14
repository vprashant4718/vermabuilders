import React from 'react'
 
// src/components/Footer.jsx
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-300 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Left Side - Brand */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-white">Verma Properties</h1>
          <p className="mt-2 text-gray-500 text-sm">Building Trust for Over 20 Years</p>
        </div>

        {/* Middle - Links */}
        <div className="flex justify-center space-x-8">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        {/* Right Side - Social Icons */}
        <div className="flex justify-center md:justify-end space-x-6">
          <a href="https://www.instagram.com/verma._properties/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-700 transition">
            <FaInstagram size={22} />
          </a>
          <a href="https://www.linkedin.com/in/vermaproperties/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">
            <FaLinkedinIn size={22} />
          </a>
          <a href="https://www.youtube.com/@Verma.Properties" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition">
            <FaYoutube size={22} />
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Verma Properties. Crafted with passion by Chandra Prakash Verma.
      </div>
    </footer>
  );
}
