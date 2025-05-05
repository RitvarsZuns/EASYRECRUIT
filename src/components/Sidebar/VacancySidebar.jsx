import React from 'react';
import { Link } from 'react-router-dom';

const VacancySidebar = () => {
  return (
    <div className="w-64 bg-[#1e1e2f] text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-6">EASYRECRUIT</h2>
        
        <div className="mb-4">
          <p className="text-purple-400 font-semibold mb-2">DevOps engineer</p>
          <ul className="pl-2 space-y-1">
            <li><Link to="/dashboard/cv-documents" className="hover:underline">CV documents</Link></li>
            <li><Link to="/dashboard/profiles" className="hover:underline">Profiles</Link></li>
            <li><Link to="/dashboard/favourites" className="hover:underline">Favourites</Link></li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-purple-400 font-semibold mb-2">Marketing specialist</p>
          <ul className="pl-2 space-y-1 text-gray-400">
            <li>CV documents</li>
            <li>Profiles</li>
            <li>Favourites</li>
          </ul>
        </div>

        <div>
          <p className="text-purple-400 font-semibold mb-2">IT Support</p>
          <p className="text-purple-400 font-semibold mb-2">Java developer</p>
        </div>
      </div>

      <p className="text-xs text-purple-700 mt-4">EASYRECRUIT</p>
    </div>
  );
};

export default VacancySidebar;
