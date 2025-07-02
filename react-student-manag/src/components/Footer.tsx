
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Attendance Manager</h2>
            <p className="text-green-200 text-sm mt-1">Managing student absences efficiently</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-green-200">
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/students" className="hover:text-white transition-colors">Students</a></li>
                <li><a href="/absences" className="hover:text-white transition-colors">Absences</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <ul className="space-y-1 text-green-200">
                <li>support@attendancemanager.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-green-700 mt-6 pt-6 text-center text-sm text-green-200">
          <p>&copy; {new Date().getFullYear()} Attendance Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
